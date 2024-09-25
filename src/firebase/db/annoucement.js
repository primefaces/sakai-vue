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
 * @returns {Promise<Array>} - Una promesa que resuelve en una lista de anuncios válidos, ordenados del más viejo al más nuevo.
 */
export async function getAnnouncements() {
    try {
        const announcementsCollection = collection(firestoreDB, 'announcements');
        
        const querySnapshot = await getDocs(query(announcementsCollection));
        
        // Mapear y filtrar los documentos
        const announcements = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)); // Ordenar de más viejo a más nuevo

        console.log('Anuncios válidos obtenidos exitosamente:', announcements);
        return announcements;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
}
