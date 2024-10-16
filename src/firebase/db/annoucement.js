import { firestoreDB } from "../../main";
import {
    addDoc,
    collection,
    query,
    getDocs,
    where,
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

        if (selectedFile) {
            const filePath = `announcements/${announcementData.type}/${selectedFile.name}`;
            imageUrl = await addAnnoucement(selectedFile, filePath);
        }

        await addDoc(collection(firestoreDB, 'announcements'), {
            ...announcementData,
            imageUrl, 
            preregister: {},
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
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt )); 


        return announcements;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
}

/**
 * Obtiene los anuncios del tipo "Asesoría" con dateTime válido.
 *
 * @returns {Promise<Array>} - Lista de anuncios filtrados y ordenados.
 */
export async function getAnnouncementsGrupales() {
    try {
        const announcementsCollection = collection(firestoreDB, 'announcements');

        // Filtra por tipo "Asesoría" y visible
        const q = query(
            announcementsCollection,
            where('type', '==', 'Asesoría'),
            where('visible', '==', true)
        );

        const querySnapshot = await getDocs(q);

        // Definimos la fecha actual (ahora)
        const now = new Date();
        
        // Mapeamos y filtramos los anuncios
        const announcements = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
                dateTime: doc.data().dateTime.toDate(), // Convertimos el timestamp a Date
            }))
            .filter(ann => ann.dateTime >= now) // Filtra los anuncios futuros
            .sort((a, b) => a.createdAt - b.createdAt); // Ordena por createdAt

        console.log('Fecha actual:', now);
        console.log('Anuncios:', announcements);

        return announcements;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
}