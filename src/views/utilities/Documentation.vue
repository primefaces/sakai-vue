<template>
    <div class="grid">
        <div class="col-12">
            <div class="card docs">
                <h3>Current Version</h3>
                <p>Vue 3 and PrimeVue 3</p>

                <h5>Getting Started</h5>
                <p>
                    Sakai is an application template for Vue based on the <a href="https://cli.vuejs.org/" class="font-medium">Vue CLI</a> that provides out-of-the-box standard tooling for Vue projects. To get started, clone the
                    <a href="https://github.com/primefaces/sakai-vue" class="font-medium">repository</a> from GitHub and install the dependencies with npm or yarn.
                </p>
                <pre v-code.script><code>
npm install

</code></pre>

                or

                <pre v-code.script><code>
yarn

</code></pre>

                <p>Next step is running the application using the serve script and navigate to <i>http://localhost:8080/</i> to view the application. That is it, you may now start with the development of your application using the Sakai template.</p>

                <pre v-code.script><code>
npm run serve

</code></pre>

                <h5>Vue CLI Scripts</h5>
                <p>Following commands are derived from create-app-app.</p>
                <pre v-code.script><code>
"npm run serve": Starts the development server
"npm run build": Builds the application for deployment.
"npm run lint": Executes the lint checks.
"npm run test:unit": Runs the tests.

</code></pre>

                <h5>Structure</h5>
                <p>
                    Sakai consists of 2 main parts; the application layout and the resources. <i>App.vue</i> inside src folder is the main component containing the template for the base layout whereas required resources such as SASS structure for the
                    layout are placed inside the <b>src/assets/</b> folder.
                </p>

                <h5>Layout Components</h5>
                <p>
                    Main layout is the template of the <i>App.vue</i>, it is divided into a couple of child components such as topbar, menu and footer. Here is template of the <i>App.vue</i> component that implements the logic such as menu state,
                    layout modes and so on.
                </p>

                <h5>Menu</h5>
                <p>
                    Menu is a separate component defined in <i>AppMenu.vue</i> file based on PrimeVue MenuModel API. In order to define the menuitems, navigate to data section of <i>App.vue</i> file and define your own model as a nested structure
                    using the <i>menu</i> property.
                </p>

                <h5>Dependencies</h5>
                <p>Dependencies of Sakai are listed below and needs to be added to package.json.</p>

                <pre v-code.script>
<code>
{
    "primevue": "~3.11.0",
    "primeicons": "~5.0.0",
    "primeflex": "~3.1.2",
}

</code></pre>

                <h5>PrimeVue Theme</h5>
                <p>Sakai uses the free Saga, Arya and Vela themes which are distributed within PrimeVue, however it can be used with any PrimeVue theme as well such as material, tailwind and bootstrap.</p>

                <h5>SASS Variables</h5>
                <p>In case you'd like to customize the layout variables, open <i>_variables.scss</i> file under src/layout folder. Saving the changes will be reflected instantly at your browser.</p>

                <h6>src/assets/_variables.scss</h6>
                <pre v-code.css>
<code>
$fontSize:1rem;
$borderRadius:12px;
$transitionDuration:.2s;

</code></pre>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/documentation.scss';
</style>
