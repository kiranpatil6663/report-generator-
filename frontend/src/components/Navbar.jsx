import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false);
 
  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="bg-blue-600 text-white flex items-center justify-between text-sm py-4 mb-5 border-b border-b-blue-400">
      <p
        className="text-xl font-bold px-4 cursor-pointer"
        onClick={() => navigate("/")}
      >
        AssessmentPro
      </p>
      
      <div>
        <ul className="hidden md:flex items-center gap-5 font-medium">
          <NavLink to="/">
            <li className="hover:text-blue-200">Home</li>
          </NavLink>
          {token && (
            <>
              <NavLink to="/dashboard">
                <li className="hover:text-blue-200">Dashboard</li>
              </NavLink>
              <NavLink to="/generate-report">
                <li className="hover:text-blue-200">Generate Report</li>
              </NavLink>
              <NavLink to="/reports">
                <li className="hover:text-blue-200">Reports</li>
              </NavLink>
            </>
          )}
        </ul>
      </div>

      {token && userData ? (
        <div className="flex items-center gap-2 cursor-pointer group relative">
          <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
            {userData.name ? userData.name[0].toUpperCase() : 'U'}
          </div>
          <span className="hidden md:block">{userData.name}</span>
          <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>

          <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
            <div className="min-w-48 bg-white rounded-lg shadow-lg flex flex-col gap-2 p-4">
              <p
                onClick={() => navigate("/dashboard")}
                className="hover:text-black cursor-pointer py-2 px-3 rounded hover:bg-gray-100"
              >
                Dashboard
              </p>
              <p
                onClick={logout}
                className="hover:text-red-600 cursor-pointer py-2 px-3 rounded hover:bg-gray-100"
              >
                Logout
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 mr-4">
         
          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-700 font-medium text-white py-2 px-4 rounded hover:bg-blue-800 transition-colors"
          >
            Sign Up
          </button>
        </div>
      )}
     
      {/* Mobile menu toggle */}
      <button 
        className="w-6 h-6 md:hidden flex flex-col justify-center items-center" 
        onClick={() => setShowMenu(true)}
      >
        <span className="w-5 h-0.5 bg-white mb-1"></span>
        <span className="w-5 h-0.5 bg-white mb-1"></span>
        <span className="w-5 h-0.5 bg-white"></span>
      </button>

      {/* Mobile menu */}
      <div className={`${showMenu ? 'fixed w-full h-screen':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
        <div className="flex items-center justify-between px-5 py-6">
          <p
            className="text-blue-600 text-xl font-bold cursor-pointer"
            onClick={() => {navigate("/"); setShowMenu(false)}}
          >
            AssessmentPro
          </p>
          <button onClick={() => setShowMenu(false)} className="text-gray-600 text-2xl">
            ×
          </button>
        </div>
        
        <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg text-black font-medium">
          <NavLink onClick={() => setShowMenu(false)} to="/">
            <p className='px-4 py-2 rounded hover:bg-gray-100'>Home</p>
          </NavLink>
          {token && (
            <>
              <NavLink onClick={() => setShowMenu(false)} to="/dashboard">
                <p className='px-4 py-2 rounded hover:bg-gray-100'>Dashboard</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/generate-report">
                <p className='px-4 py-2 rounded hover:bg-gray-100'>Generate Report</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/reports">
                <p className='px-4 py-2 rounded hover:bg-gray-100'>Reports</p>
              </NavLink>
            </>
          )}
          {!token && (
            <>
              <NavLink onClick={() => setShowMenu(false)} to="/login">
                <p className='px-4 py-2 rounded hover:bg-gray-100'>Sign In</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/signup">
                <p className='px-4 py-2 rounded hover:bg-gray-100'>Sign Up</p>
              </NavLink>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;