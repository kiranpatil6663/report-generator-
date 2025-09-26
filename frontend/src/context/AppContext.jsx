import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userData, setUserData] = useState(false)
    const [reports, setReports] = useState([])
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(false)

    // Get user profile data
    const usersProfile = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/profile', { headers: { token } })
            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Generate report function
    const generateReport = async (sessionId) => {
        try {
            setLoading(true)
            const { data } = await axios.post(
                backendUrl + '/api/reports/generate',
                {  sessionId },
                { headers: { token } }
            )
            
            if (data.success) {
                toast.success('Report generated successfully!')
                getReportsData() // Refresh reports list
                return data
            } else {
                toast.error(data.message)
                return null
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Failed to generate report')
            return null
        } finally {
            setLoading(false)
        }
    }

    // Get reports list
    const getReportsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/reports', { headers: { token } })
            if (data.success) {
                setReports(data.reports)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Get session by ID
    const getSessionById = async (sessionId) => {
        try {
            const { data } = await axios.get(backendUrl + `/api/session/${sessionId}`, { headers: { token } })
            if (data.success) {
                return data.session
            } else {
                toast.error(data.message)
                return null
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            return null
        }
    }

    // Get assessment config
    const getConfig = async (assessmentId) => {
        try {
            const { data } = await axios.get(backendUrl + `/api/config/${assessmentId}`, { headers: { token } })
            if (data.success) {
                return data.config
            } else {
                toast.error(data.message)
                return null
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            return null
        }
    }

    // Get test context
    const getTestContext = async (sessionId) => {
        try {
            const { data } = await axios.get(backendUrl + `/api/test-context/${sessionId}`, { headers: { token } })
            if (data.success) {
                return data.context
            } else {
                toast.error(data.message)
                return null
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            return null
        }
    }

    // Download report
    const downloadReport = async (reportId, fileName) => {
        try {
            setLoading(true)
            const response = await axios.get(
                backendUrl + `/api/report/download/${reportId}`,
                { 
                    headers: { token },
                    responseType: 'blob'
                }
            )
            
            // Create blob and download
            const blob = new Blob([response.data])
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName || `report_${reportId}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            
            toast.success('Report downloaded successfully!')
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Failed to download report')
        } finally {
            setLoading(false)
        }
    }

 
    // Login function
    const loginUser = async (email, password) => {
        try {
            setLoading(true)
            const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
            
            if (data.success) {
                setToken(data.token)
                localStorage.setItem('token', data.token)
                toast.success('Login successful!')
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Login failed')
            return false
        } finally {
            setLoading(false)
        }
    }

    // Logout function
    const logoutUser = () => {
        setToken(false)
        setUserData(false)
        setReports([])
        setSessions([])
        localStorage.removeItem('token')
        toast.success('Logged out successfully')
    }

    const value = {
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData,
        usersProfile,
        reports, getReportsData,
        sessions, setSessions,
        loading, setLoading,
        generateReport,
        downloadReport,
        getSessionById,
        getConfig,
        getTestContext,
        loginUser,
        logoutUser
    }

    useEffect(() => {
        if (token) {
            usersProfile()
            getReportsData()
        } else {
            setUserData(false)
            setReports([])
        }
    }, [token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider