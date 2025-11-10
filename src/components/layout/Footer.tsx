'use client'

import { Heart, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold">Hospital HMS</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Comprehensive Hospital Management System designed to streamline healthcare operations, 
              enhance patient care, and improve overall efficiency.
            </p>
            <div className="flex items-center space-x-2 text-gray-300">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Built with care for healthcare professionals</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="/patients" className="hover:text-white transition-colors">Patients</a></li>
              <li><a href="/appointments" className="hover:text-white transition-colors">Appointments</a></li>
              <li><a href="/reports" className="hover:text-white transition-colors">Reports</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span>support@hms.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4" />
                <span>123 Healthcare St, Medical City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 Hospital HMS. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              HIPAA Compliance
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}