import { NextRequest, NextResponse } from 'next/server';
import { getAllDownloads, getAllProducts, getDownloadsByProduct } from '@/lib/downloads/storage';

/**
 * API Route para analytics avançado
 * GET /api/analytics?period={daily|weekly|monthly}
 * 
 * Retorna estatísticas avançadas de downloads
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'daily';

    console.log('[ANALYTICS] Gerando analytics:', { period });

    const downloads = getAllDownloads();
    const products = getAllProducts();

    // Produtos mais descarregados
    const productsWithDownloads = products.map(product => ({
      id: product.id,
      name: product.name,
      downloads: product.downloads
    })).sort((a, b) => b.downloads - a.downloads);

    const totalDownloads = downloads.length;
    const productStats = productsWithDownloads.map(product => ({
      ...product,
      percentage: totalDownloads > 0 ? ((product.downloads / totalDownloads) * 100).toFixed(1) : '0'
    }));

    // Downloads ao longo do tempo
    const downloadsByDate = downloads.reduce((acc, download) => {
      const date = new Date(download.data);
      let key: string;

      if (period === 'daily') {
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (period === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const timeSeriesData = Object.entries(downloadsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Picos de downloads
    const peakDays = Object.entries(downloadsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Horários mais utilizados
    const downloadsByHour = downloads.reduce((acc, download) => {
      const hour = new Date(download.data).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const peakHours = Object.entries(downloadsByHour)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Taxa de crescimento
    const sortedDates = Object.keys(downloadsByDate).sort();
    let growthRate = 0;
    let declineRate = 0;

    if (sortedDates.length >= 2) {
      const recentPeriod = sortedDates.slice(-7); // Últimos 7 dias
      const previousPeriod = sortedDates.slice(-14, -7); // 7 dias anteriores

      const recentCount = recentPeriod.reduce((sum, date) => sum + downloadsByDate[date], 0);
      const previousCount = previousPeriod.reduce((sum, date) => sum + downloadsByDate[date], 0);

      if (previousCount > 0) {
        growthRate = ((recentCount - previousCount) / previousCount) * 100;
      }

      if (growthRate < 0) {
        declineRate = Math.abs(growthRate);
        growthRate = 0;
      }
    }

    // Semanas de maior procura
    const downloadsByWeek = downloads.reduce((acc, download) => {
      const date = new Date(download.data);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const key = weekStart.toISOString().split('T')[0];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const peakWeeks = Object.entries(downloadsByWeek)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    console.log('[ANALYTICS] Analytics gerados com sucesso');

    return NextResponse.json(
      {
        success: true,
        data: {
          totalDownloads,
          products: productStats,
          timeSeries: timeSeriesData,
          peaks: {
            days: peakDays,
            hours: peakHours,
            weeks: peakWeeks
          },
          growth: {
            rate: growthRate.toFixed(2),
            decline: declineRate.toFixed(2),
            trend: growthRate > 0 ? 'crescendo' : (declineRate > 0 ? 'decrescendo' : 'estável')
          },
          period
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[ANALYTICS] Erro ao gerar analytics:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
