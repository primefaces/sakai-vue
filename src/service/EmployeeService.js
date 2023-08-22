export default class EmployeeService {
    getImages() {
        return fetch('../data/photos.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getImage(employee_id) {
        return this.getImages()
            .then((images) => images.find(image => image.employee_id === employee_id));
    }
}