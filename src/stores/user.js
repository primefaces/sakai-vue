import axios from 'axios';
import { defineStore } from 'pinia';
// import { inject } from 'vue';

// Si kiere tu usa kunel API na component, man inject lang.
// const api = inject('api'); // try daw si tan work pa syempre todo

const api = axios.create({
    baseURL: 'http://192.168.0.3:3000',
});

export const useUserStore = defineStore('user', {
    state: () => ({
        // user: null,
        _id: null,
        email: null,
        password: null,
        firstName: null,
        lastName: null,
        role: null,
        accessToken: null,
    }),

    actions: {
        async fetchUser() {
            const res = await fetch('https://localhost:3000/user');

            const user = await res.json();
            this.user = user;
        },

        async signUp(email, password, firstName, lastName, role) {
            try {
                const res = await axios.post('http://localhost:3000/api/auth/register', {
                    email,
                    password,
                    firstName,
                    lastName,
                    role,
                });

                this.user = res;
            } catch (error) {
                if (!error.response) {
                    // Problem na code
                    console.log('Check code!!!');
                } else {
                    // Problem estaba na API
                    const { data } = error.response;
                    console.log('JSON_RESPONSE_ERROR:', data);
                }
            }
        },

        /**
         * Sign in a user
         * @param {String} email User email
         * @param {String} password User password
         * @returns Boolean - whether login passed or not
         */
        async signIn(email, password) {
            try {
                const res = await axios.post('http://192.168.0.3:3000/api/auth/login', {
                    email: email,
                    password: password,
                });

                console.log(res.data);

                if (!res.data.success) {
                    return false; // login failed
                }

                // Store accessToken from API to userState
                this.accessToken = res.data.accessToken;

                // Set access token in every HTTP request
                api.defaults.headers.common.Authorization = 'Bearer ' + this.accessToken; // Na next call detuyu tiene ya access token na headers
                // api.defaults.headers.common['Authorization'] = this.accessToken;

                this.email = res.data.email;
                // console.log(this.email);
                return true;
            } catch (error) {
                console.log('ERROR:', error);
                if (!error.response) {
                    return false;
                }

                const { data } = error.response;
                alert(data.message); // error on api API
            }
        },
        // async getdata(){
        //   const response = axios.post('https://reqres.in/api/login', {
        //         email: 'eve.holt@reqres.in', password: 'cityslicka'
        //     })
        //     .then(response => {
        //         console.log(response)
        //     })
        // }
    },
});
