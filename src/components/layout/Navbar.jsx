import { userData } from '../../data/mockData';

const Navbar = () => {
    return (
        <nav className="fixed top-0 z-50 w-full bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 h-16 flex items-center px-6">
            {/* Left: Logo Area */}
            <div className="flex-1 flex items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                        <span className="material-icons text-xl">architecture</span>
                    </div>
                    <span className="font-bold text-xl tracking-tighter text-primary dark:text-white uppercase">
                        CONSTRU<span className="text-accent font-black">PRO</span>
                    </span>
                </div>
            </div>

            {/* Center: Search Area */}
            <div className="flex-1 hidden lg:flex justify-center">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-xl px-4 py-2 w-full max-w-md border border-transparent focus-within:border-primary/30 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all shadow-inner">
                    <span className="material-icons text-slate-400 text-lg mr-3">search</span>
                    <input
                        className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 placeholder-slate-400 font-medium"
                        placeholder="Buscar proyectos, materiales o tareas..."
                        type="text"
                    />
                    <span className="hidden xl:block text-[10px] font-black text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded ml-2 uppercase">⌘K</span>
                </div>
            </div>

            {/* Right: User & Actions Area */}
            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4">
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group">
                    <span className="material-icons">notifications</span>
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
                </button>
                
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>
                
                <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-black text-slate-900 dark:text-white leading-none tracking-tight">{userData.name}</p>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold opacity-80">
                            {userData.role}
                        </p>
                    </div>
                    <div className="relative">
                        <img
                            alt={userData.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/10 group-hover:ring-primary transition-all"
                            src={userData.avatar}
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-surface-dark"></div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
