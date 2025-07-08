import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router';

const MainLayout = () => {
    return (
        <>
        <Navbar></Navbar>
        <div className='min-h-screen'>
            <Outlet></Outlet>
        </div>
        <Footer></Footer>
        </>
    );
};

export default MainLayout;