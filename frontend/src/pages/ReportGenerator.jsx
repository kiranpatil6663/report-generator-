import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const ReportGenerator = () => {
  const navigate = useNavigate()
  const { token, generateReport, loading ,backendUrl} = useContext(AppContext)
  
  const [sessionId, setSessionId] = useState('')
  const [lastGeneratedReport, setLastGeneratedReport] = useState(null)

  // Sample session IDs for testing (you can update these based on your data.js)
  const sampleSessionIds = [
    'session_001',
    'session_002', 
    'session_003',
    'hr_assessment_001',
    'card_assessment_001'
  ]

  const handleGenerateReport = async (e) => {
    e.preventDefault()
    
    if (!sessionId.trim()) {
      toast.error('Please enter a session ID')
      return
    }

    const result = await generateReport(sessionId.trim())
    if (result) {
      setLastGeneratedReport({
        sessionId: sessionId.trim(),
        timestamp: new Date().toLocaleString(),
        status: 'success'
      })
      setSessionId('')
      if (result.reportUrl) {
      const link = document.createElement('a');
      link.href = backendUrl + result.reportUrl;
      link.download = `${sessionId.trim()}_report.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    }
  }

  const handleUseSampleId = (id) => {
    setSessionId(id)
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      {/* Page Header */}
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-3'>Generate Assessment Report</h1>
        <p className='text-gray-600 text-lg'>Enter a session ID to generate a PDF report from assessment data</p>
      </div>

      {/* Main Form */}
      <div className='bg-white rounded-xl shadow-lg p-8 mb-8'>
        <form onSubmit={handleGenerateReport} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Session ID
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Enter session ID (e.g., session_001)"
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg'
              disabled={loading}
            />
            <p className='text-sm text-gray-500 mt-2'>
              The session ID corresponds to assessment data stored in your system
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !sessionId.trim()}
            className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Report...
              </>
            ) : (
              <>
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
                Generate PDF Report
              </>
            )}
          </button>
        </form>
      </div>

      {/* Sample Session IDs */}
      <div className='bg-gray-50 rounded-xl p-6 mb-8'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Sample Session IDs for Testing</h3>
        <p className='text-sm text-gray-600 mb-4'>
          Click on any sample ID below to populate the form and test report generation:
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
          {sampleSessionIds.map((id, index) => (
            <button
              key={index}
              onClick={() => handleUseSampleId(id)}
              className='bg-white border border-gray-200 rounded-lg p-3 text-left hover:bg-blue-50 hover:border-blue-300 transition-colors'
              disabled={loading}
            >
              <code className='text-blue-600 font-mono text-sm'>{id}</code>
            </button>
          ))}
        </div>
      </div>

      {/* Last Generated Report Info */}
      {lastGeneratedReport && (
        <div className='bg-green-50 border border-green-200 rounded-xl p-6'>
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-lg font-medium text-green-800'>Report Generated Successfully!</h3>
              <div className='mt-2 text-sm text-green-700'>
                <p><strong>Session ID:</strong> {lastGeneratedReport.sessionId}</p>
                <p><strong>Generated at:</strong> {lastGeneratedReport.timestamp}</p>
                <p className='mt-2'>The PDF report has been saved to your local filesystem. Check your reports folder or visit the Reports page to download it.</p>
              </div>
              <div className='mt-4'>
                <button
                  onClick={() => navigate('/reports')}
                  className='bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors'
                >
                  View All Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className='bg-blue-50 rounded-xl p-6'>
        <h3 className='text-lg font-semibold text-blue-800 mb-3'>How It Works</h3>
        <ul className='space-y-2 text-blue-700 text-sm'>
          <li className='flex items-start'>
            <span className='w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0'></span>
            Enter a valid session ID that exists in your assessment data
          </li>
          <li className='flex items-start'>
            <span className='w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0'></span>
            The system reads the assessment data for that session
          </li>
          <li className='flex items-start'>
            <span className='w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0'></span>
            Based on the assessment type, it generates the appropriate report format
          </li>
          <li className='flex items-start'>
            <span className='w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0'></span>
            The PDF is created and saved to your local filesystem
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ReportGenerator