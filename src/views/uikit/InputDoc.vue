<script setup>
import { ref, onMounted } from 'vue';
import { CountryService } from '@/service/CountryService';
import { NodeService } from '@/service/NodeService';

const floatValue = ref(null);
const autoValue = ref(null);
const selectedAutoValue = ref(null);
const autoFilteredValue = ref([]);
const calendarValue = ref(null);
const inputNumberValue = ref(null);
const chipsValue = ref(null);
const sliderValue = ref(50);
const ratingValue = ref(null);
const colorValue = ref('#1976D2');
const radioValue = ref(null);
const checkboxValue = ref([]);
const switchValue = ref(false);
const listboxValues = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const listboxValue = ref(null);
const dropdownValues = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const dropdownValue = ref(null);
const multiselectValues = ref([
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
]);

const multiselectValue = ref(null);
const toggleValue = ref(false);
const selectButtonValue1 = ref(null);
const selectButtonValues1 = ref([{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }]);
const selectButtonValue2 = ref(null);
const selectButtonValues2 = ref([{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }]);
const knobValue = ref(50);
const inputGroupValue = ref(false);
const treeSelectNodes = ref(null);
const selectedNode = ref(null);
const countryService = new CountryService();
const nodeService = new NodeService();

onMounted(() => {
    countryService.getCountries().then((data) => (autoValue.value = data));
    nodeService.getTreeNodes().then((data) => (treeSelectNodes.value = data));
});

const searchCountry = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            autoFilteredValue.value = [...autoValue.value];
        } else {
            autoFilteredValue.value = autoValue.value.filter((country) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
};
</script>

<template>
    <div class="flex flex-col md:flex-row gap-6">
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <h5>InputText</h5>
                <div class="flex flex-col md:flex-row gap-4">
                    <InputText type="text" placeholder="Default" fluid />
                    <InputText type="text" placeholder="Disabled" :disabled="true" fluid />
                    <InputText type="text" placeholder="Invalid" invalid fluid />
                </div>

                <h5 class="mt-6">Icons</h5>
                <IconField>
                    <InputIcon class="pi pi-user" />
                    <InputText type="text" placeholder="Username" fluid />
                </IconField>
                <IconField iconPosition="left">
                    <InputText type="text" placeholder="Search" fluid />
                    <InputIcon class="pi pi-search" />
                </IconField>

                <h5 class="mt-6">Float Label</h5>
                <FloatLabel>
                    <InputText id="username" type="text" v-model="floatValue" fluid />
                    <label for="username">Username</label>
                </FloatLabel>

                <h5 class="mt-6">Textarea</h5>
                <Textarea placeholder="Your Message" :autoResize="true" rows="3" cols="30" fluid />

                <h5 class="mt-6">AutoComplete</h5>
                <AutoComplete placeholder="Search" id="dd" :dropdown="true" :multiple="true" v-model="selectedAutoValue" :suggestions="autoFilteredValue" @complete="searchCountry($event)" field="name" fluid />

                <h5 class="mt-6">DatePicker</h5>
                <DatePicker :showIcon="true" :showButtonBar="true" v-model="calendarValue" fluid></DatePicker>

                <h5 class="mt-6">Spinner</h5>
                <InputNumber v-model="inputNumberValue" showButtons mode="decimal" fluid></InputNumber>

                <h5 class="mt-6">Chips</h5>
                <AutoComplete v-model="chipsValue" :typeahead="false" multiple fluid />
            </div>

            <div class="card flex flex-col gap-4">
                <h5>Slider</h5>
                <InputText v-model.number="sliderValue" fluid />
                <Slider v-model="sliderValue" />

                <div class="flex flex-row mt-6">
                    <div class="flex flex-col gap-4 w-1/2">
                        <h5>Rating</h5>
                        <Rating v-model="ratingValue" />
                    </div>
                    <div class="flex flex-col gap-4 w-1/2">
                        <h5>ColorPicker</h5>
                        <ColorPicker style="width: 2rem" v-model="colorValue" />
                    </div>
                </div>

                <h5 class="mt-6">Knob</h5>
                <Knob v-model="knobValue" :step="10" :min="-50" :max="50" valueTemplate="{value}%" />
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <h5>RadioButton</h5>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex items-center">
                        <RadioButton id="option1" name="option" value="Chicago" v-model="radioValue" />
                        <label for="option1" class="leading-none ml-2">Chicago</label>
                    </div>
                    <div class="flex items-center">
                        <RadioButton id="option2" name="option" value="Los Angeles" v-model="radioValue" />
                        <label for="option2" class="leading-none ml-2">Los Angeles</label>
                    </div>
                    <div class="flex items-center">
                        <RadioButton id="option3" name="option" value="New York" v-model="radioValue" />
                        <label for="option3" class="leading-none ml-2">New York</label>
                    </div>
                </div>

                <h5 class="mt-6">Checkbox</h5>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex items-center">
                        <Checkbox id="checkOption1" name="option" value="Chicago" v-model="checkboxValue" />
                        <label for="checkOption1" class="ml-2">Chicago</label>
                    </div>
                    <div class="flex items-center">
                        <Checkbox id="checkOption2" name="option" value="Los Angeles" v-model="checkboxValue" />
                        <label for="checkOption2" class="ml-2">Los Angeles</label>
                    </div>
                    <div class="flex items-center">
                        <Checkbox id="checkOption3" name="option" value="New York" v-model="checkboxValue" />
                        <label for="checkOption3" class="ml-2">New York</label>
                    </div>
                </div>

                <h5 class="mt-6">Input Switch</h5>
                <ToggleSwitch v-model="switchValue" />
            </div>

            <div class="card flex flex-col gap-4">
                <h5>Listbox</h5>
                <Listbox v-model="listboxValue" :options="listboxValues" optionLabel="name" :filter="true" />

                <h5 class="mt-6">Select</h5>
                <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Select" fluid />

                <h5 class="mt-6">MultiSelect</h5>
                <MultiSelect v-model="multiselectValue" :options="multiselectValues" optionLabel="name" placeholder="Select Countries" :filter="true" fluid>
                    <template #value="slotProps">
                        <div class="inline-flex items-center py-1 px-2 bg-primary text-primary-contrast rounded-border mr-2" v-for="option of slotProps.value" :key="option.code">
                            <span :class="'mr-2 flag flag-' + option.code.toLowerCase()" style="width: 18px; height: 12px" />
                            <div>{{ option.name }}</div>
                        </div>
                        <template v-if="!slotProps.value || slotProps.value.length === 0">
                            <div class="p-1">Select Countries</div>
                        </template>
                    </template>
                    <template #option="slotProps">
                        <div class="flex items-center">
                            <span :class="'mr-2 flag flag-' + slotProps.option.code.toLowerCase()" style="width: 18px; height: 12px" />
                            <div>{{ slotProps.option.name }}</div>
                        </div>
                    </template>
                </MultiSelect>

                <h5 class="mt-6">TreeSelect</h5>
                <TreeSelect v-model="selectedNode" :options="treeSelectNodes" placeholder="Select Item" fluid></TreeSelect>
            </div>

            <div class="card flex flex-col gap-4">
                <h5>ToggleButton</h5>
                <ToggleButton v-model="toggleValue" onLabel="Yes" offLabel="No" :style="{ width: '10em' }" />

                <h5 class="mt-6">SelectButton</h5>
                <SelectButton v-model="selectButtonValue1" :options="selectButtonValues1" optionLabel="name" />

                <h5 class="mt-6">SelectButton - Multiple</h5>
                <SelectButton v-model="selectButtonValue2" :options="selectButtonValues2" optionLabel="name" :multiple="true" />
            </div>
        </div>
    </div>

    <div class="flex mt-6">
        <div class="card flex flex-col gap-4 w-full">
            <h5>Input Groups</h5>
            <div class="flex flex-col md:flex-row gap-4">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-user"></i>
                    </InputGroupAddon>
                    <InputText placeholder="Username" fluid />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-clock"></i>
                    </InputGroupAddon>
                    <InputGroupAddon>
                        <i class="pi pi-star-fill"></i>
                    </InputGroupAddon>
                    <InputNumber placeholder="Price" fluid />
                    <InputGroupAddon>$</InputGroupAddon>
                    <InputGroupAddon>.00</InputGroupAddon>
                </InputGroup>
            </div>
            <div class="flex flex-col md:flex-row gap-4">
                <InputGroup>
                    <Button label="Search" />
                    <InputText placeholder="Keyword" fluid />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>
                        <Checkbox v-model="inputGroupValue" :binary="true" />
                    </InputGroupAddon>
                    <InputText placeholder="Confirm" fluid />
                </InputGroup>
            </div>
        </div>
    </div>
</template>
