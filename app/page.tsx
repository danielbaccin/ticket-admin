import TicketsDashboard from '@/components/dashboard/TicketsDashboard'

interface PageProps {
  params: {
    eventId: string
  }
}

export default function DashboardPage({
  params,
}: PageProps) {
  return (
    <TicketsDashboard eventId={params.eventId} />
  )
}