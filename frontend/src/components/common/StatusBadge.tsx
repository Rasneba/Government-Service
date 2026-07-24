export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Draft: 'bg-gray-100 text-gray-700',
    Submitted: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Sent: 'bg-blue-100 text-blue-700',
    Received: 'bg-indigo-100 text-indigo-700',
    Closed: 'bg-gray-100 text-gray-500',
    Rejected: 'bg-red-100 text-red-700',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colors[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  )
}
