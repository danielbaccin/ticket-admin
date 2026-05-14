import TicketsDashboard from '@/components/dashboard/TicketsDashboard'

interface Props {
  params: Promise<{
    eventId: string
  }>
}

export default async function Page({ params }: Props) {
  const { eventId } = await params

  return (
    <TicketsDashboard eventId={eventId} />
  )
}