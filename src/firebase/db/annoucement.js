import { firestoreDB } from "../../main";
import {
    addDoc,
    collection,

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