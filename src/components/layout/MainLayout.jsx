import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatWidget from '../ChatWidget';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen">
            <Navbar onToggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <main className="md:ml-64 pt-16 min-h-screen">
                <div className="p-6 max-w-7xl mx-auto space-y-6">
                    <Outlet />
                </div>
            </main>
            <ChatWidget />
        </div>
    );
};

export default MainLayout;
