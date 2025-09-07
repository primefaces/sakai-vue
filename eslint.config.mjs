import { defineConfig, globalIgnores as createGlobalIgnoreConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import createGitIgnoreConfig from 'eslint-config-flat-gitignore';
import vuePlugin from 'eslint-plugin-vue';
import vueStandardConfigs from '@vue/eslint-config-standard';
import vuePrettierConfig from '@vue/eslint-config-prettier/skip-formatting';
import tailwindPlugin from 'eslint-plugin-tailwindcss';

export default defineConfig([
    {
        name: 'app/language-options',
        languageOptions: {
            ecmaVersion: 'latest',
            globals: {
                ...globals.browser
                // Enable if using SSR or Node backend
                // ...globals.node
            }
        }
    },

    {
        name: 'app/files-to-lint',
        files: ['**/*.{js,mjs,cjs,jsx,vue}']
    },

    // TODO Some of these may be handled by the GitIgnore config below
    createGlobalIgnoreConfig(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/.vscode/**']),

    createGitIgnoreConfig({
        root: true,
        files: ['.gitignore', '.eslintignore', '.prettierignore'],
        // OK if ignore files don't exist
        strict: false
    }),

    js.configs.recommended,

    ...vuePlugin.configs['flat/essential'],
    ...vueStandardConfigs,

    ...tailwindPlugin.configs['flat/recommended'],

    // Prettier Config should be the last imported rule since it includes many overrides
    vuePrettierConfig,

    //
    // Manual Overrides - Place Last!
    //

    // Overrides Reflecting Project Norms
    {
        name: 'overrides/project-norms',
        files: ['**/*.{js,mjs,cjs,jsx,vue}'],
        rules: {
            'object-shorthand': ['error', 'consistent-as-needed'],
            'vue/block-order': [
                'error',
                {
                    order: ['script:not([setup])', 'script[setup]', 'template', 'style']
                }
            ],
            'vue/multi-word-component-names': 'off',
            'vue/no-reserved-component-names': 'off',
            // NOTE: If you decide to enable this, consider the 'prettier-plugin-tailwindcss' plugin too
            'tailwindcss/classnames-order': 'off',
            'tailwindcss/enforces-shorthand': 'off',
            'tailwindcss/no-custom-classname': 'off'
        }
    }
]);
