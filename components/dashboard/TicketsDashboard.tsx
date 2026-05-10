'use client'

import { useEffect, useState } from 'react'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

interface DashboardData {
  kpis: {
    totalOrders: number
    totalRevenue: number
    totalTickets: number
    totalCheckins: number
    attendanceRate: number
  }

  salesByDay: {
    date: string
    orders: number
    revenue: number
  }[]

  recentSales: {
    id: string
    buyer_name: string
    amount: number
    status: string
    created_at: string
  }[]
}

export default function TicketsDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/11111111-1111-1111-1111-111111111111`
        )
        console.log('STATUS:', response.status)

        const data = await response.json()
        
         console.log('DATA:', data)

        setDashboard(data)
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0)
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-700'

      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700'

      case 'CANCELED':
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-zinc-100 text-zinc-700'
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100">
        <p className="text-zinc-500">Carregando dashboard...</p>
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100">
        <p className="text-red-500">Erro ao carregar dashboard</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">
              Dashboard de Vendas
            </h1>

            <p className="mt-1 text-zinc-500">
              Visão geral do evento
            </p>
          </div>

          <select className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm outline-none">
            <option>Evento Principal</option>
          </select>
        </div>

        {/* KPIS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">Faturamento</p>

            <h2 className="mt-2 text-3xl font-bold text-zinc-900">
              {formatCurrency(dashboard.kpis.totalRevenue)}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">Pedidos</p>

            <h2 className="mt-2 text-3xl font-bold text-zinc-900">
              {dashboard.kpis.totalOrders}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">Ingressos</p>

            <h2 className="mt-2 text-3xl font-bold text-zinc-900">
              {dashboard.kpis.totalTickets}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">Presença</p>

            <h2 className="mt-2 text-3xl font-bold text-zinc-900">
              {dashboard.kpis.attendanceRate}%
            </h2>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* GRÁFICO */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-zinc-900">
                Vendas por dia
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Quantidade de pedidos realizados
              </p>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                      })
                    }
                  />

                  <YAxis />

                  <Tooltip
                    formatter={(value) => [`${value} pedidos`, 'Pedidos']}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString('pt-BR')
                    }
                  />

                  <Bar
                    dataKey="orders"
                    radius={[12, 12, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHECKINS */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-900">
              Check-ins
            </h2>

            <div className="mt-8 flex items-center justify-center">
              <div className="flex h-48 w-48 items-center justify-center rounded-full border-[14px] border-zinc-900">
                <div className="text-center">
                  <p className="text-5xl font-bold text-zinc-900">
                    {dashboard.kpis.attendanceRate}%
                  </p>

                  <p className="mt-2 text-sm text-zinc-500">
                    presença
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-zinc-100 p-4">
                <span className="text-zinc-500">
                  Check-ins
                </span>

                <strong className="text-zinc-900">
                  {dashboard.kpis.totalCheckins}
                </strong>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-zinc-100 p-4">
                <span className="text-zinc-500">
                  Ingressos
                </span>

                <strong className="text-zinc-900">
                  {dashboard.kpis.totalTickets}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* TABELA */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Últimas vendas
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Pedidos mais recentes do evento
              </p>
            </div>

            <input
              placeholder="Buscar comprador"
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-zinc-500">
                    Comprador
                  </th>

                  <th className="text-left text-sm font-medium text-zinc-500">
                    Valor
                  </th>

                  <th className="text-left text-sm font-medium text-zinc-500">
                    Status
                  </th>

                  <th className="text-left text-sm font-medium text-zinc-500">
                    Data
                  </th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentSales.map((sale) => (
                  <tr key={sale.id} className="bg-zinc-50">
                    <td className="rounded-l-2xl px-4 py-4 font-medium text-zinc-900">
                      {sale.buyer_name}
                    </td>

                    <td className="px-4 py-4 text-zinc-700">
                      {formatCurrency(sale.amount)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          sale.status
                        )}`}
                      >
                        {sale.status}
                      </span>
                    </td>

                    <td className="rounded-r-2xl px-4 py-4 text-zinc-500">
                      {new Date(sale.created_at).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}