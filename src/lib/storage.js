import { supabase } from './supabase';
import imageCompression from 'browser-image-compression';

/**
 * Sube una imagen al bucket 'media' optimizándola según el contexto.
 */
export const uploadMedia = async (file, folder, id) => {
    if (!file) return null;

    try {
        // Configuraciones de optimización adaptativas
        const isProfile = folder === 'profiles';
        
        const options = {
            maxSizeMB: isProfile ? 0.1 : 0.4,       // 100KB para perfil, 400KB para el resto
            maxWidthOrHeight: isProfile ? 400 : 1200, // 400px para perfil es suficiente
            useWebWorker: true,
            fileType: 'image/jpeg',
            initialQuality: 0.8
        };

        console.log(`[DBA] Optimizando ${folder}: original ${(file.size / 1024).toFixed(2)} KB...`);
        const compressedFile = await imageCompression(file, options);
        console.log(`[DBA] Finalizado: ${(compressedFile.size / 1024).toFixed(2)} KB.`);

        const fileExt = 'jpg'; 
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${folder}/${id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, compressedFile, {
                cacheControl: '3600', 
                upsert: true
            });

        if (uploadError) throw uploadError;

        return filePath;
    } catch (error) {
        console.error('[DBA] Error en proceso de imagen:', error);
        throw new Error(`Error de optimización: ${error.message}`);
    }
};

/**
 * Genera la URL pública para un path de storage con cache busting.
 */
export const getMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;

    const { data } = supabase.storage
        .from('media')
        .getPublicUrl(path);

    if (!data || !data.publicUrl) return null;

    // Cache busting basado en minutos para permitir balance entre carga y actualización
    const cacheKey = Math.floor(Date.now() / 60000); 
    return `${data.publicUrl}?v=${cacheKey}`;
};
