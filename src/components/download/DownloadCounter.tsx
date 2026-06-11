'use client';

import React, { useState, useEffect } from 'react';
import { Download, TrendingUp } from 'lucide-react';

/**
 * Componente que exibe o contador global de downloads
 * Busca o contador global da API e exibe de forma visual atraente
 */
const DownloadCounter: React.FC = () => {
  const [globalDownloads, setGlobalDownloads] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca o contador global de downloads da API
    const fetchDownloads = async () => {
      try {
        const response = await fetch('/api/download');
        if (response.ok) {
          const data = await response.json();
          setGlobalDownloads(data.globalDownloads);
        }
      } catch (error) {
        console.error('Erro ao buscar contador de downloads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  // Formata número para exibição
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}k+`;
    }
    return `${num}+`;
  };

  return (
    <div className="bg-gradient-to-r from-[#00ff9d] to-[#00cc7d] rounded-2xl p-6 text-[#1a1a2e] shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#1a1a2e]/20 rounded-lg">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#1a1a2e]/80 mb-1">
              Downloads Globais
            </p>
            <p className="text-3xl font-bold">
              {loading ? '...' : formatNumber(globalDownloads)}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#1a1a2e]/10 px-4 py-2 rounded-lg">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">
            {loading ? 'Carregando...' : `${globalDownloads}+ downloads em todos os produtos`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DownloadCounter;
