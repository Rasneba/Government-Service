'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Shield } from 'lucide-react'
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
  const reissueServices = serviceTypes.filter(st => st.code?.includes('R') || st.name?.toLowerCase().includes('reissue'))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Government Services</h1>
      <p className="text-sm text-gray-500 mb-6">Apply for certificate reissue or other government services</p>

      {reissueServices.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-amber-800 mb-2">Certificate Reissue Services</h2>
          <p className="text-sm text-amber-700 mb-3">Lost or damaged your certificate? Apply for a replacement online. All reissue requests require police verification.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {reissueServices.map(st => (
              <button key={st.id} onClick={() => router.push(`/citizen/applications/new?serviceTypeId=${st.id}`)} className="bg-white border border-amber-300 rounded-lg p-3 text-left hover:bg-amber-100 transition">
                <div className="font-medium text-sm">{st.name}</div>
                <div className="text-xs text-gray-500 mt-1">Fee: {st.fee > 0 ? `ETB ${st.fee}` : 'Free'} | {st.estimatedDays || 'Varies'} days</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-full text-sm ${!selectedCategory ? 'bg-green-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>All ({serviceTypes.length})</button>
        {categories.map(c => (
          <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`px-4 py-2 rounded-full text-sm ${selectedCategory === c.id ? 'bg-green-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>{c.name} ({c.serviceCount})</button>
        ))}
      </div>

      {loading ? <div className="text-center py-12 text-gray-500">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(st => {
            const isReissue = st.code?.includes('R') || st.name?.toLowerCase().includes('reissue')
            return (
              <div key={st.id} className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${isReissue ? 'border-amber-200' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{st.name}</h3>
                    {isReissue && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded mt-1 inline-block">Reissue</span>}
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{st.code}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{st.description || 'No description'}</p>
                <div className="text-sm text-gray-500 space-y-1 mb-4">
                  <div className="flex justify-between"><span>Category:</span><span>{st.categoryName || '-'}</span></div>
                  <div className="flex justify-between"><span>Processing:</span><span>{st.estimatedDays ? `${st.estimatedDays} days` : 'Varies'}</span></div>
                  <div className="flex justify-between"><span>Fee:</span><span className="font-medium">{st.fee > 0 ? `ETB ${st.fee.toLocaleString()}` : 'Free'}</span></div>
                  {st.requiresPoliceVerification && (
                    <div className="flex items-center gap-1 text-slate-600 text-xs"><Shield size={12} /> Requires police verification</div>
                  )}
                </div>
                <button onClick={() => router.push(`/citizen/applications/new?serviceTypeId=${st.id}`)} className={`w-full py-2 rounded-lg text-sm ${isReissue ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                  {isReissue ? 'Apply for Reissue' : 'Apply Now'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
