import { supabase } from './supabase';

/**
 * Sube una imagen al bucket 'media' y devuelve el path relativo.
 * @param {File} file - El archivo a subir.
 * @param {string} folder - Carpeta destino (profiles, materials, equipment, projects).
 * @param {string} id - ID de la entidad para organizar subcarpetas.
 * @returns {Promise<string>} - El path relativo del archivo subido.
 */
export const uploadMedia = async (file, folder, id) => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${folder}/${id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

    if (uploadError) {
        throw new Error(`Error al subir imagen: ${uploadError.message}`);
    }

    return filePath;
};

/**
 * Genera la URL pública para un path de storage.
 * @param {string} path - El path relativo guardado en la DB.
 * @returns {string} - La URL completa.
 */
export const getMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;

    const { data } = supabase.storage
        .from('media')
        .getPublicUrl(path);

    // Añadimos un timestamp para evitar cacheo de imágenes viejas o fallidas
    return `${data.publicUrl}?t=${Date.now()}`;
};
