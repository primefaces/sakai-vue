import { firestoreDB } from "../../main";
import {
    addDoc,
    collection,
    query,
    getDocs,
    where,
    updateDoc,
    doc, getDoc
    
} from 'firebase/firestore';
import { addAnnoucement } from "../img/users";


/**
 * Guarda un nuevo anuncio en la colección "announcements".
 *
 * @param {Object} announcementData - Los datos del anuncio a guardar.
 * @param {File} selectedFile - El archivo de imagen seleccionado.
 * @returns {Promise<string>} - El ID del anuncio guardado.
 */
export async function saveAnnouncement(announcementData, selectedFile) {
    try {
        let imageUrl = '';

        if (selectedFile) {
            const filePath = `announcements/${announcementData.type}/${selectedFile.name}`;
            imageUrl = await addAnnoucement(selectedFile, filePath);
        }

        const docRef = await addDoc(collection(firestoreDB, 'announcements'), {
            ...announcementData,
            imageUrl, 
            preregister: {},
            asistence: {},
            createdAt: new Date(),
            visible: true
        });

        return docRef.id;
    } catch (error) {
        console.error('Error al guardar el anuncio:', error);
        throw error;
    }
}

export async function getAnnouncementsEdit() {
    try {
        const announcementsCollection = collection(firestoreDB, 'announcements');
        
        const querySnapshot = await getDocs(query(announcementsCollection));
        
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


export async function getAnnouncements() {
    try {
        const announcementsCollection = collection(firestoreDB, 'announcements');
        const querySnapshot = await getDocs(query(announcementsCollection));
        const now = new Date();
        const announcements = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            .filter(announcement => {
                if (announcement.dateTime) {
                    const dateTime = announcement.dateTime.seconds 
                        ? new Date(announcement.dateTime.seconds * 1000) 
                        : new Date(announcement.dateTime);
                    return dateTime >= now;
                }
                return true; 
            })
            .sort((a, b) => {
                const dateA = a.createdAt.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt);
                const dateB = b.createdAt.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt);
                return dateA - dateB;
            });

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

        const q = query(
            announcementsCollection,
            where('type', '==', 'Asesoría'),
            where('visible', '==', true)
        );

        const querySnapshot = await getDocs(q);

        const now = new Date();
        
        const announcements = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
                dateTime: doc.data().dateTime.toDate(), 
            }))
            .filter(ann => ann.dateTime >= now) 
            .sort((a, b) => a.createdAt - b.createdAt); 

        return announcements;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
}


/**
 * Añade un usuario completo a la lista de preregister en un anuncio específico.
 *
 * @param {string} announcementId - El ID del anuncio al que se agregará el usuario.
 * @param {Object} user - El objeto del usuario que se agregará (debe incluir al menos `uid`).
 * @returns {Promise<void>}
 */

export async function addUserToPreregsiter(announcementId, user) {
    try {
        // Obtener referencia al documento del anuncio
        const announcementRef = doc(firestoreDB, 'announcements', announcementId);

        // Obtener datos del anuncio
        const announcementSnapshot = await getDoc(announcementRef);
        if (!announcementSnapshot.exists()) {
            throw new Error(`El anuncio con ID ${announcementId} no existe.`);
        }

        const announcementData = announcementSnapshot.data();

        // Actualizar `preregister` con el usuario
        const currentPreregs = announcementData.preregister || {};
        if (currentPreregs[user.uid]) {
            throw new Error('Usuario ya registrado');
        }
        const updatedPreregs = {
            ...currentPreregs,
            [user.uid]: user,
        };

        // Actualizar `asistence` con el valor `false` para el usuario
        const currentAsistence = announcementData.asistence || {};
        const updatedAsistence = {
            ...currentAsistence,
            [user.uid]: false,
        };

        // Actualizar el documento en Firestore
        await updateDoc(announcementRef, {
            preregister: updatedPreregs,
            asistence: updatedAsistence,
        });

        console.log(`Usuario ${user.uid} agregado exitosamente a preregister y asistencia.`);
    } catch (error) {
        console.error('Error añadiendo usuario a preregister:', error);
        throw error; 
    }
}



export async function processAsistence(data) {

    const preregister = data.preregister || {};
    const asistence = data.asistence || {};
    const dateTime = data.dateTime || '';

    const preregisterKeys = Object.keys(preregister);
    if (preregisterKeys.length === 0) {
        console.log("No preregister data found.");
        return [];  
    }

    const result = preregisterKeys.map(uid => {
        const user = preregister[uid];
        console.log("Processing user:", user);

        return {
            uid: uid,
            dateTime: dateTime,
            name: user.name || '',
            career: user.career || '',
            area: user.area || '',
            asistence: asistence[uid] || false 
        };
    });

    console.log("Result:", result);
    return result;
}

  