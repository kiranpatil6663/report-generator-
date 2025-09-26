import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const ReportsList = () => {
  const navigate = useNavigate()
  const { token } = useContext(AppContext)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch reports from backend
  const getReportsData = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:4000/api/reports', {
        headers: {
          'token': token
        }
      })

      if (response.data.success) {
        setReports(response.data.reports)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Failed to fetch reports')
      console.log('Reports fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = async (report) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/reports/${report.fileName}`,
        {
          headers: { 'token': token },
          responseType: 'blob'
        }
      )

      // Create download link
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = report.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Report downloaded successfully')
    } catch (error) {
      toast.error('Failed to download report')
      console.log('Download error:', error)
    }
  }

  const handleRegenerateReport = async (sessionId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/generate-report?session_id=${sessionId}`,
        {
          headers: { 'token': token }
        }
      )

      if (response.data.success) {
        toast.success('Report regenerated successfully')
        getReportsData() // Refresh the reports list
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Failed to regenerate report')
      console.log('Regenerate error:', error)
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    getReportsData()
  }, [token, navigate])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAssessmentTypeColor = (assessmentId) => {
    const colors = {
      'as_hr_02': 'bg-blue-100 text-blue-800',
      'as_card_01': 'bg-green-100 text-green-800'
    }
    return colors[assessmentId] || 'bg-gray-100 text-gray-800'
  }

  const getAssessmentName = (assessmentId) => {
    const names = {
      'as_hr_02': 'Health & Fitness',
      'as_card_01': 'Cardiac Analysis'
    }
    return names[assessmentId] || assessmentId
  }

  if (loading) {
    return (
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-center'>
            <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading reports...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      {/* Page Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Generated Reports</h1>
          <p className='text-gray-600'>View and download your assessment reports</p>
        </div>
        <button
          onClick={() => navigate('/generate-report')}
          className='mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center'
        >
          <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          Generate New Report
        </button>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className='bg-white rounded-xl shadow-lg p-12 text-center'>
          <svg className='w-16 h-16 text-gray-300 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
          </svg>
          <h3 className='text-xl font-semibold text-gray-800 mb-2'>No Reports Generated</h3>
          <p className='text-gray-600 mb-6'>You haven't generated any reports yet. Start by creating your first assessment report.</p>
          <button
            onClick={() => navigate('/generate-report')}
            className='bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors'
          >
            Generate Your First Report
          </button>
        </div>
      ) : (
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          {/* Table Header */}
          <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
            <div className='grid grid-cols-1 md:grid-cols-5 gap-4 font-medium text-gray-700'>
              <div>Session & Type</div>
              <div>File Name</div>
              <div>Generated</div>
              <div>Size</div>
              <div>Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className='divide-y divide-gray-200'>
            {reports.map((report) => (
              <div key={report.sessionId} className='px-6 py-4 hover:bg-gray-50 transition-colors'>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-4 items-center'>
                  {/* Session & Type */}
                  <div className='flex flex-col'>
                    <span className='font-medium text-gray-900 mb-1'>{report.sessionId}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAssessmentTypeColor(report.assessmentId)} w-fit`}>
                      {getAssessmentName(report.assessmentId)}
                    </span>
                  </div>

                  {/* File Name */}
                  <div className='flex items-center'>
                    <svg className='w-5 h-5 text-red-500 mr-2 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
                    </svg>
                    <span className='text-gray-900 font-medium truncate'>{report.fileName}</span>
                  </div>

                  {/* Generated Date */}
                  <div className='text-sm text-gray-600'>
                    {formatDate(report.generatedAt)}
                  </div>

                  {/* File Size */}
                  <div className='text-sm text-gray-600'>
                    {report.fileSize}
                  </div>

                  {/* Actions */}
                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={() => handleDownloadReport(report)}
                      className='inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors'
                      title='Download Report'
                    >
                      <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                      </svg>
                      Download
                    </button>
                    
                    <button
                      onClick={() => handleRegenerateReport(report.sessionId)}
                      className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-600 hover:text-blue-500 transition-colors'
                      title='Regenerate Report'
                    >
                      <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                      </svg>
                      Regenerate
                    </button>
                  </div>
                </div>

                {/* Mobile-friendly stacked layout */}
                <div className='md:hidden mt-4 pt-4 border-t border-gray-100'>
                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <div>
                      <span className='text-gray-500'>Generated:</span>
                      <div className='font-medium'>{formatDate(report.createdAt)}</div>
                    </div>
                    <div>
                      <span className='text-gray-500'>Size:</span>
                      <div className='font-medium'>{report.fileSize}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className='mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='text-2xl font-bold text-gray-900 mb-1'>{reports.length}</div>
          <div className='text-sm text-gray-600'>Total Reports</div>
        </div>
        
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='text-2xl font-bold text-green-600 mb-1'>
            {reports.length}
          </div>
          <div className='text-sm text-gray-600'>Completed</div>
        </div>
        
        <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
          <div className='text-2xl font-bold text-blue-600 mb-1'>
            {reports.reduce((total, report) => {
              const size = parseFloat(report.fileSize?.replace(' MB', '') || '0')
              return total + size
            }, 0).toFixed(1)} MB
          </div>
          <div className='text-sm text-gray-600'>Total Size</div>
        </div>
      </div>
    </div>
  )
}

export default ReportsList