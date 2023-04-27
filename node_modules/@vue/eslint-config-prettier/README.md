# @vue/eslint-config-prettier

> eslint-config-prettier for Vue

This config is specifically designed to be used by `@vue/cli` & `create-vue` setups
and is not meant for outside use (it can be used but some adaptations
on the user side might be needed - for details see the config file).

A part of its design is that this config may implicitly depend on
other parts of `@vue/cli`/`create-vue` setups.

## Installation

In order to work around [a known limitation in ESLint](https://github.com/eslint/eslint/issues/3458), we recommend you to use this package alongside `@rushstack/eslint-patch`, so that you don't have to install too many dependencies:

```sh
npm add --dev @vue/eslint-config-prettier @rushstack/eslint-patch
```

Please also make sure that you have `prettier` and `eslint` installed.

## Usage

Add `"@vue/eslint-config-prettier"` to the `"extends"` array in your `.eslintrc.cjs` file. Make sure to put it **last**, so it gets the chance to override other configs.

```js
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  extends: [
    // ... other configs
    "@vue/eslint-config-prettier"
  ]
}
```

## Further Reading

The default config is based on the recommended configuration of [`eslint-plugin-prettier`](https://github.com/prettier/eslint-plugin-prettier/#recommended-configuration), which also depends on [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier). Please refer to their corresponding documentations for more implementation details.
