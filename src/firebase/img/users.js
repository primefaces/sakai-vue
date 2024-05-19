import { ref, getDownloadURL } from "firebase/storage";
import { firebaseStorage } from "../../main";

export const getUserProfilePicture = async (email) => {
    try {
        const url = await getDownloadURL(ref(firebaseStorage, `users/${email}/photo`));
        return url;
    } catch (error) {
        console.error(email, 'Has no profile picture')
        return 'https://randomuser.me/api/portraits/lego/5.jpg';
    }
}