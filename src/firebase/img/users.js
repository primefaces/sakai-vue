import { ref, getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import { firebaseStorage} from "../../main";
import { v4 } from "uuid";
import { initializeApp } from "firebase/app";
export const getUserProfilePicture = async (email) => {
    try {
        const url = await getDownloadURL(ref(firebaseStorage, `users/${email}/photo`));
        return url;
    } catch (error) {
        console.error(email, 'Has no profile picture')
        return 'https://randomuser.me/api/portraits/lego/5.jpg';
    }
}

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const firebaseAppImage = initializeApp(firebaseConfig);

export const storage = getStorage(firebaseAppImage)

/**
 * Subir un archivo a Firebase Storage y obtener su URL de descarga.
 *
 * @param {File} file - El archivo a subir.
 * @param {string} email - El email del usuario que determina la ruta de almacenamiento.
 * @returns {Promise<string>} La URL de descarga del archivo subido.
 */
export async function uploadFile(file, email) {
    try {
        // Crear una referencia al archivo en la ruta específica
        const storageRef = ref(storage, `users/${email}/photo`);

        // Subir el archivo
        await uploadBytes(storageRef, file);

        // Obtener la URL de descarga
        const url = await getDownloadURL(storageRef);

        return url;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}