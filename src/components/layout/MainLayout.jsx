import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatWidget from '../ChatWidget';

const MainLayout = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <Sidebar />
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
