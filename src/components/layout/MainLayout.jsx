import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

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
            <button className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                <span className="material-icons text-2xl">add</span>
            </button>
        </div>
    );
};

export default MainLayout;
