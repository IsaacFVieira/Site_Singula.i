'use client';

import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface ProductDownloadCounterProps {
  productId: string;
  productName?: string;
}

/**
 * Componente que exibe o contador de downloads de um produto específico
 * Busca o contador atual da API e exibe de forma visual atraente
 */
const ProductDownloadCounter: React.FC<ProductDownloadCounterProps> = ({ productId, productName }) => {
  const [downloads, setDownloads] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca o contador de downloads do produto da API
    const fetchProductDownloads = async () => {
      try {
        const response = await fetch(`/api/download?productId=${productId}`);
        if (response.ok) {
          const data = await response.json();
          setDownloads(data.productDownloads || 0);
        }
      } catch (error) {
        console.error('Erro ao buscar contador de downloads do produto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDownloads();
  }, [productId]);

  // Formata número para exibição
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}k+`;
    }
    return `${num}+`;
  };

  return (
    <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] rounded-2xl p-6 text-[#1a1a2e] shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[var(--foreground)]/20 rounded-lg">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#1a1a2e]/80 mb-1">
              {productName || 'Downloads'}
            </p>
            <p className="text-3xl font-bold">
              {loading ? '...' : formatNumber(downloads)}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[var(--foreground)]/10 px-4 py-2 rounded-lg">
          <span className="text-sm font-medium">
            {loading ? 'Carregando...' : `${downloads} utilizadores já baixaram`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductDownloadCounter;
export type { ProductDownloadCounterProps };
