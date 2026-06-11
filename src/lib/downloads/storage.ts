import fs from 'fs';
import path from 'path';

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

// Dados iniciais dos produtos (hardcoded para funcionar no Vercel)
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

// Armazenamento em memória para Vercel (removido para usar persistência)
let inMemoryStorage: DownloadsStorage | null = null;

/**
 * Inicializa o armazenamento em memória (desativado para usar persistência)
 */
function initializeInMemoryStorage(): DownloadsStorage {
  if (!inMemoryStorage) {
    inMemoryStorage = {
      globalDownloads: 0,
      products: INITIAL_PRODUCTS,
      downloads: []
    };
    console.log('[Storage] Armazenamento em memória inicializado para Vercel');
  }
  return inMemoryStorage;
}

/**
 * Lê os dados de downloads (compatível com Vercel e local)
 * @returns Dados de downloads armazenados
 */
export function readDownloadsData(): DownloadsStorage {
  try {
    // Usa sempre sistema de arquivos para persistência
    const DOWNLOADS_FILE_PATH = path.join(process.cwd(), 'data', 'downloads.json');

    // Verifica se o arquivo existe
    if (!fs.existsSync(DOWNLOADS_FILE_PATH)) {
      // Cria o diretório se não existir
      const dir = path.dirname(DOWNLOADS_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Cria o arquivo com estrutura inicial se não existir
      const initialData: DownloadsStorage = {
        globalDownloads: 0,
        products: INITIAL_PRODUCTS,
        downloads: []
      };
      fs.writeFileSync(DOWNLOADS_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      console.log('[Storage] Arquivo de downloads criado:', DOWNLOADS_FILE_PATH);
      return initialData;
    }

    // Lê o arquivo existente
    const fileContent = fs.readFileSync(DOWNLOADS_FILE_PATH, 'utf-8');
    const data = JSON.parse(fileContent) as DownloadsStorage;
    console.log('[Storage] Dados lidos com sucesso, downloads:', data.downloads.length);
    return data;
  } catch (error) {
    console.error('[Storage] Erro ao ler dados de downloads:', error);
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
 * @param productId ID do produto
 * @returns Produto encontrado ou null
 */
export function getProductById(productId: string): Product | null {
  const data = readDownloadsData();
  return data.products.find(p => p.id === productId) || null;
}

/**
 * Obtém um produto pelo slug
 * @param slug Slug do produto
 * @returns Produto encontrado ou null
 */
export function getProductBySlug(slug: string): Product | null {
  const data = readDownloadsData();
  return data.products.find(p => p.slug === slug) || null;
}

/**
 * Adiciona um novo download (compatível com Vercel e local)
 * @param downloadData Dados do novo download
 * @returns Dados atualizados de downloads
 */
export function addDownload(downloadData: DownloadData): DownloadsStorage {
  try {
    console.log('[Storage] Adicionando download:', {
      productId: downloadData.productId,
      productName: downloadData.productName,
      email: downloadData.email
    });

    // Usa sempre sistema de arquivos para persistência
    const DOWNLOADS_FILE_PATH = path.join(process.cwd(), 'data', 'downloads.json');

    // Lê os dados atuais
    const currentData = readDownloadsData();

    // Verifica se o produto existe
    const productIndex = currentData.products.findIndex(p => p.id === downloadData.productId);
    if (productIndex === -1) {
      throw new Error(`Produto com ID ${downloadData.productId} não encontrado`);
    }

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

    // Adiciona o novo download
    currentData.downloads.push(downloadWithStatus);

    // Incrementa contador do produto
    currentData.products[productIndex].downloads += 1;

    // Incrementa contador global
    currentData.globalDownloads += 1;

    // Escreve os dados atualizados
    fs.writeFileSync(
      DOWNLOADS_FILE_PATH,
      JSON.stringify(currentData, null, 2),
      'utf-8'
    );

    console.log('[Storage] Download adicionado com sucesso, total downloads:', currentData.downloads.length);
    return currentData;
  } catch (error) {
    console.error('[Storage] Erro ao adicionar download:', error);
    throw new Error('Falha ao salvar dados do download');
  }
}

/**
 * Obtém o contador global de downloads
 * @returns Número total de downloads
 */
export function getGlobalDownloads(): number {
  const data = readDownloadsData();
  return data.globalDownloads;
}

/**
 * Obtém o contador de downloads de um produto específico
 * @param productId ID do produto
 * @returns Número de downloads do produto
 */
export function getProductDownloads(productId: string): number {
  const product = getProductById(productId);
  return product ? product.downloads : 0;
}

/**
 * Obtém todos os downloads registrados
 * @returns Lista de todos os downloads
 */
export function getAllDownloads(): DownloadData[] {
  const data = readDownloadsData();
  return data.downloads;
}

/**
 * Obtém downloads de um produto específico
 * @param productId ID do produto
 * @returns Lista de downloads do produto
 */
export function getDownloadsByProduct(productId: string): DownloadData[] {
  const data = readDownloadsData();
  return data.downloads.filter(d => d.productId === productId);
}

/**
 * Obtém todos os produtos
 * @returns Lista de todos os produtos
 */
export function getAllProducts(): Product[] {
  const data = readDownloadsData();
  return data.products;
}

/**
 * Obtém produtos ordenados por número de downloads (ranking)
 * @returns Lista de produtos ordenada por downloads
 */
export function getProductsByRanking(): Product[] {
  const data = readDownloadsData();
  return [...data.products].sort((a, b) => b.downloads - a.downloads);
}

/**
 * Apaga um registo de download específico (compatível com Vercel e local)
 * @param downloadIndex Índice do registo a apagar
 * @returns Dados atualizados de downloads
 */
export function deleteDownload(downloadIndex: number): DownloadsStorage {
  try {
    console.log('[Storage] Apagando download no índice:', downloadIndex);

    // Usa sempre sistema de arquivos para persistência
    const DOWNLOADS_FILE_PATH = path.join(process.cwd(), 'data', 'downloads.json');

    const currentData = readDownloadsData();

    // Verifica se o índice é válido
    if (downloadIndex < 0 || downloadIndex >= currentData.downloads.length) {
      throw new Error('Índice de download inválido');
    }

    const deletedDownload = currentData.downloads[downloadIndex];

    // Remove o download
    currentData.downloads.splice(downloadIndex, 1);

    // Decrementa contador do produto
    const productIndex = currentData.products.findIndex(p => p.id === deletedDownload.productId);
    if (productIndex !== -1 && currentData.products[productIndex].downloads > 0) {
      currentData.products[productIndex].downloads -= 1;
    }

    // Decrementa contador global
    if (currentData.globalDownloads > 0) {
      currentData.globalDownloads -= 1;
    }

    // Escreve os dados atualizados
    fs.writeFileSync(
      DOWNLOADS_FILE_PATH,
      JSON.stringify(currentData, null, 2),
      'utf-8'
    );

    console.log('[Storage] Download apagado com sucesso, restantes:', currentData.downloads.length);
    return currentData;
  } catch (error) {
    console.error('[Storage] Erro ao apagar download:', error);
    throw new Error('Falha ao apagar registo de download');
  }
}

/**
 * Apaga todos os registos de downloads (compatível com Vercel e local)
 * @returns Dados atualizados de downloads
 */
export function deleteAllDownloads(): DownloadsStorage {
  try {
    console.log('[Storage] Apagando todos os downloads');

    // Usa sempre sistema de arquivos para persistência
    const DOWNLOADS_FILE_PATH = path.join(process.cwd(), 'data', 'downloads.json');

    const currentData = readDownloadsData();

    // Limpa todos os downloads
    currentData.downloads = [];

    // Reseta contadores de produtos
    currentData.products.forEach(product => {
      product.downloads = 0;
    });

    // Reseta contador global
    currentData.globalDownloads = 0;

    // Escreve os dados atualizados
    fs.writeFileSync(
      DOWNLOADS_FILE_PATH,
      JSON.stringify(currentData, null, 2),
      'utf-8'
    );

    console.log('[Storage] Todos os downloads apagados com sucesso');
    return currentData;
  } catch (error) {
    console.error('[Storage] Erro ao apagar todos os downloads:', error);
    throw new Error('Falha ao apagar todos os registos de download');
  }
}

/**
 * Verifica se existe um download por email
 * @param email Email a verificar
 * @returns Lista de downloads encontrados para o email
 */
export function getDownloadsByEmail(email: string): DownloadData[] {
  const data = readDownloadsData();
  return data.downloads.filter(d => d.email.toLowerCase() === email.toLowerCase());
}

/**
 * Verifica se existe um download por telefone
 * @param telefone Telefone a verificar
 * @returns Lista de downloads encontrados para o telefone
 */
export function getDownloadsByTelefone(telefone: string): DownloadData[] {
  const data = readDownloadsData();
  return data.downloads.filter(d => d.telefone === telefone);
}

/**
 * Verifica se existe um download por email e telefone
 * @param email Email a verificar
 * @param telefone Telefone a verificar
 * @returns Lista de downloads encontrados para o email e/ou telefone
 */
export function getDownloadsByEmailOrTelefone(email: string, telefone: string): DownloadData[] {
  const data = readDownloadsData();
  return data.downloads.filter(d =>
    d.email.toLowerCase() === email.toLowerCase() || d.telefone === telefone
  );
}

/**
 * Verifica se existe um download por email para um produto específico
 * @param email Email a verificar
 * @param productId ID do produto
 * @returns Download encontrado ou null
 */
export function getDownloadByEmailAndProduct(email: string, productId: string): DownloadData | null {
  const data = readDownloadsData();
  return data.downloads.find(d =>
    d.email.toLowerCase() === email.toLowerCase() && d.productId === productId
  ) || null;
}

/**
 * Verifica se existe um download por telefone para um produto específico
 * @param telefone Telefone a verificar
 * @param productId ID do produto
 * @returns Download encontrado ou null
 */
export function getDownloadByTelefoneAndProduct(telefone: string, productId: string): DownloadData | null {
  const data = readDownloadsData();
  return data.downloads.find(d =>
    d.telefone === telefone && d.productId === productId
  ) || null;
}

/**
 * Substitui um download existente por um novo
 * @param oldEmail Email antigo (para encontrar o registro a substituir)
 * @param oldTelefone Telefone antigo (para encontrar o registro a substituir)
 * @param newDownloadData Novos dados do download
 * @returns Dados atualizados de downloads
 */
export function replaceDownload(oldEmail: string, oldTelefone: string, newDownloadData: DownloadData): DownloadsStorage {
  try {
    console.log('[Storage] Substituindo download:', {
      oldEmail,
      oldTelefone,
      newEmail: newDownloadData.email,
      newTelefone: newDownloadData.telefone,
      productId: newDownloadData.productId
    });

    const DOWNLOADS_FILE_PATH = path.join(process.cwd(), 'data', 'downloads.json');
    const currentData = readDownloadsData();

    // Encontra o índice do download a substituir (por email ou telefone)
    const downloadIndex = currentData.downloads.findIndex(d =>
      (d.email.toLowerCase() === oldEmail.toLowerCase() || d.telefone === oldTelefone) &&
      d.productId === newDownloadData.productId
    );

    if (downloadIndex === -1) {
      throw new Error('Download não encontrado para substituição');
    }

    const oldDownload = currentData.downloads[downloadIndex];

    // Substitui o download
    currentData.downloads[downloadIndex] = newDownloadData;

    console.log('[Storage] Download substituído com sucesso');
    return currentData;
  } catch (error) {
    console.error('[Storage] Erro ao substituir download:', error);
    throw new Error('Falha ao substituir registo de download');
  }
}
