<script setup>
import { ref, onMounted } from 'vue';
import { CountryService } from '@/service/CountryService';

const countries = ref(null);
const filteredCountries = ref(null);
const value1 = ref(null);
const value2 = ref(null);
const value3 = ref(null);
const value4 = ref(null);
const value5 = ref(null);
const value6 = ref(null);
const value7 = ref(null);
const value8 = ref(null);
const value9 = ref(null);
const value10 = ref(null);
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const countryService = new CountryService();

onMounted(() => {
    countryService.getCountries().then((data) => {
        countries.value = data;
    });
});

const searchCountry = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            filteredCountries.value = [...countries];
        } else {
            filteredCountries.value = countries.value.filter((country) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
};
</script>

<template>
    <div class="card">
        <h5>Invalid State</h5>
        <div class="flex flex-col md:flex-row gap-6">
            <div class="md:w-1/2">
                <div class="flex flex-col gap-2">
                    <label for="inputtext">InputText</label>
                    <InputText id="inputtext" type="text" v-model="value1" invalid fluid />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="autocomplete">AutoComplete</label>
                    <AutoComplete id="autocomplete" v-model="value2" :suggestions="filteredCountries" @complete="searchCountry($event)" field="name" invalid inputClass="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="calendar">DatePicker</label>
                    <DatePicker id="calendar" v-model="value3" invalid :showIcon="true" fluid />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="chips">Chips</label>
                    <AutoComplete id="chips" v-model="value4" invalid fluid multiple :typeahead="false" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="password">Password</label>
                    <Password id="password" v-model="value10" invalid fluid />
                </div>
            </div>
            <div class="md:w-1/2">
                <div class="flex flex-col gap-2">
                    <label for="inputmask">InputMask</label>
                    <InputMask id="inputmask" v-model="value5" mask="99/99/9999" slotChar="mm/dd/yyyy" invalid fluid />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="inputnumber">InputNumber</label>
                    <InputNumber id="inputnumber" v-model="value6" invalid fluid />
                </div>
                <div class="flex flex-col gap-2"></div>
                <label for="dropdown">Select</label>
                <Select id="dropdown" v-model="value7" :options="cities" optionLabel="name" invalid fluid />
                <div class="flex flex-col gap-2">
                    <label for="multiselect">MultiSelect</label>
                    <MultiSelect id="multiselect" v-model="value8" :options="cities" optionLabel="name" invalid fluid />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="textarea">Textarea</label>
                    <Textarea id="textarea" v-model="value9" rows="3" invalid fluid />
                </div>
            </div>
        </div>
    </div>
</template>
