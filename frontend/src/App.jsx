import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Dashboard from './Pages/Dashboard'
import ReportGenerator from './Pages/ReportGenerator'
import ReportsList from './Pages/ReportList'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/generate-report" element={<ReportGenerator/>}/>
        <Route path="/reports" element={<ReportsList/>}/>
      </Routes>
      
      <Footer/>
    </div>
  )
}

export default App