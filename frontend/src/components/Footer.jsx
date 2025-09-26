import React from 'react'
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className='bg-gray-900 text-white'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm px-4 sm:px-20'>
        
        {/* Company Info */}
        <div>
          <p className='text-xl font-bold mb-5 text-blue-400'>AssessmentPro</p>
          <p className='w-full md:w-2/3 text-gray-300 leading-6'>
            Professional assessment management system for generating comprehensive reports. 
            Streamline your assessment workflow with our automated PDF generation and flexible configuration system.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-300'>
            <li  onClick={() => navigate("/signup")} className='hover:text-white cursor-pointer'>Home</li>
            <li className='hover:text-white cursor-pointer'>Dashboard</li>
            <li className='hover:text-white cursor-pointer'>Generate Reports</li>
            <li className='hover:text-white cursor-pointer'>Reports Library</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-300'>
            <li>support@assessmentpro.com</li>
            <li>+1-212-456-7890</li>
            <li className='hover:text-white cursor-pointer'>Privacy Policy</li>
            <li className='hover:text-white cursor-pointer'>Terms of Service</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className='border-t border-gray-700'>
        <hr />
        <p className='py-5 text-sm text-center text-gray-400'>
          Copyright 2024 @ AssessmentPro - All Rights Reserved.
        </p>
      </div>
    </div>
  )
}

export default Footer