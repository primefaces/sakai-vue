import { firestoreDB } from "../../main";
import {
    addDoc,
    collection,
    query,
    getDocs,
} from 'firebase/firestore';
import { addAnnoucement } from "../img/users";


/**
 * Guarda un nuevo anuncio en la colección "announcements".
 *
 * @param {Object} announcementData - Los datos del anuncio a guardar.
 * @param {File} selectedFile - El archivo de imagen seleccionado.
 * @returns {Promise<void>}
 */
export async function saveAnnouncement(announcementData, selectedFile) {
    try {
        let imageUrl = '';

        // Si hay un archivo seleccionado, subirlo a Firebase Storage
        if (selectedFile) {
            const filePath = `announcements/${announcementData.type}/${selectedFile.name}`;
            imageUrl = await addAnnoucement(selectedFile, filePath);
        }

        // Agregar el anuncio a la colección "announcements" en Firestore
        await addDoc(collection(firestoreDB, 'announcements'), {
            ...announcementData,
            imageUrl, 
            createdAt: new Date(), 
            visible: true
        });

        console.log('Anuncio guardado exitosamente en Firestore');
    } catch (error) {
        console.error('Error saving announcement:', error);
        throw error;
    }
}


/**
 * Obtiene los anuncios de la colección "announcements" y omite los que tienen 'dateTime' menor a la fecha actual.
 *
 * @returns {Promise<Array>} - Una promesa que resuelve en una lista de anuncios válidos.
 */
export async function getAnnouncements() {
    try {
        const announcementsCollection = collection(firestoreDB, 'announcements');
        
        // Obtener todos los documentos de la colección sin filtros
        const querySnapshot = await getDocs(query(announcementsCollection));
        
        const now = new Date();

        // Mapear y filtrar los documentos
        const announcements = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            .filter(announcement => {
                const { dateTime } = announcement;
                // Si 'dateTime' no existe, o si existe y es mayor o igual a la fecha actual, incluir el anuncio
                return !dateTime || new Date(dateTime) >= now;
            });

        console.log('Anuncios válidos obtenidos exitosamente:', announcements);
        return announcements;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
}