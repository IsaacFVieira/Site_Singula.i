import { neon } from '@neondatabase/serverless';

// Tipos para os dados de download
export interface DownloadData {
  productId: string;
  productName: string;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  planoSelecionado: 'FREE' | 'STANDARD' | 'PREMIUM';
  data: string;
  dataInicioAcesso?: string;
  statusPagamento: 'pendente' | 'pago' | 'free';
  statusPedido: 'pendente' | 'enviado';
  dataPrevistaEnvio: string;
  dataEnvio?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  fileName: string;
  downloads: number;
}

export interface DownloadsStorage {
  globalDownloads: number;
  products: Product[];
  downloads: DownloadData[];
}

// Dados iniciais dos produtos
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'doctor-plus',
    name: 'Doctor+',
    slug: 'doctor-plus',
    fileName: 'doctor-plus-demo.txt',
    downloads: 0
  },
  {
    id: 'jafadh',
    name: 'JAFADH',
    slug: 'jafadh',
    fileName: 'jafadh-demo.txt',
    downloads: 0
  }
];

// Verifica se está rodando no Vercel
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

// Conexão com Neon Database
let sql: any = null;

/**
 * Inicializa a conexão com o banco de dados
 */
function getDatabaseConnection() {
  if (!sql) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('[Database] DATABASE_URL não configurada');
      // Não throw error para não falhar o processo
      // Retorna null para indicar que não há conexão
      return null;
    }
    sql = neon(databaseUrl);
    console.log('[Database] Conexão com Neon Database estabelecida');
  }
  return sql;
}

/**
 * Inicializa as tabelas do banco de dados
 */
async function initializeDatabase() {
  try {
    const db = getDatabaseConnection();

    if (!db) {
      console.error('[Database] Sem conexão com banco de dados, não é possível inicializar');
      return;
    }

    // Cria tabela de produtos se não existir
    await db`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        fileName TEXT NOT NULL,
        downloads INTEGER DEFAULT 0
      )
    `;

    // Cria tabela de downloads se não existir
    await db`
      CREATE TABLE IF NOT EXISTS downloads (
        id SERIAL PRIMARY KEY,
        productId TEXT NOT NULL,
        productName TEXT NOT NULL,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        telefone TEXT NOT NULL,
        empresa TEXT,
        planoSelecionado TEXT NOT NULL,
        data TEXT NOT NULL,
        dataInicioAcesso TEXT,
        statusPagamento TEXT NOT NULL,
        statusPedido TEXT NOT NULL,
        dataPrevistaEnvio TEXT NOT NULL,
        dataEnvio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Cria tabela de configurações se não existir
    await db`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `;

    // Insere produtos iniciais se não existirem
    for (const product of INITIAL_PRODUCTS) {
      await db`
        INSERT INTO products (id, name, slug, fileName, downloads)
        VALUES (${product.id}, ${product.name}, ${product.slug}, ${product.fileName}, ${product.downloads})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    // Inicializa contador global se não existir
    await db`
      INSERT INTO settings (key, value)
      VALUES ('globalDownloads', '0')
      ON CONFLICT (key) DO NOTHING
    `;

    console.log('[Database] Tabelas inicializadas com sucesso');
  } catch (error) {
    console.error('[Database] Erro ao inicializar banco de dados:', error);
    // Não throw error para não falhar o processo
  }
}

/**
 * Lê os dados de downloads do banco de dados
 */
export async function readDownloadsData(): Promise<DownloadsStorage> {
  try {
    const db = getDatabaseConnection();

    if (!db) {
      console.error('[Database] Sem conexão com banco de dados, retornando dados iniciais');
      return {
        globalDownloads: 0,
        products: INITIAL_PRODUCTS,
        downloads: []
      };
    }

    // Inicializa banco de dados se necessário
    await initializeDatabase();

    // Busca produtos
    const products = await db`SELECT * FROM products ORDER BY downloads DESC`;
    const productsArray: Product[] = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      fileName: p.fileName,
      downloads: p.downloads
    }));

    // Busca downloads
    const downloads = await db`SELECT * FROM downloads ORDER BY created_at DESC`;
    const downloadsArray: DownloadData[] = downloads.map((d: any) => ({
      productId: d.productId,
      productName: d.productName,
      nome: d.nome,
      email: d.email,
      telefone: d.telefone,
      empresa: d.empresa,
      planoSelecionado: d.planoSelecionado,
      data: d.data,
      dataInicioAcesso: d.dataInicioAcesso,
      statusPagamento: d.statusPagamento,
      statusPedido: d.statusPedido,
      dataPrevistaEnvio: d.dataPrevistaEnvio,
      dataEnvio: d.dataEnvio
    }));

    // Busca contador global
    const globalDownloadsResult = await db`SELECT value FROM settings WHERE key = 'globalDownloads'`;
    const globalDownloads = globalDownloadsResult[0] ? parseInt(globalDownloadsResult[0].value) : 0;

    console.log('[Database] Dados lidos com sucesso, downloads:', downloadsArray.length);
    return {
      globalDownloads,
      products: productsArray,
      downloads: downloadsArray
    };
  } catch (error) {
    console.error('[Database] Erro ao ler dados de downloads:', error);
    // Retorna estrutura vazia em caso de erro
    return {
      globalDownloads: 0,
      products: INITIAL_PRODUCTS,
      downloads: []
    };
  }
}

/**
 * Obtém um produto pelo ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  const db = getDatabaseConnection();
  if (!db) {
    console.error('[Database] Sem conexão, retornando produto inicial');
    return INITIAL_PRODUCTS.find(p => p.id === productId) || null;
  }
  const result = await db`SELECT * FROM products WHERE id = ${productId}`;
  if (result.length === 0) return null;
  const p = result[0];
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    fileName: p.fileName,
    downloads: p.downloads
  };
}

/**
 * Obtém um produto pelo slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getDatabaseConnection();
  if (!db) {
    console.error('[Database] Sem conexão, retornando produto inicial');
    return INITIAL_PRODUCTS.find(p => p.slug === slug) || null;
  }
  const result = await db`SELECT * FROM products WHERE slug = ${slug}`;
  if (result.length === 0) return null;
  const p = result[0];
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    fileName: p.fileName,
    downloads: p.downloads
  };
}

/**
 * Adiciona um novo download
 */
export async function addDownload(downloadData: DownloadData): Promise<DownloadsStorage> {
  try {
    console.log('[Database] Adicionando download:', {
      productId: downloadData.productId,
      productName: downloadData.productName,
      email: downloadData.email
    });

    const db = getDatabaseConnection();

    if (!db) {
      console.error('[Database] Sem conexão com banco de dados, download não será salvo');
      // Retorna estrutura inicial para não falhar o processo
      return {
        globalDownloads: 0,
        products: INITIAL_PRODUCTS,
        downloads: []
      };
    }

    // Inicializa banco de dados se necessário
    await initializeDatabase();

    // Calcula data prevista de envio (7 dias a partir da data do pedido)
    const dataPedido = new Date(downloadData.data);
    const dataPrevistaEnvio = new Date(dataPedido.getTime() + (7 * 24 * 60 * 60 * 1000)); // +7 dias

    // Adiciona os campos de status ao download
    const downloadWithStatus: DownloadData = {
      ...downloadData,
      statusPedido: 'pendente',
      dataPrevistaEnvio: dataPrevistaEnvio.toISOString(),
      dataEnvio: undefined
    };

    // Insere o novo download
    await db`
      INSERT INTO downloads (
        productId, productName, nome, email, telefone, empresa,
        planoSelecionado, data, dataInicioAcesso, statusPagamento,
        statusPedido, dataPrevistaEnvio, dataEnvio
      )
      VALUES (
        ${downloadWithStatus.productId},
        ${downloadWithStatus.productName},
        ${downloadWithStatus.nome},
        ${downloadWithStatus.email},
        ${downloadWithStatus.telefone},
        ${downloadWithStatus.empresa || null},
        ${downloadWithStatus.planoSelecionado},
        ${downloadWithStatus.data},
        ${downloadWithStatus.dataInicioAcesso || null},
        ${downloadWithStatus.statusPagamento},
        ${downloadWithStatus.statusPedido},
        ${downloadWithStatus.dataPrevistaEnvio},
        ${downloadWithStatus.dataEnvio || null}
      )
    `;

    // Incrementa contador do produto
    await db`
      UPDATE products
      SET downloads = downloads + 1
      WHERE id = ${downloadData.productId}
    `;

    // Incrementa contador global
    await db`
      UPDATE settings
      SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT)
      WHERE key = 'globalDownloads'
    `;

    console.log('[Database] Download adicionado com sucesso');
    return await readDownloadsData();
  } catch (error) {
    console.error('[Database] Erro ao adicionar download:', error);
    // Não throw error para não falhar o processo
    // Retorna estrutura inicial
    return {
      globalDownloads: 0,
      products: INITIAL_PRODUCTS,
      downloads: []
    };
  }
}

/**
 * Obtém o contador global de downloads
 */
export async function getGlobalDownloads(): Promise<number> {
  const db = getDatabaseConnection();
  if (!db) {
    console.error('[Database] Sem conexão, retornando contador inicial');
    return 0;
  }
  const result = await db`SELECT value FROM settings WHERE key = 'globalDownloads'`;
  return result[0] ? parseInt(result[0].value) : 0;
}

/**
 * Obtém o contador de downloads de um produto específico
 */
export async function getProductDownloads(productId: string): Promise<number> {
  const product = await getProductById(productId);
  return product ? product.downloads : 0;
}

/**
 * Obtém todos os downloads registrados
 */
export async function getAllDownloads(): Promise<DownloadData[]> {
  const data = await readDownloadsData();
  return data.downloads;
}

/**
 * Obtém downloads de um produto específico
 */
export async function getDownloadsByProduct(productId: string): Promise<DownloadData[]> {
  const db = getDatabaseConnection();
  if (!db) {
    console.error('[Database] Sem conexão, retornando lista vazia');
    return [];
  }
  const result = await db`SELECT * FROM downloads WHERE productId = ${productId} ORDER BY created_at DESC`;
  return result.map((d: any) => ({
    productId: d.productId,
    productName: d.productName,
    nome: d.nome,
    email: d.email,
    telefone: d.telefone,
    empresa: d.empresa,
    planoSelecionado: d.planoSelecionado,
    data: d.data,
    dataInicioAcesso: d.dataInicioAcesso,
    statusPagamento: d.statusPagamento,
    statusPedido: d.statusPedido,
    dataPrevistaEnvio: d.dataPrevistaEnvio,
    dataEnvio: d.dataEnvio
  }));
}

/**
 * Obtém todos os produtos
 */
export async function getAllProducts(): Promise<Product[]> {
  const data = await readDownloadsData();
  return data.products;
}

/**
 * Obtém produtos ordenados por número de downloads (ranking)
 */
export async function getProductsByRanking(): Promise<Product[]> {
  const data = await readDownloadsData();
  return [...data.products].sort((a, b) => b.downloads - a.downloads);
}

/**
 * Apaga um registo de download específico
 */
export async function deleteDownload(downloadIndex: number): Promise<DownloadsStorage> {
  try {
    console.log('[Database] Apagando download no índice:', downloadIndex);

    const db = getDatabaseConnection();
    if (!db) {
      console.error('[Database] Sem conexão, não é possível apagar');
      return {
        globalDownloads: 0,
        products: INITIAL_PRODUCTS,
        downloads: []
      };
    }

    const data = await readDownloadsData();

    // Verifica se o índice é válido
    if (downloadIndex < 0 || downloadIndex >= data.downloads.length) {
      throw new Error('Índice de download inválido');
    }

    const deletedDownload = data.downloads[downloadIndex];

    // Remove o download (usando ID se disponível, ou usando combinação de campos)
    await db`
      DELETE FROM downloads
      WHERE productId = ${deletedDownload.productId}
      AND email = ${deletedDownload.email}
      AND telefone = ${deletedDownload.telefone}
      AND data = ${deletedDownload.data}
    `;

    // Decrementa contador do produto
    await db`
      UPDATE products
      SET downloads = GREATEST(downloads - 1, 0)
      WHERE id = ${deletedDownload.productId}
    `;

    // Decrementa contador global
    await db`
      UPDATE settings
      SET value = CAST(GREATEST(CAST(value AS INTEGER) - 1, 0) AS TEXT)
      WHERE key = 'globalDownloads'
    `;

    console.log('[Database] Download apagado com sucesso');
    return await readDownloadsData();
  } catch (error) {
    console.error('[Database] Erro ao apagar download:', error);
    // Não throw error para não falhar o processo
    return {
      globalDownloads: 0,
      products: INITIAL_PRODUCTS,
      downloads: []
    };
  }
}

/**
 * Apaga todos os registos de downloads
 */
export async function deleteAllDownloads(): Promise<DownloadsStorage> {
  try {
    console.log('[Database] Apagando todos os downloads');

    const db = getDatabaseConnection();
    if (!db) {
      console.error('[Database] Sem conexão, não é possível apagar');
      return {
        globalDownloads: 0,
        products: INITIAL_PRODUCTS,
        downloads: []
      };
    }

    // Limpa todos os downloads
    await db`DELETE FROM downloads`;

    // Reseta contadores de produtos
    await db`UPDATE products SET downloads = 0`;

    // Reseta contador global
    await db`UPDATE settings SET value = '0' WHERE key = 'globalDownloads'`;

    console.log('[Database] Todos os downloads apagados com sucesso');
    return await readDownloadsData();
  } catch (error) {
    console.error('[Database] Erro ao apagar todos os downloads:', error);
    // Não throw error para não falhar o processo
    return {
      globalDownloads: 0,
      products: INITIAL_PRODUCTS,
      downloads: []
    };
  }
}

/**
 * Verifica se existe um download por email
 */
export async function getDownloadsByEmail(email: string): Promise<DownloadData[]> {
  const db = getDatabaseConnection();
  if (!db) {
    console.error('[Database] Sem conexão, retornando lista vazia');
    return [];
  }
  const result = await db`SELECT * FROM downloads WHERE LOWER(email) = LOWER(${email}) ORDER BY created_at DESC`;
  return result.map((d: any) => ({
    productId: d.productId,
    productName: d.productName,
    nome: d.nome,
    email: d.email,
    telefone: d.telefone,
    empresa: d.empresa,
    planoSelecionado: d.planoSelecionado,
    data: d.data,
    dataInicioAcesso: d.dataInicioAcesso,
    statusPagamento: d.statusPagamento,
    statusPedido: d.statusPedido,
    dataPrevistaEnvio: d.dataPrevistaEnvio,
    dataEnvio: d.dataEnvio
  }));
}

/**
 * Verifica se existe um download por telefone
 */
export async function getDownloadsByTelefone(telefone: string): Promise<DownloadData[]> {
  const db = getDatabaseConnection();
  if (!db) {
    console.error('[Database] Sem conexão, retornando lista vazia');
    return [];
  }
  const result = await db`SELECT * FROM downloads WHERE telefone = ${telefone} ORDER BY created_at DESC`;
  return result.map((d: any) => ({
    productId: d.productId,
    productName: d.productName,
    nome: d.nome,
    email: d.email,
    telefone: d.telefone,
    empresa: d.empresa,
    planoSelecionado: d.planoSelecionado,
    data: d.data,
    dataInicioAcesso: d.dataInicioAcesso,
    statusPagamento: d.statusPagamento,
    statusPedido: d.statusPedido,
    dataPrevistaEnvio: d.dataPrevistaEnvio,
    dataEnvio: d.dataEnvio
  }));
}

/**
 * Verifica se existe um download por email e telefone
 */
export async function getDownloadsByEmailOrTelefone(email: string, telefone: string): Promise<DownloadData[]> {
  const db = getDatabaseConnection();
  if (!db) {
    console.error('[Database] Sem conexão, retornando lista vazia');
    return [];
  }
  const result = await db`
    SELECT * FROM downloads
    WHERE LOWER(email) = LOWER(${email}) OR telefone = ${telefone}
    ORDER BY created_at DESC
  `;
  return result.map((d: any) => ({
    productId: d.productId,
    productName: d.productName,
    nome: d.nome,
    email: d.email,
    telefone: d.telefone,
    empresa: d.empresa,
    planoSelecionado: d.planoSelecionado,
    data: d.data,
    dataInicioAcesso: d.dataInicioAcesso,
    statusPagamento: d.statusPagamento,
    statusPedido: d.statusPedido,
    dataPrevistaEnvio: d.dataPrevistaEnvio,
    dataEnvio: d.dataEnvio
  }));
}

/**
 * Verifica se existe um download por email para um produto específico
 */
export async function getDownloadByEmailAndProduct(email: string, productId: string): Promise<DownloadData | null> {
  const db = getDatabaseConnection();
  if (!db) {
    console.error('[Database] Sem conexão, retornando null');
    return null;
  }
  const result = await db`
    SELECT * FROM downloads
    WHERE LOWER(email) = LOWER(${email}) AND productId = ${productId}
    ORDER BY created_at DESC
    LIMIT 1
  `;
  if (result.length === 0) return null;
  const d = result[0];
  return {
    productId: d.productId,
    productName: d.productName,
    nome: d.nome,
    email: d.email,
    telefone: d.telefone,
    empresa: d.empresa,
    planoSelecionado: d.planoSelecionado,
    data: d.data,
    dataInicioAcesso: d.dataInicioAcesso,
    statusPagamento: d.statusPagamento,
    statusPedido: d.statusPedido,
    dataPrevistaEnvio: d.dataPrevistaEnvio,
    dataEnvio: d.dataEnvio
  };
}

/**
 * Verifica se existe um download por telefone para um produto específico
 */
export async function getDownloadByTelefoneAndProduct(telefone: string, productId: string): Promise<DownloadData | null> {
  const db = getDatabaseConnection();
  if (!db) {
    console.error('[Database] Sem conexão, retornando null');
    return null;
  }
  const result = await db`
    SELECT * FROM downloads
    WHERE telefone = ${telefone} AND productId = ${productId}
    ORDER BY created_at DESC
    LIMIT 1
  `;
  if (result.length === 0) return null;
  const d = result[0];
  return {
    productId: d.productId,
    productName: d.productName,
    nome: d.nome,
    email: d.email,
    telefone: d.telefone,
    empresa: d.empresa,
    planoSelecionado: d.planoSelecionado,
    data: d.data,
    dataInicioAcesso: d.dataInicioAcesso,
    statusPagamento: d.statusPagamento,
    statusPedido: d.statusPedido,
    dataPrevistaEnvio: d.dataPrevistaEnvio,
    dataEnvio: d.dataEnvio
  };
}

/**
 * Substitui um download existente por um novo
 */
export async function replaceDownload(oldEmail: string, oldTelefone: string, newDownloadData: DownloadData): Promise<DownloadsStorage> {
  try {
    console.log('[Database] Substituindo download:', {
      oldEmail,
      oldTelefone,
      newEmail: newDownloadData.email,
      newTelefone: newDownloadData.telefone,
      productId: newDownloadData.productId
    });

    const db = getDatabaseConnection();
    if (!db) {
      console.error('[Database] Sem conexão, não é possível substituir');
      return {
        globalDownloads: 0,
        products: INITIAL_PRODUCTS,
        downloads: []
      };
    }

    // Calcula data prevista de envio (7 dias a partir da data do pedido)
    const dataPedido = new Date(newDownloadData.data);
    const dataPrevistaEnvio = new Date(dataPedido.getTime() + (7 * 24 * 60 * 60 * 1000)); // +7 dias

    // Adiciona os campos de status ao download
    const downloadWithStatus: DownloadData = {
      ...newDownloadData,
      statusPedido: 'pendente',
      dataPrevistaEnvio: dataPrevistaEnvio.toISOString(),
      dataEnvio: undefined
    };

    // Atualiza o download existente
    await db`
      UPDATE downloads
      SET
        nome = ${downloadWithStatus.nome},
        email = ${downloadWithStatus.email},
        telefone = ${downloadWithStatus.telefone},
        empresa = ${downloadWithStatus.empresa || null},
        planoSelecionado = ${downloadWithStatus.planoSelecionado},
        data = ${downloadWithStatus.data},
        dataInicioAcesso = ${downloadWithStatus.dataInicioAcesso || null},
        statusPagamento = ${downloadWithStatus.statusPagamento},
        statusPedido = ${downloadWithStatus.statusPedido},
        dataPrevistaEnvio = ${downloadWithStatus.dataPrevistaEnvio},
        dataEnvio = ${downloadWithStatus.dataEnvio || null}
      WHERE
        (LOWER(email) = LOWER(${oldEmail}) OR telefone = ${oldTelefone})
        AND productId = ${newDownloadData.productId}
    `;

    console.log('[Database] Download substituído com sucesso');
    return await readDownloadsData();
  } catch (error) {
    console.error('[Database] Erro ao substituir download:', error);
    // Não throw error para não falhar o processo
    return {
      globalDownloads: 0,
      products: INITIAL_PRODUCTS,
      downloads: []
    };
  }
}
