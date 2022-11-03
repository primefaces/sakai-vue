export default class CountryService {

    getCountries() {
        return fetch('data/countries.json').then(res => res.json()).then(d => d.data);
    }
}
