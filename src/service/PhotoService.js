export class PhotoService {
    getImages() {
        return fetch('/demo/data/photos.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
