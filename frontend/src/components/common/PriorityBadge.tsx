import { useTranslation } from '@/lib/I18nContext'

const priorityColorMap: Record<string, string> = {
  Low: 'bg-gray-100 text-gray-600',
  Normal: 'bg-blue-100 text-blue-700',
  High: 'bg-orange-100 text-orange-700',
  Urgent: 'bg-red-100 text-red-700',
}

const priorityKeyMap: Record<string, string> = {
  Low: 'priority.low',
  Normal: 'priority.normal',
  High: 'priority.high',
  Urgent: 'priority.urgent',
}

export default function PriorityBadge({ priority }: { priority: string }) {
  const { t } = useTranslation()

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        priorityColorMap[priority] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {t(priorityKeyMap[priority] || 'priority.normal')}
    </span>
  )
}
