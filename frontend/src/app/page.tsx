'use client'

import Link from 'next/link'
import { FileText, Shield, Home, Users, Phone, Mail, MapPin, ChevronRight, Building2, Scale, Heart, Briefcase, Clock, CheckCircle, ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'

const services = [
  { icon: FileText, title: 'Birth Certificate', desc: 'Official birth certificate issuance', category: 'Civil Documents', days: '3 days', fee: '50 Birr' },
  { icon: FileText, title: 'Marriage Certificate', desc: 'Official marriage certificate issuance', category: 'Civil Documents', days: '3 days', fee: '75 Birr' },
  { icon: FileText, title: 'Family Record', desc: 'Official family record document', category: 'Civil Documents', days: '3 days', fee: '40 Birr' },
  { icon: Briefcase, title: 'Business License', desc: 'New business license application', category: 'Business Services', days: '7 days', fee: '500 Birr' },
  { icon: Briefcase, title: 'Trade Permit', desc: 'Trade and commerce permit', category: 'Business Services', days: '5 days', fee: '200 Birr' },
  { icon: Home, title: 'Land Ownership', desc: 'Certificate of land ownership', category: 'Land & Property', days: '14 days', fee: '1000 Birr' },
  { icon: Home, title: 'Building Permit', desc: 'Construction building permit', category: 'Land & Property', days: '10 days', fee: '750 Birr' },
  { icon: Shield, title: 'Police Clearance', desc: 'Certificate of good conduct', category: 'Police Services', days: '5 days', fee: '100 Birr' },
  { icon: Shield, title: 'Background Check', desc: 'Employment background verification', category: 'Police Services', days: '7 days', fee: '150 Birr' },
  { icon: Heart, title: 'Social Assistance', desc: 'Application for social welfare support', category: 'Social Services', days: '14 days', fee: 'Free' },
  { icon: Heart, title: 'Disability Support', desc: 'Registration for disability benefits', category: 'Social Services', days: '10 days', fee: 'Free' },
  { icon: Shield, title: 'Lost Property Report', desc: 'File a lost property report', category: 'Police Services', days: '1 day', fee: '25 Birr' },
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
  { num: '1', title: 'Submit Request', desc: 'Apply online through the citizen portal' },
  { num: '2', title: 'Upload Documents', desc: 'Upload required documents digitally' },
  { num: '3', title: 'Verification', desc: 'Clerk verifies your documents' },
  { num: '4', title: 'Supervisor Review', desc: 'Department head reviews application' },
  { num: '5', title: 'Approval', desc: 'Final approval by administration' },
  { num: '6', title: 'Pickup', desc: 'Collect your document at the office' },
]

const categoryIcons: Record<string, any> = {
  'Civil Documents': FileText,
  'Business Services': Briefcase,
  'Land & Property': Home,
  'Police Services': Shield,
  'Social Services': Heart,
}

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
              <a href="#services" className="hover:text-green-200">Services</a>
              <a href="#how-it-works" className="hover:text-green-200">How It Works</a>
              <a href="#woredas" className="hover:text-green-200">Woredas</a>
              <a href="#contact" className="hover:text-green-200">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="bg-white text-green-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-50 transition">Staff Login</Link>
              <Link href="/citizen/login" className="bg-green-600 border border-green-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-500 transition">Citizen Portal</Link>
              <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
                {mobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
          {mobileMenu && (
            <div className="md:hidden pb-4 space-y-2 text-sm">
              <a href="#services" className="block py-2 hover:text-green-200">Services</a>
              <a href="#how-it-works" className="block py-2 hover:text-green-200">How It Works</a>
              <a href="#woredas" className="block py-2 hover:text-green-200">Woredas</a>
              <a href="#contact" className="block py-2 hover:text-green-200">Contact</a>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-green-600/50 border border-green-400/30 rounded-full px-4 py-1 text-sm mb-6">
            Addis Ababa Civil Registration & Residency Service Agency
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Gulele Sub-City<br />Government Digital Services
          </h1>
          <p className="text-lg md:text-xl text-green-200 mb-8 max-w-2xl mx-auto">
            Apply for certificates, licenses, and government services online.
            Track your application status in real-time from anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/citizen/register" className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-50 transition inline-flex items-center justify-center gap-2">
              Get Started <ArrowRight size={20} />
            </Link>
            <Link href="/citizen/login" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/10 transition inline-flex items-center justify-center gap-2">
              Citizen Login
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-green-700">12</div>
            <div className="text-sm text-gray-500">Online Services</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-700">10</div>
            <div className="text-sm text-gray-500">Woredas</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-700">8</div>
            <div className="text-sm text-gray-500">Workflow Steps</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-700">24/7</div>
            <div className="text-sm text-gray-500">Online Access</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-500 mt-2">Simple 6-step process to get your documents</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-green-700 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">{step.num}</div>
                <div className="font-semibold text-sm mb-1">{step.title}</div>
                <div className="text-xs text-gray-500">{step.desc}</div>
                {i < steps.length - 1 && <ChevronRight className="hidden lg:block absolute -right-3 top-4 text-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="text-gray-500 mt-2">Available online through the citizen portal</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => {
              const Icon = categoryIcons[s.category] || FileText
              return (
                <div key={i} className="bg-white border rounded-xl p-6 hover:shadow-lg transition group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 text-green-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-700 group-hover:text-white transition">
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{s.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                        <span className="bg-gray-100 px-2 py-1 rounded">{s.category}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {s.days}</span>
                        <span className="font-medium text-green-700">{s.fee}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-8">
            <Link href="/citizen/register" className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
              Apply Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Gulele Sub-City Office</h2>
              <p className="text-gray-600 mb-4">
                The Gulele Sub-City Office Administration is located at Addisu Gebeya, behind the NOC gas station.
                We serve the residents of Gulele with civil registration, residency, and various government services.
              </p>
              <p className="text-gray-600 mb-6">
                Under the leadership of Sub-City Sector Director Eyobel Tafu, our office works across 10 woredas
                to deliver efficient and transparent public services to all citizens.
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><Building2 size={16} className="text-green-700" /> <strong>Sector Director:</strong> Eyobel Tafu</div>
                <div className="flex items-center gap-2 text-gray-600"><Phone size={16} className="text-green-700" /> <strong>Office Phone:</strong> 0913208337</div>
                <div className="flex items-center gap-2 text-gray-600"><MapPin size={16} className="text-green-700" /> <strong>Location:</strong> Addisu Gebeya, behind NOC gas station</div>
                <div className="flex items-center gap-2 text-gray-600"><Mail size={16} className="text-green-700" /> <strong>Email:</strong> info@gulele.gov.et</div>
              </div>
            </div>
            <div className="bg-white border rounded-xl p-8">
              <h3 className="font-bold text-lg mb-4">Key Services Offered</h3>
              <div className="space-y-3">
                {['Birth Certificate', 'Adoption Certificate', 'Marriage Certificate', 'Divorce Certificate', 'Death Certificate', 'Business License', 'Police Clearance', 'Land Ownership Certificate'].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Woredas */}
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
                <a href={`tel:${w.phone}`} className="text-xs text-gray-400 flex items-center gap-1 hover:text-green-700">
                  <Phone size={11} /> {w.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
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
                <a href="#services" className="block hover:text-white">Our Services</a>
                <a href="#woredas" className="block hover:text-white">Woreda Directory</a>
                <Link href="/citizen/register" className="block hover:text-white">Register Account</Link>
                <Link href="/citizen/login" className="block hover:text-white">Citizen Portal Login</Link>
                <Link href="/login" className="block hover:text-white">Staff Portal Login</Link>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Office Hours</h3>
              <div className="space-y-2 text-sm text-green-200">
                <div>Monday - Friday: 8:30 AM - 5:30 PM</div>
                <div>Saturday: 8:30 AM - 12:30 PM</div>
                <div>Sunday & Holidays: Closed</div>
                <div className="mt-4 pt-4 border-t border-green-600 text-white font-medium">
                  Online services available 24/7
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-300 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>Addis Ababa Civil Registration & Residency Service Agency - Gulele Sub-City</p>
          <p className="mt-1 text-green-500">&copy; 2026. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}
