import React from "react";
import { LucideUser, LucideBriefcase, LucideMail, LucidePhone, LucideShieldCheck } from "lucide-react";

const ProfileIdentityForm = ({ 
    formData, 
    setFormData, 
    isEditing, 
    userRole, 
    userEmail 
}) => {
    return (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <LucideUser size={12} /> Nombre Completo
                </label>
                <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Tu nombre completo"
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isEditing 
                        ? "bg-slate-50 dark:bg-slate-800 border-2 border-primary/20 focus:border-primary focus:ring-0 outline-none shadow-inner" 
                        : "bg-transparent border border-transparent text-slate-900 dark:text-white font-bold text-lg p-0 cursor-default"
                    }`}
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <LucideBriefcase size={12} /> Cargo en Empresa
                </label>
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-black text-primary uppercase tracking-tight">{userRole}</span>
                    <LucideShieldCheck size={14} className="text-primary/50" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <LucideMail size={12} /> Correo de Acceso
                </label>
                <p className="px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 truncate bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    {userEmail}
                </p>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <LucidePhone size={12} /> Teléfono Móvil
                </label>
                <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Ej: +54 9 11 ..."
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isEditing 
                        ? "bg-slate-50 dark:bg-slate-800 border-2 border-primary/20 focus:border-primary focus:ring-0 outline-none shadow-inner" 
                        : "bg-transparent border border-transparent text-slate-900 dark:text-white font-bold text-lg p-0 cursor-default"
                    }`}
                />
            </div>
        </div>
    );
};

export default ProfileIdentityForm;
