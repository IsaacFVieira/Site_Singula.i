'use client';

import React, { useState, useEffect } from 'react';
import { Download, Users, Calendar, Building2, Mail, Phone, Lock, RefreshCw, Trash2, AlertTriangle, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DownloadData {
  productId: string;
  productName: string;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  planoSelecionado: 'FREE' | 'STANDARD' | 'PREMIUM';
  data: string;
  dataFormatada: string;
  dataInicioAcesso?: string;
  statusPagamento: 'pendente' | 'pago' | 'free';
}

interface Product {
  id: string;
  name: string;
  slug: string;
  fileName: string;
  downloads: number;
}

interface DownloadsResponse {
  globalDownloads: number;
  products: Product[];
  rankedProducts: Product[];
  downloads: DownloadData[];
}

export default function SecretAdminDownloadsPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<DownloadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/downloads');
      
      if (!response.ok) {
        throw new Error(t('admin.errorLoading'));
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const deleteSingleRecord = async (index: number) => {
    if (!confirm(t('admin.confirmDelete'))) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/downloads?index=${index}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(t('admin.errorDeleting'));
      }

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.errorDeleting'));
    } finally {
      setDeleting(false);
    }
  };

  const deleteAllRecords = async () => {
    setDeleting(true);
    try {
      const response = await fetch('/api/admin/downloads?deleteAll=true', {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(t('admin.errorDeletingAll'));
      }

      setDeleteAllModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.errorDeletingAll'));
    } finally {
      setDeleting(false);
    }
  };

  const generatePDF = () => {
    if (!data || data.downloads.length === 0) return;

    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Relatório de Downloads', 14, 22);
    
    // Data
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-AO')}`, 14, 30);
    
    // Estatísticas
    doc.setFontSize(12);
    doc.text(`Total de Downloads: ${data.globalDownloads}`, 14, 40);
    doc.text(`Total de Produtos: ${data.products.length}`, 14, 48);
    
    // Tabela de downloads
    const tableData = data.downloads.map(download => [
      download.productName,
      download.planoSelecionado,
      download.statusPagamento,
      download.nome,
      download.email,
      download.telefone,
      download.empresa || '-',
      download.dataFormatada
    ]);
    
    autoTable(doc, {
      startY: 55,
      head: [['Produto', 'Plano', 'Status', 'Nome', 'Email', 'Telefone', 'Empresa', 'Data']],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255
      }
    });
    
    doc.save('relatorio-downloads.pdf');
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('pt-AO');
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--card)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 bg-[var(--border)] rounded-lg">
                <Lock className="w-5 h-5 text-[var(--muted)]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  {t('admin.secretTitle')}
                </h1>
                <p className="text-xs sm:text-sm text-[var(--muted)]">
                  {t('admin.secretDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={generatePDF}
                disabled={loading || deleting || !data || data.downloads.length === 0}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button
                onClick={() => setDeleteAllModalOpen(true)}
                disabled={loading || deleting || !data || data.downloads.length === 0}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('admin.deleteAll')}</span>
                <span className="sm:hidden">{t('admin.delete')}</span>
              </button>
              <button
                onClick={loadData}
                disabled={loading || deleting}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                <RefreshCw className={`w-4 h-4 ${loading || deleting ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{t('admin.refresh')}</span>
                <span className="sm:hidden">{t('admin.refresh')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-[var(--card)] rounded-xl p-4 sm:p-6 border border-[var(--border)] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-[var(--muted)] mb-1">
                    {t('admin.totalGlobal')}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
                    {formatNumber(data.globalDownloads)}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-[var(--primary)]/10 rounded-lg">
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--primary)]" />
                </div>
              </div>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-4 sm:p-6 border border-[var(--border)] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-[var(--muted)] mb-1">
                    {t('admin.products')}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
                    {formatNumber(data.products.length)}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-[var(--border)] rounded-lg">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent)]" />
                </div>
              </div>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-4 sm:p-6 border border-[var(--border)] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-[var(--muted)] mb-1">
                    {t('admin.uniqueUsers')}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
                    {formatNumber(data.downloads.length)}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-8 sm:p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            <p className="mt-4 text-sm sm:text-base text-[var(--muted)]">{t('admin.loadingData')}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-[var(--card)] rounded-xl border border-red-500/30 p-8 sm:p-12 text-center">
            <p className="text-sm sm:text-base text-red-400 font-medium">{error}</p>
            <button
              onClick={loadData}
              className="mt-4 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
            >
              {t('admin.tryAgain')}
            </button>
          </div>
        )}

        {/* Product Ranking */}
        {data && !loading && !error && (
          <div className="bg-[#1F2937] rounded-xl border border-[#374151] shadow-sm overflow-hidden mb-6 sm:mb-8">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#374151]">
              <h2 className="text-base sm:text-lg font-semibold text-[var(--foreground)]">
                {t('admin.productRanking')}
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {data.rankedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 sm:p-4 bg-[var(--background)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-[#F59E0B] text-white' :
                        index === 1 ? 'bg-[#6B7280] text-white' :
                        index === 2 ? 'bg-[#DC2626] text-white' :
                        'bg-[#3B82F6] text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)]">{product.name}</h3>
                        <p className="text-xs sm:text-sm text-[var(--muted)]">{product.slug}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg sm:text-2xl font-bold text-[var(--accent)]">{formatNumber(product.downloads)}</p>
                      <p className="text-xs sm:text-sm text-[var(--muted)]">{t('admin.downloads')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Downloads Table */}
        {data && !loading && !error && (
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-[var(--foreground)]">
                {t('admin.downloadHistory')}
              </h2>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-xs sm:text-sm bg-[var(--background)] text-[var(--foreground)]"
                >
                  <option value="all">{t('admin.allProducts')}</option>
                  {data.products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {data.downloads.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <Download className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--muted)] mx-auto mb-4" />
                <p className="text-sm sm:text-base text-[var(--muted)]">{t('admin.noDownloads')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                        {t('admin.product')}
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                        {t('admin.plan')}
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                        {t('admin.status')}
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                        {t('admin.name')}
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                        {t('admin.email')}
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                        {t('admin.phone')}
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                        {t('admin.company')}
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                        {t('admin.date')}
                      </th>
                      <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                                {t('admin.actions')}
                              </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
                    {data.downloads
                      .filter(download => selectedProduct === 'all' || download.productId === selectedProduct)
                      .map((download, filteredIndex) => {
                        const originalIndex = data.downloads.indexOf(download);
                        return (
                          <tr key={originalIndex} className="hover:bg-[var(--background)] transition-colors">
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className="px-2 sm:px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] sm:text-xs font-medium rounded-full">
                                {download.productName}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className={`px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium rounded-full ${
                                download.planoSelecionado === 'FREE' ? 'bg-[#10B981] text-white' :
                                download.planoSelecionado === 'STANDARD' ? 'bg-[#3B82F6] text-white' :
                                'bg-[#F59E0B] text-white'
                              }`}>
                                {download.planoSelecionado}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className={`px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium rounded-full ${
                                download.statusPagamento === 'free' ? 'bg-[#10B981] text-white' :
                                download.statusPagamento === 'pago' ? 'bg-[#3B82F6] text-white' :
                                'bg-[#F59E0B] text-white'
                              }`}>
                                {download.statusPagamento}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
                                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)]" />
                                </div>
                                <div className="ml-2 sm:ml-4">
                                  <div className="text-xs sm:text-sm font-medium text-[var(--foreground)]">
                                    {download.nome}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="flex items-center text-xs sm:text-sm text-[var(--muted)]">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-[var(--muted)]" />
                                <span className="hidden sm:inline">{download.email}</span>
                                <span className="sm:hidden">{download.email.substring(0, 15)}...</span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="flex items-center text-xs sm:text-sm text-[var(--muted)]">
                                <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-[var(--muted)]" />
                                {download.telefone}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              {download.empresa ? (
                                <div className="flex items-center text-xs sm:text-sm text-[var(--muted)]">
                                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-[var(--muted)]" />
                                  <span className="hidden sm:inline">{download.empresa}</span>
                                  <span className="sm:hidden">{download.empresa.substring(0, 10)}...</span>
                                </div>
                              ) : (
                                <span className="text-xs sm:text-sm text-[var(--muted)]">-</span>
                              )}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="flex items-center text-xs sm:text-sm text-[var(--muted)]">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-[var(--muted)]" />
                                <span className="hidden sm:inline">{download.dataFormatada}</span>
                                <span className="sm:hidden">{download.dataFormatada.split(' ')[0]}</span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <button
                                onClick={() => deleteSingleRecord(originalIndex)}
                                disabled={deleting}
                                className="p-1.5 sm:p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title={t('admin.deleteRecord')}
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <p className="text-center text-xs sm:text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} SINGULAR.i - {t('admin.secretFooter')}
        </p>
      </div>

      {/* Delete All Modal */}
      {deleteAllModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] rounded-xl p-5 sm:p-6 max-w-md w-full mx-4 shadow-2xl border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 sm:p-3 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
                {t('admin.confirmDeleteTitle')}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-[var(--muted)] mb-6">
              {t('admin.confirmDeleteAllDesc')}
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setDeleteAllModalOpen(false)}
                disabled={deleting}
                className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[var(--foreground)] text-sm sm:text-base"
              >
                {t('admin.cancel')}
              </button>
              <button
                onClick={deleteAllRecords}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {deleting ? t('admin.deleting') : t('admin.deleteAll')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
