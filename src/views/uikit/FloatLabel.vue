<script setup>
import { ref, onMounted } from 'vue';
import { CountryService } from '@/service/CountryService';

const countries = ref([]);
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
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
const countryService = new CountryService();

onMounted(() => {
    countryService.getCountries().then((data) => (countries.value = data));
});

const searchCountry = (event) => {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered = [];
    const query = event.query;
    for (let i = 0; i < countries.value.length; i++) {
        const country = countries.value[i];
        if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }
    filteredCountries.value = filtered;
};
</script>

<template>
    <div class="card">
        <h5>Float Label</h5>
        <div class="grid p-fluid mt-3">
            <div class="field col-12 md:col-4">
                <FloatLabel>
                    <InputText type="text" id="inputtext" v-model="value1" />
                    <label for="inputtext">InputText</label>
                </FloatLabel>
            </div>
            <div class="field col-12 md:col-4">
                <FloatLabel>
                    <AutoComplete id="autocomplete" v-model="value2" :suggestions="filteredCountries" @complete="searchCountry($event)" field="name"></AutoComplete>
                    <label for="autocomplete">AutoComplete</label>
                </FloatLabel>
            </div>
            <div class="field col-12 md:col-4">
                <FloatLabel>
                    <Calendar inputId="calendar" v-model="value3"></Calendar>
                    <label for="calendar">Calendar</label>
                </FloatLabel>
            </div>
            <div class="field col-12 md:col-4">
                <FloatLabel>
                    <Chips inputId="chips" v-model="value4"></Chips>
                    <label for="chips">Chips</label>
                </FloatLabel>
            </div>
            <div class="field col-12 md:col-4">
                <FloatLabel>
                    <InputMask id="inputmask" mask="99/99/9999" v-model="value5"></InputMask>
                    <label for="inputmask">InputMask</label>
                </FloatLabel>
            </div>
            <div class="field col-12 md:col-4">
                <FloatLabel>
                    <InputNumber id="inputnumber" v-model="value6"></InputNumber>
                    <label for="inputnumber">InputNumber</label>
                </FloatLabel>
            </div>
            <div class="field col-12 md:col-4">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-user"></i>
                    </InputGroupAddon>
                    <FloatLabel>
                        <InputText type="text" id="inputgroup" v-model="value7" />
                        <label for="inputgroup">InputGroup</label>
                    </FloatLabel>
                </InputGroup>
            </div>
            <div class="field col-12 md:col-4">
                <FloatLabel>
                    <Dropdown id="dropdown" :options="cities" v-model="value8" optionLabel="name"></Dropdown>
                    <label for="dropdown">Dropdown</label>
                </FloatLabel>
            </div>
            <div class="field col-12 md:col-4">
                <FloatLabel>
                    <MultiSelect id="multiselect" :options="cities" v-model="value9" optionLabel="name" :filter="false"></MultiSelect>
                    <label for="multiselect">MultiSelect</label>
                </FloatLabel>
            </div>
            <div class="field col-12 md:col-4">
                <FloatLabel>
                    <Textarea inputId="textarea" rows="3" cols="30" v-model="value10"></Textarea>
                    <label for="textarea">Textarea</label>
                </FloatLabel>
            </div>
        </div>
    </div>
</template>
