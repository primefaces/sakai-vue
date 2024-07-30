<template>
    <div class="card">
        <div class="font-semibold text-2xl mb-4">Documentation</div>
        <div class="font-semibold text-xl mb-4">Get Started</div>
        <p class="text-lg mb-4">
            Sakai is an application template for Vue based on the <a href="https://github.com/vuejs/create-vue" class="font-medium text-primary hover:underline">create-vue</a>, the recommended way to start a <strong>Vite-powered</strong> Vue
            projects. To get started, clone the <a href="https://github.com/primefaces/sakai-vue" class="font-medium text-primary hover:underline">repository</a> from GitHub and install the dependencies with npm or yarn.
        </p>
        <pre class="app-code">
<code>git clone https://github.com/primefaces/sakai-vue
npm install
npm run dev</code></pre>

        <p class="text-lg mb-4">Navigate to <i class="bg-highlight px-2 py-1 rounded-border not-italic text-base">http://localhost:5173/</i> to view the application in your local environment.</p>

        <pre class="app-code"><code>npm run dev</code></pre>

        <div class="font-semibold text-xl mb-4">Structure</div>
        <p class="text-lg mb-4">Templates consists of a couple folders, demos and layout have been separated so that you can easily remove what is not necessary for your application.</p>
        <ul class="leading-normal list-disc pl-8 text-lg mb-4">
            <li><span class="text-primary font-medium">src/layout</span>: Main layout files, needs to be present.</li>
            <li><span class="text-primary font-medium">src/views</span>: Demo pages like Dashboard.</li>
            <li><span class="text-primary font-medium">public/demo</span>: Assets used in demos</li>
            <li><span class="text-primary font-medium">src/assets/demo</span>: Styles used in demos</li>
            <li><span class="text-primary font-medium">src/assets/layout</span>: SCSS files of the main layout</li>
        </ul>

        <div class="font-semibold text-xl mb-4">Menu</div>
        <p class="text-lg mb-4">
            Main menu is defined at <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">src/layout/AppMenu.vue</span> file. Update the <i class="bg-highlight px-2 py-1 rounded-border not-italic text-base">model</i> property to
            define your own menu items.
        </p>

        <div class="font-semibold text-xl mb-4">Layout Composable</div>
        <p class="text-lg mb-4">
            The <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">src/layout/composables/layout.js</span> is a composable that manages the layout state changes including dark mode, PrimeVue theme, menu modes and states. If you
            change the initial values like the preset or colors, make sure to apply them at PrimeVue config at main.js as well.
        </p>

        <div class="font-semibold text-xl mb-4">Tailwind CSS</div>
        <p class="text-lg mb-4">The demo pages are developed with Tailwind CSS however the core application shell mainly uses custom CSS.</p>

        <div class="font-semibold text-xl mb-4">Variables</div>
        <p class="text-lg mb-4">
            CSS variables used in the template derive their values from the PrimeVue styled mode presets, use the files under <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">assets/layout/_variables.scss</span> to customize
            according to your requirements.
        </p>
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
