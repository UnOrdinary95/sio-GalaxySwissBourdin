import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';
import { vueTsConfigs } from '@vue/eslint-config-typescript';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default tseslint.config(
    {
        ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**'],
    },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,js}'],
        languageOptions: {
            globals: { ...globals.node },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            'prefer-const': 'warn',
            'no-undef': 'off',
        },
    },
    {
        files: ['**/*.vue'],
        extends: [
            ...pluginVue.configs['flat/essential'],
            ...vueTsConfigs.recommended,
        ],
        languageOptions: {
            globals: { ...globals.browser },
        },
    },
    prettier,
    skipFormatting
);
