import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMediaUrl, uploadMedia } from '../../lib/storage';
import ProfileAvatarEditor from '../../components/profile/ProfileAvatarEditor';
import ProfileIdentityForm from '../../components/profile/ProfileIdentityForm';
import ProfileSecurityPanel from '../../components/profile/ProfileSecurityPanel';
import { 
    LucideEdit3, LucideX, LucideSave, 
    LucideLoader2, LucideCheckCircle2
} from 'lucide-react';

const Profile = () => {
    const { profile, user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: ''
    });

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
            const filePath = await uploadMedia(file, 'profiles', user.id);
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

    const userRole = profile?.roles?.nombre || 'Consultor';
    const userAvatar = getMediaUrl(profile?.avatar_url);
    const userEmail = user?.email || '';

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />

            {showSuccess && (
                <div className="fixed top-20 right-8 z-50 animate-in slide-in-from-right duration-300">
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                        <LucideCheckCircle2 size={20} />
                        <span className="font-bold text-sm">¡Operación completada con éxito!</span>
                    </div>
                </div>
            )}

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
                    <ProfileAvatarEditor 
                        userAvatar={userAvatar}
                        isEditing={isEditing}
                        isUploading={isUploading}
                        onAvatarClick={handleAvatarClick}
                    />

                    <ProfileIdentityForm 
                        formData={formData}
                        setFormData={setFormData}
                        isEditing={isEditing}
                        userRole={userRole}
                        userEmail={userEmail}
                    />
                </div>
            </div>

            <ProfileSecurityPanel 
                accessLevel={profile?.roles?.nivel_acceso}
                userId={user?.id}
            />
        </div>
    );
};

export default Profile;
