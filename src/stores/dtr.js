import axios from 'axios';
import { defineStore } from 'pinia';

// const apiUrl = 'http://localhost:3001';
// const apiUrl = 'http://192.168.0.6:3000';
const apiUrl = 'http://172.16.110.78:3000';
// const api = axios.create({
//     baseURL: 'http://192.168.0.3:3000',
// });

export const useDtrStore = defineStore('dtr', {
    state: () => ({
        user_id: null,
        fullname: null,
        emp_number: null,
        date: null,
        inAM: null,
        outAM: null,
        inPM: null,
        outPM: null,
        ip: null,
        message: null,
        earlybirds: null,
        nightowls: null,
        employees: null,
    }),

    // getters: {
    //     earlyBirds: (state) => {
    //         // if(state.count % 2 === 0) return 'even'
    //         // return 'odd'
    //         try {
    //             const { data: EarlyBirds } = await axios.get(apiUrl + '/api/hrmis/dtrs');

    //             if (!EarlyBirds.success) {
    //                 return false; // action failed
    //             }

    //             const { data } = EarlyBirds;

    //             this.earlyBirds = data;
    //         } catch (error) {
    //             console.log('ERROR:', error);
    //             if (!error.response) {
    //                 return [];
    //             }

    //             const { data } = error.response;
    //             this.message = data.message; // error on api API
    //         }
    //     }
    // },

    actions: {
        /**
         * Get Early Birds
         * @returns Object of employees
         */
        async earlyBirds() {
            try {
                const { data: earlyBirds } = await axios.get(apiUrl + '/api/hrmis/earlybirds');

                if (!earlyBirds.success) {
                    return false; // action failed
                }

                const { data } = earlyBirds;

                this.earlybirds = data;
            } catch (error) {
                console.log('ERROR:', error);
                if (!error.response) {
                    return [];
                }
            }
        },

        /**
         * Get Night Owls
         * @returns Object of employees
         */
        async nightOwls() {
            try {
                const { data: nightOwls } = await axios.get(apiUrl + '/api/hrmis/nightowls');

                if (!nightOwls.success) {
                    return false; // action failed
                }

                const { data } = nightOwls;

                this.nightowls = data;
            } catch (error) {
                console.log('ERROR:', error);
                if (!error.response) {
                    return [];
                }
            }
        },

        /**
         * Employee Time In - AM
         * @param {String} emp_number Employee Number
         * @returns Boolean - whether success or not
         */
        async TimeInAM(emp_number) {
            try {
                const { data: inAM } = await axios.post(apiUrl + '/api/hrmis/inAM', {
                    employee_num: emp_number,
                });

                if (!inAM.success) {
                    return false; // action failed
                }

                const { data } = inAM;

                this.fullname = data.remarks;
                this.date = data.date;
                this.inAM = data.inAM;
                this.ip = data.ip;

                return true;
            } catch (error) {
                console.log('ERROR:', error);
                if (!error.response) {
                    return false;
                }

                const { data } = error.response;
                this.message = data.message; // error on api API
            }
        },

        /**
         * Employee Time Out - AM
         * @param {String} emp_number Employee Number
         * @returns Boolean - whether success or not
         */
        async TimeOutAM(emp_number) {
            try {
                const { data: outAM } = await axios.post(apiUrl + '/api/hrmis/outAM', {
                    employee_num: emp_number,
                });

                if (!outAM.success) {
                    return false; // action failed
                }

                const { data } = outAM;

                this.fullname = data.remarks;
                this.date = data.date;
                this.inAM = data.inAM;
                this.outAM = data.outAM;

                return true;
            } catch (error) {
                console.log('ERROR:', error);
                if (!error.response) {
                    return false;
                }

                const { data } = error.response;
                this.message = data.message; // error on api API
            }
        },

        /**
         * Employee Time In - PM
         * @param {String} emp_number Employee Number
         * @returns Boolean - whether success or not
         */
        async TimeInPM(emp_number) {
            try {
                const { data: inPM } = await axios.post(apiUrl + '/api/hrmis/inPM', {
                    employee_num: emp_number,
                });

                if (!inPM.success) {
                    return false; // action failed
                }

                const { data } = inPM;

                this.fullname = data.remarks;
                this.date = data.date;
                this.inAM = data.inAM;
                this.outAM = data.outAM;
                this.inPM = data.inPM;
                this.ip = data.ip;

                return true;
            } catch (error) {
                console.log('ERROR:', error);
                if (!error.response) {
                    return false;
                }

                const { data } = error.response;
                this.message = data.message; // error on api API
            }
        },

        /**
         * Employee Time Out - PM
         * @param {String} emp_number Employee Number
         * @returns Boolean - whether success or not
         */
        async TimeOutPM(emp_number) {
            try {
                const { data: outPM } = await axios.post(apiUrl + '/api/hrmis/outPM', {
                    employee_num: emp_number,
                });

                if (!outPM.success) {
                    return false; // action failed
                }

                const { data } = outPM;

                this.fullname = data.remarks;
                this.date = data.date;
                this.inAM = data.inAM;
                this.outAM = data.outAM;
                this.inPM = data.inPM;
                this.outPM = data.outPM;
                this.ip = data.ip;

                return true;
            } catch (error) {
                console.log('ERROR:', error);
                if (!error.response) {
                    return false;
                }

                const { data } = error.response;
                this.message = data.message; // error on api API
            }
        },
    },
});
