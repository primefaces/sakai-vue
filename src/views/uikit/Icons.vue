<template>
    <div>
        <div class="card">
            <h3>Icons</h3>
            <p>PrimeVue components internally use <a href="https://github.com/primefaces/primeicons" class="font-medium">PrimeIcons</a> library, the official icons suite from <a href="https://www.primetek.com.tr" class="font-medium">PrimeTek</a>.</p>

            <h5>Download</h5>
            <p>PrimeIcons is available at npm, run the following command to download it to your project.</p>

<pre v-code><code>
npm install primeicons --save

</code></pre>

            <h5>Getting Started</h5>
            <p>PrimeIcons use the <strong>pi pi-&#123;icon&#125;</strong> syntax such as <strong>pi pi-check</strong>.
            A standalone icon can be displayed using an element like <i>i</i> or <i>span</i></p>

<pre v-code><code>
&lt;i class="pi pi-check"&gt;&lt;/i&gt;
&lt;i class="pi pi-times"&gt;&lt;/i&gt;

</code></pre>

<i class="pi pi-check" style="margin-right: .5rem"></i>
<i class="pi pi-times"></i>

            <h5>Size</h5>
            <p>Size of the icons can easily be changed using font-size property.</p>

<pre v-code><code>
&lt;i class="pi pi-check"&gt;&lt;/i&gt;

</code></pre>

            <i class="pi pi-check"></i>

<pre v-code><code>
&lt;i class="pi pi-check" style="font-size: 2rem"&gt;&lt;/i&gt;

</code></pre>

            <i class="pi pi-check" style="font-size: 2rem"></i>

            <h5>Spinning Animation</h5>
            <p>Special pi-spin class applies continuous rotation to an icon.</p>
<pre v-code><code>
&lt;i class="pi pi-spin pi-spinner" style="font-size: 2rem"&gt;&lt;/i&gt;

</code></pre>

            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>

            <h5>Constants</h5>
            <p>PrimeIcons constants API is provided to easily choose an icon with typescript e.g. when defining a menu model.</p>
<pre v-code><code>
&lt;Menu :model="items" /&gt;

</code></pre>

<pre v-code.script><code>
import {PrimeIcons} from 'primevue/api';

export default {
	data() {
		return {
			items: [
				{
					label: 'Update',
					icon: PrimeIcons.REFRESH,
                    to: '/update'
				},
				{
					label: 'Delete',
					icon: PrimeIcons.TIMES,
                    to: '/delete'
				}
			]
		}
	}
}

</code></pre>

            <h5>List of Icons</h5>
            <p>Here is the current list of PrimeIcons, more icons are added periodically. You may also <a href="https://github.com/primefaces/primeicons/issues" class="font-medium">request new icons</a> at the issue tracker.</p>

            <InputText v-model="filter" class="w-full p-3 mt-3 mb-5" placeholder="Search an icon" />

            <div class="grid icons-list text-center">
                <div class="col-6 sm:col-4 lg:col-3 xl:col-2 pb-5" v-for="icon of filteredIcons" :key="icon.properties.name">
                    <i :class="'text-2xl mb-2 pi pi-' + icon.properties.name"></i>
                    <div>pi-{{icon.properties.name}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            icons: null,
            filter: null
        }
    },
    mounted() {
        fetch('data/icons.json', { headers: { 'Cache-Control' : 'no-cache' } }).then(res => res.json())
            .then(d => {
                let icons = d.icons;
                let data = icons.filter(value => {
                    return value.icon.tags.indexOf('deprecate') === -1;
                });
                data.sort((icon1, icon2) => {
                    if(icon1.properties.name < icon2.properties.name)
                        return -1;
                    else if(icon1.properties.name < icon2.properties.name)
                        return 1;
                    else
                        return 0;
                });

                this.icons = data;
            });
    },
    computed: {
        filteredIcons() {
            if (this.filter)
                return this.icons.filter(icon => icon.properties.name.indexOf(this.filter.toLowerCase()) > -1);
            else
                return this.icons;
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/demo/documentation.scss';

.icons-list {
    i {
        color: var(--text-color-secondary);
    }
}
</style>
