import { useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';

/**
 * Hook para gestionar la carga del perfil de negocio
 */
export const useProfileLoader = (setProfile) => {
    const isFetching = useRef(false);
    const lastFetchedId = useRef(null);

    const fetchProfile = useCallback(async (userId) => {
        if (!userId || isFetching.current) return;
        
        try {
            isFetching.current = true;
            console.log('--- INICIANDO FETCH PROFILE ---', userId);
            
            // Usamos una consulta unificada para minimizar peticiones
            const { data, error } = await supabase
                .from('usuarios')
                .select(`
                    *,
                    roles:rol_id ( id, nombre, nivel_acceso )
                `)
                .eq('id', userId)
                .maybeSingle();

            if (error) {
                console.error('--- ERROR EN FETCH PROFILE ---', error);
                setProfile(null);
                return;
            }

            if (data) {
                console.log('--- PERFIL CARGADO ---', data);
                lastFetchedId.current = userId;
                
                // Aseguramos que el objeto de rol exista para evitar fallos en UI
                const finalProfile = {
                    ...data,
                    roles: data.roles || { nombre: data.rol || 'Consultor' }
                };
                
                setProfile(finalProfile);
            } else {
                console.warn('--- PERFIL NO ENCONTRADO ---');
                setProfile(null);
            }
            
        } catch (err) {
            console.error('--- ERROR FATAL EN fetchProfile ---', err);
            setProfile(null);
        } finally {
            isFetching.current = false;
        }
    }, [setProfile]);

    return { fetchProfile, lastFetchedId };
};
