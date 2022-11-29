const contextPath = import.meta.env.BASE_URL;
export default class CountryService {
    getCountries() {
        return fetch(contextPath + 'demo/data/countries.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
