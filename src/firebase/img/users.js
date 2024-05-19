import { ref, getDownloadURL } from "firebase/storage";
import { firebaseStorage } from "../../main";

export const getUserProfilePicture = async (email) => {
    try {
        return await getDownloadURL(ref(firebaseStorage, `users/${email}/photo`));
    } catch {
        return 'https://randomuser.me/api/portraits/lego/5.jpg';
    }
}