<script setup>
import { ref, onMounted, computed } from 'vue';

const icons = ref(null);
const filter = ref(null);

const filteredIcons = computed(() => {
    if (filter.value) return icons.value.filter((icon) => icon.properties.name.indexOf(filter.value.toLowerCase()) > -1);
    else return icons.value;
});

onMounted(() => {
    fetch('/demo/data/icons.json', { headers: { 'Cache-Control': 'no-cache' } })
        .then((res) => res.json())
        .then((d) => {
            let data = d.icons.filter((value) => {
                return value.icon.tags.indexOf('deprecate') === -1;
            });
            data.sort((icon1, icon2) => {
                if (icon1.properties.name < icon2.properties.name) return -1;
                else if (icon1.properties.name > icon2.properties.name) return 1;
                else return 0;
            });

            icons.value = data;
        });
});
</script>

<template>
    <div class="card">
        <h2>Icons</h2>
        <p>
            PrimeVue components internally use <a href="https://github.com/primefaces/primeicons" class="font-medium text-primary hover:underline">PrimeIcons</a> library, the official icons suite from
            <a href="https://www.primetek.com.tr" class="font-medium text-primary hover:underline">PrimeTek</a>.
        </p>

        <h4>Download</h4>
        <p>PrimeIcons is available at npm, run the following command to download it to your project.</p>

        <pre class="app-code"><code>npm install primeicons --save</code></pre>

        <h4>Getting Started</h4>
        <p>PrimeIcons use the <strong>pi pi-&#123;icon&#125;</strong> syntax such as <strong>pi pi-check</strong>. A standalone icon can be displayed using an element like <i>i</i> or <i>span</i></p>

        <pre class="app-code"><code>&lt;i class="pi pi-check"&gt;&lt;/i&gt;
&lt;i class="pi pi-times"&gt;&lt;/i&gt;</code></pre>

        <i class="pi pi-check" style="margin-right: 0.5rem"></i>
        <i class="pi pi-times"></i>

        <h4>Size</h4>
        <p>Size of the icons can easily be changed using font-size property.</p>

        <pre class="app-code"><code>&lt;i class="pi pi-check"&gt;&lt;/i&gt;</code></pre>

        <i class="pi pi-check"></i>

        <pre class="app-code"><code>&lt;i class="pi pi-check" style="font-size: 2rem"&gt;&lt;/i&gt;</code></pre>

        <i class="pi pi-check" style="font-size: 2rem"></i>

        <h4>Spinning Animation</h4>
        <p>Special pi-spin class applies continuous rotation to an icon.</p>
        <pre class="app-code"><code>&lt;i class="pi pi-spin pi-spinner" style="font-size: 2rem"&gt;&lt;/i&gt;</code></pre>

        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>

        <h4>List of Icons</h4>
        <p>
            Here is the current list of PrimeIcons, more icons are added periodically. You may also <a href="https://github.com/primefaces/primeicons/issues" class="font-medium text-primary hover:underline">request new icons</a> at the issue tracker.
        </p>

        <InputText v-model="filter" class="w-full p-3 mt-3 mb-5" placeholder="Search an icon" />

        <div class="grid icons-list text-center">
            <div class="col-6 sm:col-4 lg:col-3 xl:col-2 pb-5" v-for="icon of filteredIcons" :key="icon.properties.name">
                <i :class="'text-2xl mb-2 pi pi-' + icon.properties.name"></i>
                <div>pi-{{ icon.properties.name }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.icons-list {
    i {
        color: var(--text-color-secondary);
    }
}
</style>
