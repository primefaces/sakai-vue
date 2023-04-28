<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable prettier/prettier -->
<script setup>
import { ref, onMounted } from 'vue';
// import CountryService from '@/service/CountryService';

const countries = ref([]);
const cities = ref([
    { name: '1', code: '1' },
    { name: '5', code: '5' },
    { name: '11', code: '11' },
    { name: '12', code: '12' },
    { name: '21', code: '21' }
]);
const repartidores = ref([
    { name: 'Jose Juan', code: '1' },
    { name: 'Pepe', code: '2' },
    { name: 'Alberto', code: '3' },
    { name: 'Ramiro', code: '4' },
    { name: 'Corne', code: '5' }
]);
// const dropdownItems = ref([
//     { name: 'Option 1', code: 'Option 1' },
//     { name: 'Option 2', code: 'Option 2' },
//     { name: 'Option 3', code: 'Option 3' }
// ]);
const filteredCountries = ref(null);
const filteredCountries2 = ref(null);
// const value1 = ref(null);
const value2 = ref(null);
const value3 = ref(null);
const value4 = ref(0);
const value5 = ref(0);
const value6 = ref(0);
const value7 = ref(0);
const value8 = ref(null);
const value9 = ref(null);
const value10 = ref(0);
const value11 = ref(0);
// const value10 = ref(null);
// const dropdownItem = ref(null);

// const countryService = new CountryService();

onMounted(() => {
    // countryService.getCountries().then((data) => (countries.value = data));
    let productsList = [
        {
            "code": "37",
            "name": "LECHE PAST. ENTERA",
            "description": "LECHE PAST. ENTERA GALON",
            "content": 1,
            "content-um": "galon",
            "price": 60,
            "price-sale": 77,
            "category": "Leches",
            "box-quantity": 4,
            "quantity": 10000,
            "inventoryStatus": "INSTOCK",
            "rating": 5,
        },
        {
            "code": "6",
            "name": "LECHE PAST. ENTERA",
            "content": 1,
            "content-um": "Litro",
            "description": "LECHE PAST. ENTERA 1LT.",
            "price": 60,
            "price-sale": 77,
            "category": "Leches",
            "box-quantity": 4,
            "quantity": 10000,
            "inventoryStatus": "INSTOCK",
            "rating": 5,
        },
        {
            "code": "80",
            "name": "LECHE PAST. ENTERA",
            "description": "LECHE PAST. ENTERA 1/2GALON",
            "content": 0.5,
            "content-um": "galon",
            "price": 60,
            "price-sale": 77,
            "category": "Leches",
            "box-quantity": 4,
            "quantity": 10000,
            "inventoryStatus": "INSTOCK",
            "rating": 5,
        },
        {
            "code": "83",
            "name": "LECHE PAST. LIGTH",
            "description": "LECHE PAST. LIGTH 1/2GALON",
            "content": 0.5,
            "content-um": "galon",
            "price": 60,
            "price-sale": 77,
            "category": "Leches",
            "box-quantity": 4,
            "quantity": 10000,
            "inventoryStatus": "INSTOCK",
            "rating": 5,
        },

    ]
    countries.value = productsList;
    filteredCountries.value = productsList.slice(0, 2)
    filteredCountries2.value = productsList.slice(0, 2)
});

const changeRuta = (event) => {
    console.log(event.value.code);
    value9.value = { name: 'Pepe', code: '2' }
}
const updateValue = (event, code) => {
    console.log('updateValue', event);
    if (!event) {
        if (code) {
            value3.value = null;
        } else {
            value2.value = null;
        }

    }
    else if (typeof event !== 'string') {
        // console.log('\t',typeof event);
        if (code) {
            value3.value = value2.value;
        } else {
            value2.value = value3.value;
        }
    }
}
// const changecode = (event) => {
//     console.log('changecode',event);
//     if (event.value?.code) {
//         console.log(event.value.code, '-', value2.value);
//         value3.value = value2.value
//     }
// }
// const changeDescription = (event) => {
//     if (event.value.code) {
//         console.log(event.value.code, '-', value3.value);
//         value2.value = value3.value
//     }
//     // value9.value = { name: 'Pepe', code: '2' }
// }

const searchCountry = (event) => {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered = [];
    const query = event.query;
    for (let i = 0; i < countries.value.length; i++) {
        const country = countries.value[i];
        if (country.code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }
    filteredCountries.value = filtered;
};
const searchCountry2 = (event) => {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered = [];
    const query = event.query;
    for (let i = 0; i < countries.value.length; i++) {
        const country = countries.value[i];
        if (country.description.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }
    filteredCountries2.value = filtered;
};
</script>

<template>
    <div class="card">
        <h5>Captura de venta</h5>
        <div class="grid p-fluid mt-3">
            <div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <Dropdown @change="changeRuta" id="ruta" :options="cities" v-model="value8" optionLabel="name"> </Dropdown>
                    <label for="ruta">Ruta</label>
                </span>
            </div>
            <div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <Dropdown id="repartidor" :options="repartidores" v-model="value9" optionLabel="name"></Dropdown>
                    <label for="repartidor">Repartidor</label>
                </span>
            </div>

            <!-- <div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <InputText type="text" id="inputtext" v-model="value1" />
                    <label for="inputtext">InputText</label>
                </span>
            </div>
            <div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <AutoComplete id="autocomplete" v-model="value2" :suggestions="filteredCountries" @complete="searchCountry($event)" field="name"></AutoComplete>
                    <label for="autocomplete">AutoComplete</label>
                </span>
            </div>
            <div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <Calendar inputId="calendar" v-model="value3"></Calendar>
                    <label for="calendar">Calendar</label>
                </span>
            </div>
            <div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <Chips inputId="chips" v-model="value4"></Chips>
                    <label for="chips">Chips</label>
                </span>
            </div>
            <div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <InputMask id="inputmask" mask="99/99/9999" v-model="value5"></InputMask>
                    <label for="inputmask">InputMask</label>
                </span>
            </div>
            <div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <InputNumber id="inputnumber" v-model="value6"></InputNumber>
                    <label for="inputnumber">InputNumber</label>
                </span>
            </div>
            <div class="field col-12 md:col-4">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <i class="pi pi-user"></i>
                    </span>
                    <span class="p-float-label">
                        <InputText type="text" id="inputgroup" v-model="value7" />
                        <label for="inputgroup">InputGroup</label>
                    </span>
                </div>
            </div> -->

            <!-- <div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <MultiSelect id="multiselect" :options="cities" v-model="value9" optionLabel="name" :filter="false"> </MultiSelect>
                    <label for="multiselect">MultiSelect</label>
                </span>
            </div>
            <div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <Textarea inputId="textarea" rows="3" cols="30" v-model="value10"></Textarea>
                    <label for="textarea">Textarea</label>
                </span>
            </div> -->
        </div>
        <!-- </div>
    <div class="card"> -->
        <h5>Captura de productos</h5>
        <span>Version preeliminar</span>
        <div class="p-fluid formgrid grid">
            <!-- <div class="row w-100"> -->
            <!-- </div> -->
            <!-- <div class="row"> -->
            <div class="field col-12 md:col-1 p-0">
                <span class="p-float-label mt-4">
                    <AutoComplete
                        v-model="value2"
                        class="no-margin"
                        id="code"
                        forceSelection
                        :completeOnFocus="true"
                        optionLabel="code"
                        :dropdown="true"
                        :clearable="true"
                        :suggestions="filteredCountries"
                        @update:modelValue="updateValue($event, true)"
                        @complete="searchCountry($event)"
                    >
                        <template #option="slotProps">
                            <div class="flex align-options-center justify-content-between item-autocomplete-opt">
                                <div class="text-code">{{ slotProps.option.code }}</div>
                                <div class="text-descpription">{{ slotProps.option.description }}</div>
                            </div>
                        </template>
                    </AutoComplete>
                    <label for="code">Codigo</label>
                </span>
            </div>
            <div class="field col-12 md:col-2 p-0">
                <span class="p-float-label mt-4">
                    <AutoComplete
                        class="no-margin"
                        id="product"
                        forceSelection
                        :completeOnFocus="true"
                        optionLabel="description"
                        :dropdown="true"
                        :clearable="true"
                        v-model="value3"
                        :suggestions="filteredCountries2"
                        @update:modelValue="updateValue($event, false)"
                        @complete="searchCountry2($event)"
                        field="description"
                    ></AutoComplete>
                    <label for="product">Producto</label>
                </span>
            </div>
            <div class="field col-12 md:col-1 p-0">
                <span class="p-float-label mt-4">
                    <InputNumber id="cajas-s" :min="0"  v-model="value4" />
                    <label for="cajas-s">Cajas salida</label>
                </span>
            </div>
            <div class="field col-12 md:col-1 p-0">
                <span class="p-float-label mt-4">
                    <InputNumber id="piesas-s" :min="0"  v-model="value5" />
                    <label for="piesas-s">Piesas salida</label>
                </span>
            </div>
            <div class="field col-12 md:col-1 p-0">
                <span class="p-float-label mt-4">
                    <InputNumber id="salida" :min="0"  v-model="value6" />
                    <label for="salida">salida total</label>
                </span>
            </div>
            <div class="field col-12 md:col-1 p-0">
                <label for="city">PiesasS</label>
                <InputNumber class="no-margin" id="piesasS" v-model="value5" type="number" />
            </div>
            <div class="field col-12 md:col-1 p-0">
                <label for="city">Salida Pzs</label>
                <InputNumber readonly disabled class="no-margin" id="piesasS" v-model="value6" type="number" />
            </div>
            <div class="field col-12 md:col-1 p-0">
                <label for="lastname2">CajasR</label>
                <InputNumber class="no-margin" id="CajasS" v-model="value7" type="number" />
            </div>
            <div class="field col-12 md:col-1 p-0">
                <label for="city">PiesasR</label>
                <InputNumber class="no-margin" id="piesasS" v-model="value10" type="number" />
            </div>
            <div class="field col-12 md:col-1 p-0">
                <label for="city">Regreso Pzs</label>
                <InputNumber readonly disabled class="no-margin" id="piesasS" v-model="value11" type="number" />
            </div>

            <!-- </div> -->
        </div>
    </div>
</template>

<style>
.w-100 {
    width: 100%;
}

.item-autocomplete-opt {
    width: 250px;
}

.text-code {
    font-weight: 600;
}

.text-descpription {
    font-size: small;
    opacity: 0.5;
}
</style>
