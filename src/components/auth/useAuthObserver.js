import { useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

/**
 * Hook para observar cambios en el estado de autenticación
 */
export const useAuthObserver = (setUser, setProfile, setLoading, fetchProfile, lastFetchedId) => {
    const isInitialized = useRef(false);
    
    useEffect(() => {
        // 1. Detección y Extracción Manual de Tokens (Para HashRouter y Redirecciones)
        const processAuthToken = async () => {
            try {
                const hash = window.location.hash;
                const search = window.location.search;
                console.log('--- Verificando Auth en URL ---', { hash, search });
                
                // Buscamos el token en el hash (común en HashRouter) o en el search
                const fullUrlPart = hash + search;
                if (fullUrlPart.includes('access_token=')) {
                    console.log('--- Token detectado, procesando... ---');
                    
                    // Extraemos los parámetros sin importar dónde estén (antes o después del ?)
                    const queryString = fullUrlPart.includes('?') ? fullUrlPart.split('?')[1] : fullUrlPart.split('#').pop();
                    const params = new URLSearchParams(queryString);
                    
                    const accessToken = params.get('access_token');
                    const refreshToken = params.get('refresh_token');

                    if (accessToken) {
                        console.log('--- Estableciendo Sesión Manual ---');
                        sessionStorage.setItem('is_auth_flow', 'true');
                        
                        const { data, error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken || ''
                        });
                        
                        if (error) {
                            console.error('--- Error en setSession ---', error.message);
                        } else if (data.session) {
                            console.log('--- Sesión establecida con éxito ---', data.session.user.email);
                            setUser(data.session.user);
                        }
                    }
                }
            } catch (e) {
                console.error('--- Error fatal procesando token ---', e);
            } finally {
                // Forzamos fin de carga si hay un flujo de token para que el componente ResetPassword se active
                if (window.location.hash.includes('access_token')) {
                    setLoading(false);
                }
            }
        };

        processAuthToken();

        // 2. Suscripción a Auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth Observer Event:', event, 'Session:', !!session);
            
            try {
                if (session) {
                    setUser(session.user);
                    
                    if (session.user.id !== lastFetchedId.current) {
                        setTimeout(async () => {
                            try {
                                await fetchProfile(session.user.id);
                            } finally {
                                if (!isInitialized.current) {
                                    setLoading(false);
                                    isInitialized.current = true;
                                }
                            }
                        }, 200);
                    } else {
                        setLoading(false);
                        isInitialized.current = true;
                    }

                    // --- LIMPIEZA DE URL SEGURA ---
                    const isAuthFlow = sessionStorage.getItem('is_auth_flow') === 'true';
                    if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && isAuthFlow)) {
                        sessionStorage.removeItem('is_auth_flow');
                        
                        // Limpiamos el hash de tokens pero mantenemos la ruta necesaria
                        const cleanHash = window.location.hash.includes('reset-password') ? '#/reset-password' : '#/';
                        window.history.replaceState({}, document.title, window.location.origin + window.location.pathname + cleanHash);
                    }
                } else {
                    setUser(null);
                    setProfile(null);
                    lastFetchedId.current = null;
                    
                    if (!window.location.hash.includes('access_token')) {
                        setLoading(false);
                        isInitialized.current = true;
                    }
                }
            } catch (err) {
                console.error('Error en Auth Observer:', err);
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [setUser, setProfile, setLoading, fetchProfile, lastFetchedId]);
};
