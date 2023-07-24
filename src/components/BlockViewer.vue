<script setup>
import { ref, reactive } from 'vue';

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

function activateView(event, blockViewValue) {
    blockView.value = blockViewValue;
    event.preventDefault();
}

async function copyCode(event) {
    await navigator.clipboard.writeText(props.code);
    event.preventDefault();
}
</script>

<template>
    <div class="block-section">
        <div class="block-header">
            <span class="block-title">
                <span>{{ header }}</span>
                <span class="badge-new" v-if="recent">New</span>
                <span class="badge-free" v-if="free">Free</span>
            </span>
            <div class="block-actions">
                <a tabindex="0" :class="{ 'block-action-active': blockView === BlockView.PREVIEW }" @click="activateView($event, BlockView.PREVIEW)"><span>Preview</span></a>
                <a :tabindex="'0'" :class="{ 'block-action-active': blockView === BlockView.CODE }" @click="activateView($event, BlockView.CODE)">
                    <span>Code</span>
                </a>
                <a :tabindex="0" class="block-action-copy" @click="copyCode($event)" v-tooltip.focus.bottom="{ value: 'Copied to clipboard' }"><i class="pi pi-copy"></i></a>
            </div>
        </div>
        <div class="block-content">
            <div :class="containerClass" :style="previewStyle" v-if="blockView == BlockView.PREVIEW">
                <slot></slot>
            </div>
            <div v-if="blockView === BlockView.CODE">
                <pre class="app-code"><code>{{code}}</code></pre>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.block-section {
    margin-bottom: 4rem;
    overflow: hidden;
}

.block-header {
    padding: 1rem 2rem;
    background-color: var(--surface-section);
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border: 1px solid var(--surface-d);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .block-title {
        font-weight: 700;
        display: inline-flex;
        align-items: center;

        .badge-free {
            border-radius: 4px;
            padding: 0.25rem 0.5rem;
            background-color: var(--orange-500);
            color: white;
            margin-left: 1rem;
            font-weight: 700;
            font-size: 0.875rem;
        }
    }

    .block-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        user-select: none;
        margin-left: 1rem;

        a {
            display: flex;
            align-items: center;
            margin-right: 0.75rem;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-weight: 600;
            border: 1px solid transparent;
            transition: background-color 0.2s;
            cursor: pointer;

            &:last-child {
                margin-right: 0;
            }

            &:not(.block-action-disabled):hover {
                background-color: var(--surface-c);
            }

            &.block-action-active {
                border-color: var(--primary-color);
                color: var(--primary-color);
            }

            &.block-action-copy {
                i {
                    color: var(--primary-color);
                    font-size: 1.25rem;
                }
            }

            &.block-action-disabled {
                opacity: 0.6;
                cursor: auto !important;
            }

            i {
                margin-right: 0.5rem;
            }
        }
    }
}

.block-content {
    padding: 0;
    border: 1px solid var(--surface-d);
    border-top: 0 none;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    overflow: hidden;
}

pre[class*='language-'] {
    margin: 0 !important;

    &:before,
    &:after {
        display: none !important;
    }

    code {
        border-left: 0 none !important;
        box-shadow: none !important;
        background: var(--surface-e) !important;
        margin: 0;
        color: var(--text-color);
        font-size: 14px;
        padding: 0 2rem !important;

        .token {
            &.tag,
            &.keyword {
                color: #2196f3 !important;
            }

            &.attr-name,
            &.attr-string {
                color: #2196f3 !important;
            }

            &.attr-value {
                color: #4caf50 !important;
            }

            &.punctuation {
                color: var(--text-color);
            }

            &.operator,
            &.string {
                background: transparent;
            }
        }
    }
}

@media screen and (max-width: 575px) {
    .block-header {
        flex-direction: column;
        align-items: start;

        .block-actions {
            margin-top: 1rem;
            margin-left: 0;
        }
    }
}
</style>
