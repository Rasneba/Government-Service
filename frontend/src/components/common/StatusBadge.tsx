import { useTranslation } from '@/lib/I18nContext'

const statusColorMap: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Submitted: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Sent: 'bg-blue-100 text-blue-700',
  Received: 'bg-indigo-100 text-indigo-700',
  Closed: 'bg-gray-100 text-gray-500',
  Rejected: 'bg-red-100 text-red-700',
}

const statusKeyMap: Record<string, string> = {
  Draft: 'status.draft',
  Submitted: 'status.submitted',
  Approved: 'status.approved',
  Sent: 'status.completed',
  Received: 'status.completed',
  Closed: 'status.completed',
  Rejected: 'status.rejected',
}

export default function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation()

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColorMap[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {t(statusKeyMap[status] || 'common.status')}
    </span>
  )
}
