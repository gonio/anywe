// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
    },
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    extends: ['plugin:vue/essential', 'airbnb-base'],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // check if imports actually resolve
    settings: {
        'import/resolver': {
            webpack: {
                config: 'build/webpack.base.conf.js'
            }
        }
    },
    // add your custom rules here
    rules: {
        // don't require .vue extension when importing
        'import/extensions': ['error', 'always', {
            js: 'never',
            vue: 'never'
        }],
        // disallow reassignment of function parameters
        // disallow parameter object manipulation except for specific exclusions
        // 'no-param-reassign': ['error', {
        //     props: true,
        //     ignorePropertyModificationsFor: [
        //         'state', // for vuex state
        //         'acc', // for reduce accumulators
        //         'e' // for e.returnvalue
        //     ]
        // }],
        // allow optionalDependencies
        'import/no-extraneous-dependencies': ['error', {
            optionalDependencies: ['test/unit/main.js']
        }],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'indent': 0,
        'space-before-function-paren': ['error', 'always'],
        'no-underscore-dangle': ['off', 'always'],
        'func-names': ['off', 'always'],
        'comma-dangle': ['off', 'always'],
        'max-len': ["error", 120],
        'import/prefer-default-export': 0,
        'no-use-before-define': 0,
        'no-param-reassign': 0,
        'padded-blocks': 0,
        'no-mixed-operators': 0,
        'no-plusplus': 0,
        'consistent-return': 0,
        'no-shadow': 0,
        'no-new': 0
    }
};
