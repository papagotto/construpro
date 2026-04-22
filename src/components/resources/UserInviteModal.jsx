import React, { useState, useEffect } from 'react';
import { LucideX, LucideMail, LucideShield, LucideBriefcase, LucideLoader2, LucideCheckCircle, LucideSend } from 'lucide-react';
import { supabase, supabaseAdmin } from '../../lib/supabase';

const UserInviteModal = ({ isOpen, onClose, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [rolId, setRolId] = useState('');
    const [proyectoId, setProyectoId] = useState('');
    const [sendEmail, setSendEmail] = useState(true);
    const [roles, setRoles] = useState([]);
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchInitialData();
            setSuccess(false);
            setError(null);
            setEmail('');
            setSendEmail(true);
        }
    }, [isOpen]);

    const fetchInitialData = async () => {
        try {
            setFetchingData(true);
            const [rolesRes, proyectosRes] = await Promise.all([
                supabase.from('roles').select('id, nombre, nivel_acceso').order('nivel_acceso', { ascending: false }),
                supabase.from('proyectos').select('id, nombre').order('nombre')
            ]);

            if (rolesRes.error) throw rolesRes.error;
            if (proyectosRes.error) throw proyectosRes.error;

            setRoles(rolesRes.data);
            setProyectos(proyectosRes.data);
            
            if (rolesRes.data.length > 0) {
                const defaultRol = rolesRes.data.find(r => r.nombre === 'operario') || rolesRes.data[rolesRes.data.length - 1];
                setRolId(defaultRol.id);
            }
        } catch (err) {
            console.error('Error cargando datos para invitación:', err.message);
            setError('No se pudieron cargar los roles o proyectos.');
        } finally {
            setFetchingData(false);
        }
    };

    const selectedRole = roles.find(r => r.id === rolId);
    const isGlobalRole = selectedRole?.nombre === 'director' || selectedRole?.nombre === 'sistemas';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !rolId) return;

        try {
            setLoading(true);
            setError(null);

            if (!supabaseAdmin) {
                throw new Error('El sistema de administración no está configurado (falta SERVICE_ROLE_KEY).');
            }

            let userId;

            // 1. Gestionar el usuario en Auth (A través de la API oficial para disparar correos)
            if (sendEmail) {
                // Usamos la raíz del sitio para que Supabase añada los tokens al final de forma limpia
                const redirectUrl = window.location.origin + window.location.pathname;
                
                // Invitar (dispara mail de Supabase)
                const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
                    redirectTo: redirectUrl,
                });
                if (inviteError) throw inviteError;
                userId = inviteData.user.id;
            } else {
                // Crear silenciosamente
                const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
                    email,
                    email_confirm: true,
                    user_metadata: { source: 'admin_panel' }
                });
                if (createError) throw createError;
                userId = createData.user.id;
            }

            // 2. Sincronizar Perfil y Rol usando nuestra RPC (que ahora solo se encarga del negocio)
            const { data: rpcData, error: rpcError } = await supabase.rpc('registrar_perfil_personal', {
                p_email: email,
                p_rol_id: rolId,
                p_proyecto_id: isGlobalRole ? null : (proyectoId || null)
            });

            if (rpcError) throw rpcError;

            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err) {
            console.error('Error al registrar usuario:', err.message);
            setError(err.message || 'Error al procesar el registro.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                    <div>
                        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Alta de Personal</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Gestión de acceso e identidad</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <LucideX size={20} />
                    </button>
                </div>

                {success ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600">
                            <LucideCheckCircle size={40} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">¡Registro Exitoso!</h4>
                            <p className="text-sm text-slate-500">
                                {sendEmail 
                                    ? `Se envió la invitación a ${email}` 
                                    : `Usuario ${email} registrado correctamente en el sistema.`}
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-600 animate-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                            <div className="relative">
                                <LucideMail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    required
                                    type="email"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-2 ring-transparent focus:ring-primary/20 transition-all" 
                                    placeholder="ejemplo@empresa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading || fetchingData}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rol / Nivel de Acceso</label>
                                <div className="relative">
                                    <LucideShield size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <select 
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-2 ring-transparent focus:ring-primary/20 appearance-none transition-all cursor-pointer"
                                        value={rolId}
                                        onChange={(e) => setRolId(e.target.value)}
                                        disabled={loading || fetchingData}
                                    >
                                        {fetchingData ? (
                                            <option>Cargando roles...</option>
                                        ) : (
                                            roles.map(r => (
                                                <option key={r.id} value={r.id}>
                                                    {r.nombre.toUpperCase()} (Nivel {r.nivel_acceso})
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>

                            {!isGlobalRole && (
                                <div className="space-y-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asignar a Proyecto (Opcional)</label>
                                    <div className="relative">
                                        <LucideBriefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <select 
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold text-slate-700 dark:text-white outline-none ring-2 ring-transparent focus:ring-primary/20 appearance-none transition-all cursor-pointer"
                                            value={proyectoId}
                                            onChange={(e) => setProyectoId(e.target.value)}
                                            disabled={loading || fetchingData}
                                        >
                                            <option value="">Flotante / Sin Proyecto</option>
                                            {fetchingData ? (
                                                <option>Cargando proyectos...</option>
                                            ) : (
                                                proyectos.map(p => (
                                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${sendEmail ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-400'}`}>
                                    <LucideSend size={18} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-slate-700 dark:text-white leading-tight">Enviar invitación por email</p>
                                    <p className="text-[9px] text-slate-500 font-medium">El usuario recibirá un link de acceso</p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setSendEmail(!sendEmail)}
                                className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${sendEmail ? 'bg-primary' : 'bg-slate-300'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${sendEmail ? 'translate-x-4' : ''}`} />
                            </button>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button"
                                onClick={onClose} 
                                className="flex-1 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                disabled={loading || fetchingData || !email}
                                className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <LucideLoader2 size={16} className="animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    'Registrar Personal'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserInviteModal;
