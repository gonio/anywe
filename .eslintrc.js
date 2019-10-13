module.exports = {
    root: true,

    parserOptions: {
        sourceType: 'module',
        parser: 'babel-eslint',
        ecmaVersion: 8
    },

    // 请设置项目的根目录，sfchecklist部分规则需要根据根目录进行检查
    // 如果没有设置，sfchecklist会将node_modules、package.json所在目录作为根目录
    settings: {
        sfchecklist: {
            projectRoot: __dirname
        }
    },

    // 配置环境，启用环境特效和注册环境预定义的全局变量
    // 具体参照：https://cn.eslint.org/docs/user-guide/configuring#specifying-environments
    env: {
        browser: true,
        node: true,
        es6: true
    },

    // 配置插件，sxf预置了 eslint-plugin-['vue', 'import'], 以及相应规则的配置
    // 如果使用这些插件则不需要再进行配置，并且也不应该进行配置
    // 具体参考：https://cn.eslint.org/docs/user-guide/configuring#configuring-plugins
    plugins: ['@sxf/sfchecklist'],

    // 配置规则包，配置插件提供的规则套装
    // plugin:@sxf/sfchecklist/checklist：完全遵循深信服UEDC前端checklist规则
    // plugin:@sxf/sfchecklist/enhance：当前checklist没有、但正在评审或强烈推荐的规则
    // plugin:@sxf/sfchecklist/vue：使用eslint-plugin-vue插件，并已经根据公司checklist进行配置的规则
    // plugin:@sxf/sfchecklist/import：使用eslint-plugin-import插件，全部使用的默认值
    extends: [
        'plugin:@sxf/sfchecklist/checklist',
        'plugin:@sxf/sfchecklist/enhance',
        'plugin:@sxf/sfchecklist/vue',
        'plugin:@sxf/sfchecklist/import'
    ],


    rules: {
        '@sxf/sfchecklist/no-const-lowercase': 'off',    // 固定变量必须大写，暂时关闭
        'vue/attribute-hyphenation': 'error',    // 强制在Vue模板中的自定义组件上使用带 - 字符的属性名称

        // 行末禁止空格
        'no-trailing-spaces': 'error',

        // 强制在对象字面量的属性中键和值之间使用一致的间距
        "key-spacing": ['error', { "beforeColon": false, "afterColon": true }],

        // 在箭头函数的箭头之前/之后需要空格
        "arrow-spacing": ['error', { "before": true, "after": true } ],

        // 在大括号内强制一致的间距
        "object-curly-spacing": ['error', "always"],

        "@sxf/sfchecklist/require-jsdoc": 'off',

        "no-magic-numbers": 'off',
    },

    globals: {
        _: false,
        'window': false,
        'Map': false,
        'Set': false,
        'Promise': false
    }
};
