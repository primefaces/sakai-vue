import '@/assets/styles.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';
import Column from 'primevue/column';
import MultiSelect from 'primevue/multiselect';
import Rating from 'primevue/rating';
import ToggleButton from 'primevue/togglebutton';
import DataTable from 'primevue/datatable';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import Slider from 'primevue/slider';
import InputNumber from 'primevue/inputnumber';
import ProgressBar from 'primevue/progressbar';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, { ripple: true });
app.component('InputText', InputText);
app.component('Textarea', Textarea);
app.component('Dropdown', Dropdown);
app.component('Calendar', Calendar);
app.component('Button', Button);
app.component('SplitButton', SplitButton);
app.component('Column', Column);
app.component('MultiSelect', MultiSelect);
app.component('Rating', Rating);
app.component('ToggleButton', ToggleButton);
app.component('DataTable', DataTable);
app.component('TriStateCheckbox', TriStateCheckbox);
app.component('Slider', Slider);
app.component('InputNumber', InputNumber);
app.component('ProgressBar', ProgressBar);

app.mount('#app');
