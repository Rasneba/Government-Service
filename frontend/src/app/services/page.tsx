'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout/Layout'
import api from '@/lib/api'
import type { ServiceCategory, ServiceType, ApiResponse } from '@/types'

export default function ServicesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
    loadServiceTypes()
  }, [])

  const loadCategories = async () => {
    try {
      const res = await api.get<ApiResponse<ServiceCategory[]>>('/Services/categories')
      setCategories(res.data.data)
    } catch (err) {
      console.error('Failed to load categories', err)
    }
  }

  const loadServiceTypes = async (categoryId?: number) => {
    setLoading(true)
    try {
      const url = categoryId ? `/Services/types?categoryId=${categoryId}` : '/Services/types'
      const res = await api.get<ApiResponse<ServiceType[]>>(url)
      setServiceTypes(res.data.data)
    } catch (err) {
      console.error('Failed to load service types', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
    loadServiceTypes(categoryId || undefined)
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Government Services</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              selectedCategory === null
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-sm font-medium">All Services</div>
            <div className="text-xs text-gray-500 mt-1">{serviceTypes.length} available</div>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                selectedCategory === cat.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium">{cat.name}</div>
              <div className="text-xs text-gray-500 mt-1">{cat.serviceCount} services</div>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading services...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceTypes.map((st) => (
              <div key={st.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{st.name}</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{st.code}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{st.description || 'No description'}</p>
                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{st.categoryName || 'Uncategorized'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Time:</span>
                    <span>{st.estimatedDays ? `${st.estimatedDays} days` : 'Varies'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee:</span>
                    <span className="font-medium">{st.fee > 0 ? `ETB ${st.fee.toLocaleString()}` : 'Free'}</span>
                  </div>
                  {st.requiresPoliceVerification && (
                    <div className="text-amber-600 text-xs mt-2">Requires police verification</div>
                  )}
                </div>
                <a
                  href={`/applications/new?serviceTypeId=${st.id}`}
                  className="mt-4 block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
