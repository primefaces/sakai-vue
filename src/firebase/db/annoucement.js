import { firestoreDB } from "../../main";
import {
    addDoc,
    collection,
    query,
    getDocs,
    where,
    updateDoc,
    doc, 
    getDoc,
    deleteDoc
} from 'firebase/firestore';
import { addAnnoucement } from "../img/users";
import { 
    updatePoints
} from './users'; 

export async function saveAnnouncement(announcementData, selectedFile) {
    try {
        console.log(announcementData.maesAsignados)
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
        console.log(querySnapshot.docs)
        const announcements = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            .filter(announcement => {
                // Filtrar por fecha válida
                if (announcement.dateTime) {
                    const dateTime = announcement.dateTime.seconds
                        ? new Date(announcement.dateTime.seconds * 1000)
                        : new Date(announcement.dateTime);
                    if (dateTime < now && dateTime.toDateString() !== now.toDateString()) {
                        return false;
                    }
                }

                // Filtrar por visible o tipo Especial
                const isVisible = announcement.visible === true;
                const isSpecial = announcement.id === undefined;
                console.log(announcement.type)
                console.log(announcement.visible)
                return isVisible || isSpecial;
            })
            .sort((a, b) => {
                const dateA = a.createdAt.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt);
                const dateB = b.createdAt.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt);
                return dateA - dateB;
            });
        console.log( announcements)
        return announcements;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
}


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
        console.log(now);

        const announcements = querySnapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data(),
                dateTime: doc.data().dateTime.toDate(), 
            }))
            .filter(ann => {
                return ann.dateTime >= now || ann.dateTime.toDateString() === now.toDateString();
            })
            .sort((a, b) => a.createdAt.seconds - b.createdAt.seconds); // Ordenar por fecha de creación

        console.log(announcements);
        return announcements;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
}


export async function addUserToPreregsiter(announcementId, user) {
    try {
        const announcementRef = doc(firestoreDB, 'announcements', announcementId);
        const announcementSnapshot = await getDoc(announcementRef);
        if (!announcementSnapshot.exists()) {
            throw new Error(`El anuncio con ID ${announcementId} no existe.`);
        }

        const announcementData = announcementSnapshot.data();

        const currentPreregs = announcementData.preregister || {};
        if (currentPreregs[user.uid]) {
            throw new Error('Usuario ya registrado');
        }
        const updatedPreregs = {
            ...currentPreregs,
            [user.uid]: user,
        };

        const currentAsistence = announcementData.asistence || {};
        const updatedAsistence = {
            ...currentAsistence,
            [user.uid]: false,
        };

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


export async function processAsistence(announcementId) {
    const announcementRef = doc(firestoreDB, 'announcements', announcementId);
    const announcementSnapshot = await getDoc(announcementRef);
    const data = announcementSnapshot.data();

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

        return {
            uid: uid,
            dateTime: dateTime,
            name: user.name || '',
            career: user.career || '',
            area: user.area || '',
            campus: user.campus || '',
            asistence: asistence[uid] || false 
        };
    });

    console.log("Result:", result);
    return result;
}


export async function updateUserAsistence(announcementId, userId) {
    try {
        const announcementRef = doc(firestoreDB, 'announcements', announcementId);

        const announcementSnapshot = await getDoc(announcementRef);
        if (!announcementSnapshot.exists()) {
            throw new Error(`El anuncio con ID ${announcementId} no existe.`);
        }

        const announcementData = announcementSnapshot.data();
        const currentAsistence = announcementData.asistence || {};
        const maesAsignados = announcementData.maesAsignados || [];

        const newAsistenceStatus = !currentAsistence[userId];
        const updatedAsistence = {
            ...currentAsistence,
            [userId]: newAsistenceStatus,
        };

        const totalMaes = maesAsignados.length;

        if (totalMaes > 0) {
            const pointsPerMae = 50 / totalMaes;

            
            for (const mae of maesAsignados) {
                if (newAsistenceStatus) {

                    await updatePoints(mae.uid, pointsPerMae);
                    console.log(`Puntos distribuidos a ${mae.name}: +${pointsPerMae}`);
                } else {

                    await updatePoints(mae.uid, -pointsPerMae);
                    console.log(`Puntos distribuidos a ${mae.name}: -${pointsPerMae}`);
                }
            }
        } else {
            console.log('No hay MAEs asignados para asignar puntos.');
        }

        await updateDoc(announcementRef, {
            asistence: updatedAsistence,
        });

        console.log(`Asistencia para el usuario ${userId} actualizada exitosamente a ${newAsistenceStatus}.`);
    } catch (error) {
        console.error('Error actualizando la asistencia del usuario:', error);
        throw error;
    }
}


export async function processConfirms(announcementId) {
    const announcementRef = doc(firestoreDB, 'announcements', announcementId);
    const announcementSnapshot = await getDoc(announcementRef);
    const data = announcementSnapshot.data();

    const preregister = data.preregister || {};  
    const asistence = data.asistence || {}; 
    const dateTime = data.dateTime || '';  

    const preregisterKeys = Object.keys(preregister);  
    if (preregisterKeys.length === 0) {
        console.log("No preregister data found.");
        return [];  
    }

    const result = preregisterKeys
        .filter(uid => asistence[uid] === true)  
        .map(uid => {
            const user = preregister[uid];  
            console.log("Processing user:", user);

            return {
                uid: uid,
                dateTime: dateTime,
                name: user.name || '',
                career: user.career || '',
                area: user.area || '',
                campus: user.campus || '',
                asistence: true 
            };
        });
    return result; 
}


export async function addExtraVariables() {
    try {
        const usersRef = collection(firestoreDB, 'announcements');
        const querySnapshot = await getDocs(usersRef);
        const promises = querySnapshot.docs.map(async (doc) => {
            const userRef = doc.ref; 
                return updateDoc(userRef, {
                    maesAsignados: []
                });
          
        });

        await Promise.all(promises);

        console.log("Background have been successfully added to eligible users.");
    } catch (error) {
        console.error("Error adding background to eligible users: ", error);
        throw error;
    }
}

export async function getAnnouncementsAllGrupales() {
    try {
        const announcementsCollection = collection(firestoreDB, 'announcements');

        const q = query(
            announcementsCollection,
            where('type', '==', 'Asesoría')
        );

        const querySnapshot = await getDocs(q);

        const now = new Date(); 
        const announcements = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dateTime: doc.data().dateTime.toDate(),
        }));

        const futureAnnouncements = announcements
            .filter(announcement => 
                announcement.dateTime > now || 
                announcement.dateTime.toDateString() === now.toDateString()
            ) 
            .sort((a, b) => a.dateTime - b.dateTime); 

        const pastAnnouncements = announcements
            .filter(announcement => 
                announcement.dateTime < now &&
                announcement.dateTime.toDateString() !== now.toDateString()
            )
            .sort((a, b) => a.dateTime - b.dateTime); 

   
        const sortedAnnouncements = [...futureAnnouncements, ...pastAnnouncements];


        return sortedAnnouncements;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
}

export async function deleteAnnouncementById(id) {
    try {
        const announcementDocRef = doc(firestoreDB, "announcements", id);
        
        await deleteDoc(announcementDocRef);
        
        console.log(`Announcement with ID ${id} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting announcement with ID ${id}:`, error);
        throw error;
    }
}

export async function updateAnnouncement(announcementId, updatedData) {
    try {
        const docRef = doc(firestoreDB, 'announcements', announcementId);  

        await updateDoc(docRef, {
            ...updatedData,
        });

        return docRef.id;  
    } catch (error) {
        console.error('Error al actualizar el anuncio:', error);
        throw error;
    }
}

export const toggleVisibilityById = async (id) => {
  try {
    console.log(id)
    const dialogDocRef = doc(firestoreDB,  'announcements', id);

    const docSnap = await getDoc(dialogDocRef);

    if (docSnap.exists()) {
      const currentVisibility = docSnap.data().visible

      await updateDoc(dialogDocRef, {
        visible: !currentVisibility
      });

      console.log(`Visibilidad del diálogo con ID ${id} actualizada correctamente`);
    } else {
      console.log("El documento no existe");
    }
  } catch (error) {
    console.error(`Error al actualizar la visibilidad del diálogo con ID ${id}:`, error);
    throw error;
  }
};
