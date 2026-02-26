import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMediaUrl, uploadMedia } from '../lib/storage';
import { 
    LucideCamera, LucideUser, LucideBriefcase, 
    LucideMail, LucidePhone, LucideEdit3, 
    LucideX, LucideSave, LucideShieldCheck,
    LucideLoader2, LucideCheckCircle2
} from 'lucide-react';

const Profile = () => {
    const { profile, user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef(null);
    
    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: ''
    });

    // Sincronizar datos cuando el perfil carga
    useEffect(() => {
        if (profile) {
            setFormData({
                nombre: profile.nombre || '',
                telefono: profile.telefono || ''
            });
        }
    }, [profile]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await updateProfile({
                nombre: formData.nombre,
                telefono: formData.telefono
            });
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            alert('Error al guardar los cambios: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;

        try {
            setIsUploading(true);
            
            // 1. Subir usando la utilidad centralizada
            const filePath = await uploadMedia(file, 'profiles', user.id);

            // 2. Actualizar tabla usuarios con el PATH RELATIVO
            await updateProfile({
                avatar_url: filePath
            });

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            alert('Error al subir la imagen: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const userName = profile?.nombre || user?.email?.split('@')[0] || 'Usuario';
    const userRole = profile?.roles?.nombre || 'Consultor';
    const userAvatar = getMediaUrl(profile?.avatar_url);
    const userEmail = user?.email || '';

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Input de archivo oculto */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />

            {/* Mensaje de Éxito Flotante */}
            {showSuccess && (
                <div className="fixed top-20 right-8 z-50 animate-in slide-in-from-right duration-300">
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                        <LucideCheckCircle2 size={20} />
                        <span className="font-bold text-sm">¡Operación completada con éxito!</span>
                    </div>
                </div>
            )}

            {/* Header con Acción de Edición */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Mi Perfil</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Información personal y de contacto en la plataforma.
                    </p>
                </div>
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 border border-primary/10"
                    >
                        <LucideEdit3 size={18} />
                        Editar Perfil
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button 
                            onClick={() => {
                                setIsEditing(false);
                                // Revertir cambios locales
                                setFormData({
                                    nombre: profile.nombre || '',
                                    telefono: profile.telefono || ''
                                });
                            }}
                            disabled={isSaving || isUploading}
                            className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
                        >
                            <LucideX size={18} />
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving || isUploading}
                            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70"
                        >
                            {isSaving ? (
                                <LucideLoader2 size={18} className="animate-spin" />
                            ) : (
                                <LucideSave size={18} />
                            )}
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Datos de Identidad</h2>
                    {isEditing && (
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded uppercase tracking-widest">Modo Edición</span>
                    )}
                </div>
                <div className="p-8 flex flex-col md:flex-row gap-10 items-start">
                    {/* Avatar Area */}
                    <div className="relative group mx-auto md:mx-0">
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                alt="Profile"
                                className={`w-36 h-36 rounded-full object-cover ring-4 ring-slate-50 dark:ring-slate-800 transition-all group-hover:ring-primary/20 ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
                                onClick={handleAvatarClick}
                            />
                        ) : (
                            <div 
                                className={`w-36 h-36 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center ring-4 ring-slate-50 dark:ring-slate-800 transition-all group-hover:ring-primary/20 border border-slate-200 dark:border-slate-700 ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
                                onClick={handleAvatarClick}
                            >
                                {isUploading ? (
                                    <LucideLoader2 size={40} className="text-primary animate-spin" />
                                ) : (
                                    <LucideUser size={56} className="text-slate-400" />
                                )}
                            </div>
                        )}
                        {isEditing && (
                            <button 
                                onClick={handleAvatarClick}
                                disabled={isUploading}
                                className="absolute bottom-1 right-1 bg-primary text-white p-2.5 rounded-full shadow-xl border-2 border-white dark:border-slate-900 hover:scale-110 transition-transform animate-in zoom-in"
                            >
                                {isUploading ? <LucideLoader2 size={18} className="animate-spin" /> : <LucideCamera size={18} />}
                            </button>
                        )}
                    </div>

                    {/* Form Area */}
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
                </div>
            </div>

            {/* Seguridad / Metadata Section (Solo Lectura Siempre) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                        Nivel de Acceso
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <span className="text-xl font-black">{profile?.roles?.nivel_acceso || 0}</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Nivel Autorizado</p>
                            <p className="text-xs text-slate-500">Determina los módulos visibles en el sistema.</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-slate-400 rounded-full"></span>
                        Seguridad
                    </h3>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UID del Sistema</p>
                        <code className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 p-2 rounded-lg block truncate text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            {user?.id}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
