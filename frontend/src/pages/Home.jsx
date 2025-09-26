import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Home = () => {
  const navigate = useNavigate()
  const { token } = useContext(AppContext)

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4'>
        <div className='max-w-6xl mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-6'>
            Assessment Management
            <span className='block text-blue-200'>Made Simple</span>
          </h1>
          <p className='text-lg md:text-xl mb-8 text-blue-100 max-w-3xl mx-auto'>
            Generate professional PDF reports from assessment data with our flexible, 
            configuration-driven system. No coding required for new assessment types.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            {token ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors'
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/signup')}
                  className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors'
                >
                  Get Started Free
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className='bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='py-20 px-4 bg-gray-50'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800'>
            Powerful Features
          </h2>
          
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='bg-white p-8 rounded-xl shadow-lg text-center'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-3'>PDF Generation</h3>
              <p className='text-gray-600'>
                Generate professional PDF reports from assessment data with customizable templates and layouts.
              </p>
            </div>

            <div className='bg-white p-8 rounded-xl shadow-lg text-center'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-3'>Flexible Configuration</h3>
              <p className='text-gray-600'>
                Add new assessment types and modify reports through configuration files without code changes.
              </p>
            </div>

            <div className='bg-white p-8 rounded-xl shadow-lg text-center'>
              <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-3'>Secure Access</h3>
              <p className='text-gray-600'>
                Secure user authentication and session management to protect sensitive assessment data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='py-20 px-4 bg-white'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-6 text-gray-800'>
            Ready to Get Started?
          </h2>
          <p className='text-lg text-gray-600 mb-8'>
            Join thousands of professionals who trust AssessmentPro for their reporting needs.
          </p>
          {!token && (
            <button 
              onClick={() => navigate('/signup')}
              className='bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors'
            >
              Create Free Account
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home