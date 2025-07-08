import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';

const DashboardLayout = () => {
    return (
        <>
        <Navbar/>
        <Outlet/>
        </>
    );
};

export default DashboardLayout;