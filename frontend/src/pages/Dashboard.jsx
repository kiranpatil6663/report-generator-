import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Dashboard = () => {
  const navigate = useNavigate()
  const { token, userData } = useContext(AppContext)

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])

  if (!userData) {
    return (
      <div className='min-h-[60vh] flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      {/* Welcome Section */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Welcome {userData.name}!</h1>
        <p className='text-blue-100 text-lg'>Manage your assessments and generate reports from your dashboard.</p>
      </div>

      {/* Quick Actions */}
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        <div 
          onClick={() => navigate('/generate-report')}
          className='bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-100'
        >
          <div className='w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
            <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
            </svg>
          </div>
          <h3 className='text-xl font-semibold mb-2'>Generate Report</h3>
          <p className='text-gray-600 mb-4'>Create new PDF reports from assessment data using session IDs.</p>
          <div className='flex items-center text-blue-600 font-medium'>
            <span>Start generating</span>
            <svg className='w-4 h-4 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </div>
        </div>

        <div 
          onClick={() => navigate('/reports')}
          className='bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-100'
        >
          <div className='w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
            <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
            </svg>
          </div>
          <h3 className='text-xl font-semibold mb-2'>View Reports</h3>
          <p className='text-gray-600 mb-4'>Browse and download previously generated assessment reports.</p>
          <div className='flex items-center text-green-600 font-medium'>
            <span>Browse reports</span>
            <svg className='w-4 h-4 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-100'>
          <div className='w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4'>
            <svg className='w-8 h-8 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
            </svg>
          </div>
          <h3 className='text-xl font-semibold mb-2'>Statistics</h3>
          <p className='text-gray-600 mb-4'>View your report generation statistics and usage analytics.</p>
          <div className='text-gray-400 font-medium'>
            Coming Soon
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className='bg-white rounded-xl shadow-lg p-6'>
        <h2 className='text-2xl font-semibold mb-6 text-gray-800'>Getting Started</h2>
        
        <div className='space-y-4'>
          <div className='flex items-start space-x-4 p-4 bg-blue-50 rounded-lg'>
            <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
              1
            </div>
            <div>
              <h4 className='font-semibold text-gray-800'>Generate Your First Report</h4>
              <p className='text-gray-600 text-sm'>Use the "Generate Report" feature with a session ID to create your first PDF report.</p>
            </div>
          </div>

          <div className='flex items-start space-x-4 p-4 bg-gray-50 rounded-lg'>
            <div className='w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold'>
              2
            </div>
            <div>
              <h4 className='font-semibold text-gray-800'>Explore Report Types</h4>
              <p className='text-gray-600 text-sm'>Try different assessment types to see how the system adapts report formats automatically.</p>
            </div>
          </div>

          <div className='flex items-start space-x-4 p-4 bg-gray-50 rounded-lg'>
            <div className='w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold'>
              3
            </div>
            <div>
              <h4 className='font-semibold text-gray-800'>View Generated Reports</h4>
              <p className='text-gray-600 text-sm'>Check the Reports section to download and review your generated PDF files.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard