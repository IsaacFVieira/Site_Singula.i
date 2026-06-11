'use client';

import { useState } from 'react';
import { X, Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface DownloadStatus {
  productId: string;
  productName: string;
  nome: string;
  email: string;
  telefone: string;
  data: string;
  statusPedido: 'pendente' | 'enviado';
  dataPrevistaEnvio: string;
  tempoRestanteDias: number;
  tempoRestanteMs: number;
  status: 'pendente' | 'pronto';
}

interface StatusCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StatusCheckModal({ isOpen, onClose }: StatusCheckModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloads, setDownloads] = useState<DownloadStatus[]>([]);
  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDownloads([]);
    setShowResults(false);

    try {
      const response = await fetch(`/api/check-status?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (response.ok) {
        setDownloads(data.downloads);
        setShowResults(true);
      } else {
        setError(data.error || 'Erro ao verificar status');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const formatarTempoRestante = (dias: number) => {
    if (dias === 0) return 'Hoje';
    if (dias === 1) return '1 dia';
    return `${dias} dias`;
  };

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleString('pt-AO', {
      timeZone: 'Africa/Luanda',
      dateStyle: 'full',
      timeStyle: 'short'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#282a36] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#282a36] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#282a36] border-b border-[#282a36] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-[#00ff9d]" />
            Verificar Status do Pedido
          </h2>
          <button
            onClick={onClose}
            className="text-[#a0a0a0] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Form */}
          {!showResults && (
            <form onSubmit={handleCheck} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email"
                  className="w-full px-4 py-3 bg-[#1e1e2e] border border-[#282a36] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:border-[#00ff9d] transition-colors"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00ff9d] text-[#1e1e2e] font-semibold py-3 px-6 rounded-lg hover:bg-[#00cc7d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#1e1e2e] border-t-transparent rounded-full animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Verificar Status
                  </>
                )}
              </button>
            </form>
          )}

          {/* Results */}
          {showResults && (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowResults(false);
                  setDownloads([]);
                }}
                className="text-[#00ff9d] hover:text-[#00cc7d] transition-colors flex items-center gap-2"
              >
                ← Verificar outro email
              </button>

              {downloads.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#1e1e2e] rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-[#a0a0a0]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Nenhum pedido encontrado
                  </h3>
                  <p className="text-[#a0a0a0] mb-6">
                    Não encontramos nenhum pedido de download para este email.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-[#00ff9d] text-[#1e1e2e] font-semibold py-3 px-6 rounded-lg hover:bg-[#00cc7d] transition-colors"
                  >
                    Fazer um novo pedido
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {downloads.length} pedido(s) encontrado(s)
                  </h3>

                  {downloads.map((download, index) => (
                    <div
                      key={index}
                      className="bg-[#1e1e2e] border border-[#282a36] rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-white text-lg">
                            {download.productName}
                          </h4>
                          <p className="text-sm text-[#a0a0a0]">
                            Pedido em: {formatarData(download.data)}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          download.status === 'pronto'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {download.status === 'pronto' ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Pronto
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4" />
                              Pendente
                            </>
                          )}
                        </div>
                      </div>

                      {download.status === 'pendente' ? (
                        <div className="bg-[#282a36] rounded-lg p-3">
                          <p className="text-sm text-[#a0a0a0] mb-1">
                            Tempo restante para envio:
                          </p>
                          <p className="text-2xl font-bold text-[#00ff9d]">
                            {formatarTempoRestante(download.tempoRestanteDias)}
                          </p>
                          <p className="text-xs text-[#a0a0a0] mt-1">
                            Data prevista: {formatarData(download.dataPrevistaEnvio)}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-green-500/10 rounded-lg p-3">
                          <p className="text-sm text-green-400">
                            ✓ O link de download já foi enviado para o seu email
                          </p>
                        </div>
                      )}

                      <div className="text-xs text-[#6b7280] pt-2 border-t border-[#282a36]">
                        <p>Email: {download.email}</p>
                        <p>Telefone: {download.telefone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
