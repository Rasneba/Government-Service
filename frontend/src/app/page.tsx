'use client'

import Link from 'next/link'
import { FileText, Shield, Home, Users, Phone, Mail, MapPin, ChevronRight, Building2, Scale, Heart, Briefcase, Clock, CheckCircle, ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import LanguageSwitcher from '@/components/common/LanguageSwitcher'
import { useTranslation } from '@/lib/I18nContext'

const services = [
  { icon: FileText, title: 'Birth Certificate Reissue', desc: 'Replacement for lost or damaged birth certificate', category: 'Certificate Reissue', days: '7 days', fee: '50 Birr', police: true },
  { icon: FileText, title: 'Marriage Certificate Reissue', desc: 'Replacement for lost or damaged marriage certificate', category: 'Certificate Reissue', days: '7 days', fee: '75 Birr', police: true },
  { icon: FileText, title: 'Family Record Reissue', desc: 'Replacement for lost or damaged family record', category: 'Certificate Reissue', days: '7 days', fee: '40 Birr', police: true },
  { icon: Home, title: 'Land Ownership Reissue', desc: 'Replacement for lost land ownership certificate', category: 'Certificate Reissue', days: '14 days', fee: '500 Birr', police: true },
  { icon: FileText, title: 'Birth Certificate', desc: 'New birth certificate issuance', category: 'Civil Documents', days: '5 days', fee: '50 Birr', police: false },
  { icon: FileText, title: 'Marriage Certificate', desc: 'New marriage certificate issuance', category: 'Civil Documents', days: '5 days', fee: '75 Birr', police: false },
  { icon: Home, title: 'Land Ownership', desc: 'Certificate of land ownership', category: 'Land & Property', days: '14 days', fee: '1000 Birr', police: true },
  { icon: Shield, title: 'Police Clearance', desc: 'Certificate of good conduct', category: 'Police Services', days: '5 days', fee: '100 Birr', police: false },
  { icon: Shield, title: 'Background Check', desc: 'Employment background verification', category: 'Police Services', days: '7 days', fee: '150 Birr', police: false },
  { icon: Briefcase, title: 'Business License', desc: 'New business license application', category: 'Business Services', days: '7 days', fee: '500 Birr', police: true },
  { icon: Briefcase, title: 'Trade Permit', desc: 'Trade and commerce permit', category: 'Business Services', days: '5 days', fee: '200 Birr', police: false },
  { icon: Home, title: 'Building Permit', desc: 'Construction building permit', category: 'Land & Property', days: '10 days', fee: '750 Birr', police: false },
]

const woredas = [
  { name: 'Woreda 1', director: 'Yonas Teklu', phone: '0932209700' },
  { name: 'Woreda 2', director: 'Getachew Lema', phone: '0955404196' },
  { name: 'Woreda 3', director: 'Werku Gebew', phone: '0938222756' },
  { name: 'Woreda 4', director: 'Qonjit Feleke', phone: '0912734587' },
  { name: 'Woreda 5', director: 'Asrebb Werqu', phone: '0923147191' },
  { name: 'Woreda 6', director: 'Habtamu Damta', phone: '0920665162' },
  { name: 'Woreda 7', director: 'Aysha Husen', phone: '0922836964' },
  { name: 'Woreda 8', director: 'Tomas Totno', phone: '0926467880' },
  { name: 'Woreda 9', director: 'Kaleb Tilahun', phone: '0960291939' },
  { name: 'Woreda 10', director: 'Natan Rundasa', phone: '0919407560' },
]

const steps = [
  { num: '1', title: 'Report Loss', desc: 'Apply for reissue online through the citizen portal' },
  { num: '2', title: 'Submit Documents', desc: 'Upload affidavit of loss and required documents' },
  { num: '3', title: 'Document Review', desc: 'Clerk reviews and validates your documents' },
  { num: '4', title: 'Police Verify', desc: 'Police officer verifies the lost certificate claim' },
  { num: '5', title: 'Approval', desc: 'Supervisor approves the reissue request' },
  { num: '6', title: 'Certificate Ready', desc: 'Collect your new certificate at the office' },
]

const categoryIcons: Record<string, any> = {
  'Certificate Reissue': FileText, 'Civil Documents': FileText, 'Business Services': Briefcase,
  'Land & Property': Home, 'Police Services': Shield, 'Social Services': Heart,
}

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-green-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3 border-b border-green-600">
            <div className="flex items-center gap-3">
              <Building2 size={28} />
              <div>
                <div className="text-sm font-semibold">Gulele Sub-City</div>
                <div className="text-xs text-green-200">Civil Registration & Residency Service</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm">
              <a href="tel:0913208337" className="flex items-center gap-1 hover:text-green-200"><Phone size={14} /> 0913208337</a>
              <a href="mailto:info@gulele.gov.et" className="flex items-center gap-1 hover:text-green-200"><Mail size={14} /> info@gulele.gov.et</a>
            </div>
          </div>
          <nav className="flex items-center justify-between py-3">
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#services" className="hover:text-green-200">{t('nav.services')}</a>
              <a href="#how-it-works" className="hover:text-green-200">How It Works</a>
              <a href="#woredas" className="hover:text-green-200">Woredas</a>
              <a href="#contact" className="hover:text-green-200">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="bg-white text-green-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-50 transition hidden md:inline">{t('landing.staffPortal')}</Link>
              <Link href="/police/login" className="bg-slate-700 border border-slate-500 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-600 transition hidden md:inline">{t('landing.policePortal')}</Link>
              <Link href="/citizen/login" className="bg-green-600 border border-green-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-500 transition">{t('landing.citizenPortal')}</Link>
              <LanguageSwitcher />
              <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
                {mobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
          {mobileMenu && (
            <div className="md:hidden pb-4 space-y-2 text-sm">
              <a href="#services" className="block py-2 hover:text-green-200">{t('nav.services')}</a>
              <a href="#how-it-works" className="block py-2 hover:text-green-200">How It Works</a>
              <a href="#woredas" className="block py-2 hover:text-green-200">Woredas</a>
              <a href="#contact" className="block py-2 hover:text-green-200">Contact</a>
              <div className="flex gap-2 pt-2 border-t border-green-600">
                <Link href="/login" className="block bg-white text-green-700 px-3 py-2 rounded text-center flex-1">{t('landing.staffPortal')}</Link>
                <Link href="/police/login" className="block bg-slate-700 text-white px-3 py-2 rounded text-center flex-1">{t('landing.policePortal')}</Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-green-600/50 border border-green-400/30 rounded-full px-4 py-1 text-sm mb-6">
            Addis Ababa Civil Registration & Residency Service Agency
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {t('landing.title')}
          </h1>
          <p className="text-lg md:text-xl text-green-200 mb-8 max-w-2xl mx-auto">
            {t('landing.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/citizen/register" className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-50 transition inline-flex items-center justify-center gap-2">
              Apply for Reissue <ArrowRight size={20} />
            </Link>
            <Link href="/citizen/login" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/10 transition inline-flex items-center justify-center gap-2">
              Track Application
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div><div className="text-3xl font-bold text-green-700">12</div><div className="text-sm text-gray-500">{t('nav.services')}</div></div>
          <div><div className="text-3xl font-bold text-green-700">10</div><div className="text-sm text-gray-500">Woredas</div></div>
          <div><div className="text-3xl font-bold text-green-700">6</div><div className="text-sm text-gray-500">Workflow Steps</div></div>
          <div><div className="text-3xl font-bold text-green-700">24/7</div><div className="text-sm text-gray-500">Online Access</div></div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How Certificate Reissue Works</h2>
            <p className="text-gray-500 mt-2">6-step process with police verification for lost certificates</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="text-center relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3 ${
                  i === 3 ? 'bg-slate-800 text-white' : 'bg-green-700 text-white'
                }`}>{step.num}</div>
                <div className="font-semibold text-sm mb-1">{step.title}</div>
                <div className="text-xs text-gray-500">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Certificate Reissue Services</h2>
            <p className="text-gray-500 mt-2">Apply online for lost, damaged, or destroyed certificate replacement</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => {
              const Icon = categoryIcons[s.category] || FileText
              return (
                <div key={i} className="bg-white border rounded-xl p-6 hover:shadow-lg transition group">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition ${
                      s.category === 'Certificate Reissue' ? 'bg-amber-100 text-amber-700 group-hover:bg-amber-700 group-hover:text-white' : 'bg-green-100 text-green-700 group-hover:bg-green-700 group-hover:text-white'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{s.title}</h3>
                        {s.category === 'Certificate Reissue' && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">REISSUE</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                        <span className="bg-gray-100 px-2 py-1 rounded">{s.category}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {s.days}</span>
                        <span className="font-medium text-green-700">{s.fee}</span>
                        {s.police && <span className="flex items-center gap-1 text-slate-600"><Shield size={12} /> Police</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/citizen/register" className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
              Apply for Reissue <ArrowRight size={18} />
            </Link>
            <Link href="/citizen/login" className="inline-flex items-center gap-2 border border-green-700 text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition">
              Track Application
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Gulele Sub-City Office</h2>
              <p className="text-gray-600 mb-4">
                The Gulele Sub-City Office Administration is located at Addisu Gebeya, behind the NOC gas station.
                We serve the residents of Gulele with civil registration, residency, and certificate reissue services.
              </p>
              <p className="text-gray-600 mb-6">
                Under the leadership of Sub-City Sector Director Eyobel Tafu, our office works across 10 woredas
                to deliver efficient and transparent public services to all citizens.
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><Building2 size={16} className="text-green-700" /> <strong>Sector Director:</strong> Eyobel Tafu</div>
                <div className="flex items-center gap-2 text-gray-600"><Phone size={16} className="text-green-700" /> <strong>Office Phone:</strong> 0913208337</div>
                <div className="flex items-center gap-2 text-gray-600"><MapPin size={16} className="text-green-700" /> <strong>Location:</strong> Addisu Gebeya, behind NOC gas station</div>
              </div>
            </div>
            <div className="bg-white border rounded-xl p-8">
              <h3 className="font-bold text-lg mb-4">{t('landing.about')}</h3>
              <div className="space-y-3">
                {['Birth Certificate', 'Marriage Certificate', 'Family Record Certificate', 'Land Ownership Certificate', 'Divorce Certificate', 'Death Certificate'].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                    <span>{s}</span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded ml-auto">Reissue</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t text-sm text-gray-500">
                <p className="flex items-center gap-2"><Shield size={14} className="text-slate-600" /> All reissue requests require police verification</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="woredas" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Woredas</h2>
            <p className="text-gray-500 mt-2">10 woredas under Gulele Sub-City</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {woredas.map((w, i) => (
              <div key={i} className="bg-white border rounded-lg p-4 hover:shadow-md transition">
                <div className="font-semibold text-sm text-green-700 mb-2">{w.name}</div>
                <div className="text-xs text-gray-600 mb-1">{w.director}</div>
                <a href={`tel:${w.phone}`} className="text-xs text-gray-400 flex items-center gap-1 hover:text-green-700"><Phone size={11} /> {w.phone}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <div className="space-y-3 text-sm text-green-200">
                <div className="flex items-center gap-2"><Phone size={16} /> 0913208337</div>
                <div className="flex items-center gap-2"><Mail size={16} /> info@gulele.gov.et</div>
                <div className="flex items-center gap-2"><MapPin size={16} /> Addisu Gebeya, behind NOC gas station</div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <div className="space-y-2 text-sm text-green-200">
                <a href="#services" className="block hover:text-white">Certificate Reissue Services</a>
                <a href="#woredas" className="block hover:text-white">Woreda Directory</a>
                <Link href="/citizen/register" className="block hover:text-white">Register for Reissue</Link>
                <Link href="/citizen/login" className="block hover:text-white">{t('landing.citizenPortal')}</Link>
                <Link href="/police/login" className="block hover:text-white">{t('landing.policePortal')}</Link>
                <Link href="/login" className="block hover:text-white">{t('landing.staffPortal')}</Link>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Office Hours</h3>
              <div className="space-y-2 text-sm text-green-200">
                <div>Monday - Friday: 8:30 AM - 5:30 PM</div>
                <div>Saturday: 8:30 AM - 12:30 PM</div>
                <div>Sunday & Holidays: Closed</div>
                <div className="mt-4 pt-4 border-t border-green-600 text-white font-medium">Online reissue applications 24/7</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-green-900 text-green-300 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>Addis Ababa Civil Registration & Residency Service Agency - Gulele Sub-City</p>
          <p className="mt-1 text-green-500">&copy; 2026. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}
