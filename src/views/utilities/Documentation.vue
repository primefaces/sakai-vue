<template>
    <div class="card">
        <h3>Documentation</h3>
        <p class="bg-primary border-round p-3">This page covers the Vite version, for Nuxt 3 visit the <a href="https://github.com/primefaces/sakai-nuxt" class="font-bold bg-primary hover:underline">sakai-nuxt</a> repository instead.</p>
        <h5>Getting Started</h5>
        <p>
            Sakai is an application template for Vue based on the <a href="https://github.com/vuejs/create-vue" class="font-medium text-primary hover:underline">create-vue</a>, the recommended way to start a <strong>Vite-powered</strong> Vue
            projects. To get started, clone the <a href="https://github.com/primefaces/sakai-vue" class="font-medium text-primary hover:underline">repository</a> from GitHub and install the dependencies with npm or yarn.
        </p>
        <CodeHighlight> npm install </CodeHighlight>

        or

        <CodeHighlight> yarn </CodeHighlight>

        <p>Next step is running the application using the serve script and navigate to <i>http://localhost:5173/</i> to view the application. That is it, you may now start with the development of your application using the Sakai template.</p>

        <CodeHighlight> npm run dev </CodeHighlight>

        <h5>Structure</h5>
        <p>Sakai consists of a couple folders, demos and layout have been separated so that you can easily remove what is not necessary for your application.</p>
        <ul class="line-height-3">
            <li><span class="text-primary font-medium">src/layout</span>: Main layout files, needs to be present</li>
            <li><span class="text-primary font-medium">src/views</span>: Demo pages</li>
            <li><span class="text-primary font-medium">public/demo</span>: Assets used in demos</li>
            <li><span class="text-primary font-medium">public/layout</span>: Assets used in layout</li>
            <li><span class="text-primary font-medium">src/assets/demo</span>: Styles used in demos</li>
            <li><span class="text-primary font-medium">src/assets/layout</span>: SCSS files of the main layout</li>
        </ul>

        <h5>Menu</h5>
        <p>Main menu is defined at <span class="text-primary font-medium">src/layout/AppMenu.vue</span> file.</p>

        <h5>Integration with Existing Vite Applications</h5>
        <p>Only the folders that are related to the layout needs to move in to your project. We've created a short tutorial with details.</p>

        <div class="video-container">
            <iframe className="video" width="560" height="315" src="https://www.youtube.com/embed/AHeSjJFR3ZE" frameborder="0" allowfullscreen></iframe>
        </div>

        <h5>PrimeVue Theme</h5>
        <p>Sakai theming is based on the PrimeVue theme being used. Default theme is <b>lara-light-indigo</b>.</p>

        <h5>SASS Variables</h5>
        <p>In case you&apos;d like to customize the main layout variables, open <b>_variables.scss</b> file under src/layout folder. Saving the changes will be reflected instantly at your browser.</p>

        <h6>src/layout/_variables.scss</h6>
        <CodeHighlight>
            /* General */
            <br />
            $scale:14px; /* main font size */
            <br />
            $borderRadius:12px; /* border radius of layout element e.g. card, sidebar */
            <br />
            $transitionDuration:.2s; /* transition duration of layout elements e.g. sidebar, overlay menus */
        </CodeHighlight>
    </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 991px) {
    .video-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;

        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
