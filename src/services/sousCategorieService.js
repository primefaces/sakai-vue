import api from "./api";

 
// Example Service
const  sousCategorieService = {
  // GET request
  getSousCategorie() {
    return api.get("/sousCategories");
  },

  // POST request
  postData(path, data) {
    return api.post(path, data);
  },

  // PUT request
  updateData(path, data) {
    return api.put(path, data);
  },

  // DELETE request
  deleteData(path) {
    return api.delete(path);
  },
};

export default sousCategorieService;
