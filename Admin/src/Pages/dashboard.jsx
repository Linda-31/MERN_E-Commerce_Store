import React from "react";
import '../Styles/style.css';
import { Outlet } from 'react-router-dom';
import Sidebar from "../Component/Sidebar";

function Dashboard() {
  return (
    <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content">
            <div className="container-fluid">
                <Outlet />
            </div>
        </main>
    </div>
  )
}

export default Dashboard;