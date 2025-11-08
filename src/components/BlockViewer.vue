<script setup>
import { reactive, ref } from 'vue';

const props = defineProps({
    header: {
        type: String,
        default: null
    },
    code: null,
    recent: {
        type: Boolean,
        default: false
    },
    free: {
        type: Boolean,
        default: false
    },
    containerClass: null,
    previewStyle: null
});

const BlockView = reactive({
    PREVIEW: 0,
    CODE: 1
});
const blockView = ref(0);
const codeCopied = ref(false);
const codeCopyLoading = ref(false);

function activateView(event, blockViewValue) {
    blockView.value = blockViewValue;
    event.preventDefault();
}

async function copyCode(event) {
    if (codeCopied.value || codeCopyLoading.value) return;

    codeCopyLoading.value = true;
    event.preventDefault();

    try {
        await navigator.clipboard.writeText(props.code);
        codeCopyLoading.value = false;
        codeCopied.value = true;
        setTimeout(() => {
            codeCopied.value = false;
        }, 2000);
    } catch (err) {
        console.error('Clipboard write failed:', err);
        codeCopyLoading.value = false;
    }
}
</script>

<template>
    <div class="mb-16 overflow-hidden">
        <div class="flex flex-col lg:flex-row justify-between py-4 gap-4 lg:gap-2 px-0!">
            <div class="flex items-center gap-2">
                <span class="font-medium text-xl">{{ header }}</span>
                <span v-if="free" class="flex items-center justify-center px-1.5 py-1 w-fit bg-emerald-500 text-emerald-100 dark:bg-emerald-400 dark:text-emerald-800 rounded-md leading-none! text-xs md:text-sm">Free</span>
            </div>
            <div class="flex items-center gap-2">
                <!-- Preview/Code Toggle -->
                <div class="inline-flex border border-surface-200 dark:border-surface-700 rounded-2xl overflow-hidden min-h-10">
                    <button
                        :class="[
                            'min-w-28 flex items-center gap-1 justify-center px-4 py-2 rounded-2xl transition-all duration-200 font-medium cursor-pointer   ',
                            blockView === BlockView.CODE ? 'bg-primary text-primary-contrast ' : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-0'
                        ]"
                        @click="activateView($event, BlockView.CODE)"
                    >
                        <span>Code</span>
                    </button>
                    <button
                        :class="[
                            'min-w-28 flex items-center gap-1 justify-center px-4 py-2 rounded-2xl transition-all duration-200 font-medium cursor-pointer',
                            blockView === BlockView.PREVIEW ? 'bg-primary text-primary-contrast   ' : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-0'
                        ]"
                        @click="activateView($event, BlockView.PREVIEW)"
                    >
                        <span>Preview</span>
                    </button>
                </div>

                <!-- Separator -->
                <div class="h-6 w-px bg-surface-200 dark:bg-surface-700 hidden lg:block"></div>

                <!-- Animated Copy Button -->
                <div class="flex items-center gap-2 grow lg:grow-0 justify-end lg:justify-start">
                    <button
                        @click="copyCode($event)"
                        :disabled="codeCopyLoading"
                        class="relative w-10 h-10 border border-surface-200 dark:border-surface-700 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 dark:focus-visible:ring-offset-surface-900 cursor-pointer disabled:cursor-wait"
                    >
                        <!-- Loading Spinner -->
                        <span :class="['absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 leading-none', codeCopyLoading ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-50 -z-[2]']">
                            <i class="pi pi-spinner animate-spin text-surface-700 dark:text-surface-300" style="font-size: 1.25rem"></i>
                        </span>

                        <!-- Checkmark Icon -->
                        <span :class="['absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 leading-none', codeCopied && !codeCopyLoading ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-50 -z-[2]']">
                            <svg class="w-5 h-5 fill-green-600 dark:fill-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g id="check">
                                    <path d="M9,18.25A.74.74,0,0,1,8.47,18l-5-5A.75.75,0,1,1,4.53,12L9,16.44,19.47,6A.75.75,0,0,1,20.53,7l-11,11A.74.74,0,0,1,9,18.25Z"></path>
                                </g>
                            </svg>
                        </span>

                        <!-- Copy Icon -->
                        <span :class="['absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 leading-none', !codeCopied && !codeCopyLoading ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-50 -z-[2]']">
                            <svg class="w-5 h-5 fill-surface-700 dark:fill-surface-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g id="clone">
                                    <path
                                        d="M14,16.75H6A2.75,2.75,0,0,1,3.25,14V6A2.75,2.75,0,0,1,6,3.25h8A2.75,2.75,0,0,1,16.75,6v8A2.75,2.75,0,0,1,14,16.75Zm-8-12A1.25,1.25,0,0,0,4.75,6v8A1.25,1.25,0,0,0,6,15.25h8A1.25,1.25,0,0,0,15.25,14V6A1.25,1.25,0,0,0,14,4.75Z"
                                    ></path>
                                    <path d="M18,20.75H10A2.75,2.75,0,0,1,7.25,18V16h1.5v2A1.25,1.25,0,0,0,10,19.25h8A1.25,1.25,0,0,0,19.25,18V10A1.25,1.25,0,0,0,18,8.75H16V7.25h2A2.75,2.75,0,0,1,20.75,10v8A2.75,2.75,0,0,1,18,20.75Z"></path>
                                </g>
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div class="p-0 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
            <div :class="containerClass" :style="previewStyle" v-if="blockView == BlockView.PREVIEW">
                <slot />
            </div>
            <div v-if="blockView === BlockView.CODE">
                <pre class="app-code"><code>{{code}}</code></pre>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
pre {
    border: 0 none !important;
    border-radius: 0 !important;
    .app-code {
        background: var(--p-surface-900) !important;
        margin: 0 !important;
        border: 0 none !important;
        &:before,
        &:after {
            display: none !important;
        }
        code {
            color: var(--p-surface-50);
            padding: 1rem;
            line-height: 1.5;
            display: block;
            font-family: monaco, Consolas, monospace;
        }
    }
}
</style>
