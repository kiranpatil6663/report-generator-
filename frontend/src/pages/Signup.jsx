import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Signup = () => {
  const navigate = useNavigate()
  const { token, setToken, backendUrl } = useContext(AppContext)
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    try {
      setLoading(true)
      
      const { data } = await axios.post(backendUrl + '/api/auth/register', { 
        name, 
        email, 
        password 
      })
      
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success('Account created successfully!')
        navigate('/dashboard')
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center px-4'>
      <div className='flex flex-col gap-3 items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-200 rounded-xl text-gray-600 text-sm shadow-lg bg-white'>
        
        <p className='text-2xl font-semibold text-center w-full text-gray-800 mb-4'>
          Create Account
        </p>
        <p className='text-center w-full mb-6 text-gray-500'>
          Join AssessmentPro and start generating reports
        </p>

        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
          <input 
            className='border border-gray-300 rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
            type="text" 
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            placeholder="Enter your full name"
            required 
          />
        </div>

        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
          <input 
            className='border border-gray-300 rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
            type="email" 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            placeholder="Enter your email"
            required 
          />
        </div>

        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
          <input 
            className='border border-gray-300 rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            placeholder="Create a password (min 6 characters)"
            required 
          />
        </div>

        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Confirm Password</label>
          <input 
            className='border border-gray-300 rounded w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
            type="password" 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            value={confirmPassword} 
            placeholder="Confirm your password"
            required 
          />
        </div>

        <button 
          className='bg-blue-600 text-white w-full py-3 rounded-md text-base font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
          type='submit'
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <p className='w-full text-center mt-4'>
          Already have an account? 
          <Link 
            to="/login" 
            className='text-blue-600 underline hover:text-blue-700 ml-1'
          >
            Sign in here
          </Link>
        </p>
      </div>
    </form>
  )
}

export default Signup