import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../../components/educator/SideBar'
import Navbar from '../../components/educator/Navbar'
import Footer from '../../components/educator/Footer'

const Educator = () => {
    return (
        <div className="text-[#C0C0C0] bg-[#1E1E2F] min-h-screen">
            <Navbar />
            <div className='flex'>
                <SideBar />
                <div className='flex-1'>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Educator
