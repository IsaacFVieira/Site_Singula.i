'use client';

import React, { useState } from 'react';
import { Search, Clock, CheckCircle, AlertCircle, Calendar, Package } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface PedidoStatus {
  productId: string;
  productName: string;
  dataPedido: string;
  horaPedido: string;
  statusPedido: 'pendente' | 'enviado';
  dataPrevistaEnvio: string;
  diasRestantes: number;
  dataEnvio: string | null;
}

interface StatusResponse {
  found: boolean;
  email?: string;
  totalPedidos?: number;
  pedidos?: PedidoStatus[];
  message?: string;
  error?: string;
}

export default function StatusPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StatusResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`/api/download/status?email=${encodeURIComponent(email)}`);
      const data: StatusResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao verificar status');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao verificar status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section className="py-16 sm:py-20 lg:py-32 bg-[var(--surface)]">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4">
              Verificar Status do Pedido
            </h1>
            <p className="text-base sm:text-lg text-[var(--muted)]">
              Insira o seu email para verificar o status do seu pedido de download
            </p>
          </div>

          <div className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 shadow-lg border border-[var(--border)]">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="flex-1 px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--foreground)]"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !email}
                    className="px-6 py-3"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}
            </form>

            {result && (
              <div className="mt-6 sm:mt-8 space-y-4">
                {result.found ? (
                  <>
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <p className="text-sm font-medium text-green-500">
                          Encontrados {result.totalPedidos} pedido(s) para {result.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {result.pedidos?.map((pedido, index) => (
                        <div
                          key={index}
                          className="p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)]"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <Package className="w-5 h-5 text-[var(--accent)]" />
                              <div>
                                <h3 className="font-semibold text-[var(--foreground)]">
                                  {pedido.productName}
                                </h3>
                                <p className="text-xs text-[var(--muted)]">
                                  ID: {pedido.productId}
                                </p>
                              </div>
                            </div>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              pedido.statusPedido === 'enviado'
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-yellow-500/10 text-yellow-500'
                            }`}>
                              {pedido.statusPedido === 'enviado' ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  Enviado
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3" />
                                  Pendente
                                </>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1 text-[var(--muted)]">
                              <Calendar className="w-3 h-3" />
                              <span>Pedido: {pedido.dataPedido}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[var(--muted)]">
                              <Clock className="w-3 h-3" />
                              <span>Hora: {pedido.horaPedido}</span>
                            </div>
                          </div>

                          {pedido.statusPedido === 'pendente' ? (
                            <div className="mt-3 p-3 bg-yellow-500/10 rounded-lg">
                              <div className="flex items-center gap-2 text-yellow-500">
                                <Clock className="w-4 h-4" />
                                <div>
                                  <p className="text-xs font-medium">
                                    Previsão de envio: {pedido.dataPrevistaEnvio}
                                  </p>
                                  <p className="text-xs">
                                    Tempo restante: {pedido.diasRestantes} dia(s)
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 p-3 bg-green-500/10 rounded-lg">
                              <div className="flex items-center gap-2 text-green-500">
                                <CheckCircle className="w-4 h-4" />
                                <p className="text-xs">
                                  Enviado em: {pedido.dataEnvio}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      <p className="text-sm text-yellow-500">{result.message}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="outline" size="sm">
                Voltar à Página Inicial
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
