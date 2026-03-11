module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: [
        '.eslintrc.js',
        'node_modules/',
        'dist/',
        'webpack.config.js',
    ],
    rules: {
        'prettier/prettier': 'warn',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        "@typescript-eslint/no-unused-vars": "off",
        'semi': ['error', 'always'],
        'prefer-const': 'error',
        'max-len': ['error', {'code':  120}],
        'jsx-quotes': ['error', 'prefer-single']
    },
};
