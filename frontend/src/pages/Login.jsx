import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const { token, setToken, backendUrl } = useContext(AppContext)
  
  const [state, setState] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    
    try {
      setLoading(true)
      
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created successfully!')
        } else {
          toast.error(data.message)
        }
        
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
        
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Login successful!')
        } else {
          toast.error(data.message)
        }
      }
      
    } catch (error) {
      console.log(error)
      toast.error('invalid credentials')
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
          {state === 'Sign Up' ? 'Create Account' : 'Sign In'}
        </p>
        <p className='text-center w-full mb-6 text-gray-500'>
          Please {state === 'Sign Up' ? 'sign up' : 'login'} to access your dashboard
        </p>

        {state === 'Sign Up' && (
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
        )}

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
            placeholder="Enter your password"
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
              Processing...
            </>
          ) : (
            state === 'Sign Up' ? 'Create Account' : 'Sign In'
          )}
        </button>

        {state === 'Sign Up' ? (
          <p className='w-full text-center mt-4'>
            Already have an account? 
            <span 
              onClick={() => setState('Sign In')} 
              className='text-blue-600 underline cursor-pointer hover:text-blue-700 ml-1'
            >
              Sign in here
            </span>
          </p>
        ) : (
          <p className='w-full text-center mt-4'>
            Don't have an account? 
            <span 
           onClick={() => navigate("/signup")}
              className='text-blue-600 underline cursor-pointer hover:text-blue-700 ml-1'
            >
              Create one here
            </span>
          </p>
        )}
      </div>
    </form>
  )
}

export default Login