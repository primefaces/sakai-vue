// /* eslint-env node */
// require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    extends: [],
    plugins:[
        'import'
    ],
    parserOptions: {},
    rules: {
        // Reglas específicas de eslint-plugin-import
        'import':'off',
        'import/no-unresolved': 'off', // Deshabilitar advertencia de módulos no resueltos
        'import/extensions': 'off', // Deshabilitar advertencia de extensiones de archivo en importaciones
    }
};
