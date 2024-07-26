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
        <div class="flex flex-col md:flex-row gap-6">
            <FloatLabel class="md:w-1/3">
                <InputText type="text" id="inputtext" v-model="value1" fluid />
                <label for="inputtext">InputText</label>
            </FloatLabel>
            <FloatLabel class="md:w-1/3">
                <AutoComplete id="autocomplete" v-model="value2" :suggestions="filteredCountries" @complete="searchCountry($event)" field="name" fluid inputClass="w-full" />
                <label for="autocomplete">AutoComplete</label>
            </FloatLabel>
            <FloatLabel class="md:w-1/3">
                <DatePicker inputId="calendar" v-model="value3" fluid />
                <label for="calendar">DatePicker</label>
            </FloatLabel>
        </div>

        <div class="flex flex-col md:flex-row gap-6 mt-6">
            <FloatLabel class="md:w-1/3">
                <AutoComplete inputId="chips" v-model="value4" multiple :typeahead="false" fluid />
                <label for="chips">Chips</label>
            </FloatLabel>
            <FloatLabel class="md:w-1/3">
                <InputMask id="inputmask" mask="99/99/9999" v-model="value5" fluid />
                <label for="inputmask">InputMask</label>
            </FloatLabel>
            <FloatLabel class="md:w-1/3">
                <InputNumber id="inputnumber" v-model="value6" fluid />
                <label for="inputnumber">InputNumber</label>
            </FloatLabel>
        </div>

        <div class="flex flex-col md:flex-row gap-6 mt-6">
            <InputGroup class="md:!w-1/3">
                <InputGroupAddon>
                    <i class="pi pi-user"></i>
                </InputGroupAddon>
                <FloatLabel>
                    <InputText type="text" id="inputgroup" v-model="value7" fluid />
                    <label for="inputgroup">InputGroup</label>
                </FloatLabel>
            </InputGroup>
            <FloatLabel class="md:w-1/3">
                <Select id="dropdown" :options="cities" v-model="value8" optionLabel="name" class="w-full" />
                <label for="dropdown">Select</label>
            </FloatLabel>
            <FloatLabel class="md:w-1/3">
                <MultiSelect id="multiselect" :options="cities" v-model="value9" optionLabel="name" :filter="false" fluid />
                <label for="multiselect">MultiSelect</label>
            </FloatLabel>
        </div>

        <div class="flex flex-col md:flex-row gap-6 mt-6">
            <FloatLabel class="md:w-1/3">
                <Textarea inputId="textarea" rows="3" cols="30" v-model="value10" fluid />
                <label for="textarea">Textarea</label>
            </FloatLabel>
        </div>
    </div>
</template>
