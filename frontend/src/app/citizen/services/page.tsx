'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import type { ServiceCategory, ServiceType, ApiResponse } from '@/types'

export default function CitizenServicesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('citizenToken')
    if (!token) { router.replace('/citizen/login'); return }
    const config = { headers: { Authorization: `Bearer ${token}` } }
    Promise.all([
      api.get<ApiResponse<ServiceCategory[]>>('/Services/categories', config),
      api.get<ApiResponse<ServiceType[]>>('/Services/types', config),
    ]).then(([catRes, typeRes]) => {
      setCategories(catRes.data.data)
      setServiceTypes(typeRes.data.data)
    }).finally(() => setLoading(false))
  }, [router])

  const filtered = selectedCategory ? serviceTypes.filter(st => st.categoryId === selectedCategory) : serviceTypes

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Government Services</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-full text-sm ${!selectedCategory ? 'bg-green-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>All</button>
        {categories.map(c => (
          <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`px-4 py-2 rounded-full text-sm ${selectedCategory === c.id ? 'bg-green-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>{c.name} ({c.serviceCount})</button>
        ))}
      </div>

      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(st => (
            <div key={st.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold">{st.name}</h3>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{st.code}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{st.description || 'No description'}</p>
              <div className="text-sm text-gray-500 space-y-1 mb-4">
                <div className="flex justify-between"><span>Category:</span><span>{st.categoryName || '-'}</span></div>
                <div className="flex justify-between"><span>Processing:</span><span>{st.estimatedDays ? `${st.estimatedDays} days` : 'Varies'}</span></div>
                <div className="flex justify-between"><span>Fee:</span><span className="font-medium">{st.fee > 0 ? `ETB ${st.fee.toLocaleString()}` : 'Free'}</span></div>
                {st.requiresPoliceVerification && <div className="text-amber-600 text-xs">Requires police verification</div>}
              </div>
              <button onClick={() => router.push(`/citizen/applications/new?serviceTypeId=${st.id}`)} className="w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700">Apply Now</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
