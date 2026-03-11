// eslint-disable-next-line no-undef
module.exports = (api) => {
    const isTest = api.env('test');
    const isDev = api.env('development');

    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        browsers: ['>0.1%', 'not dead'],
                    },
                    useBuiltIns: 'usage',
                    corejs: { version: '3.35.0', proposals: true },
                    modules: isTest ? 'commonjs' : false,
                },
            ],
            '@babel/preset-typescript',
            [
                '@babel/preset-react',
                {
                    runtime: isDev ? 'automatic' : 'classic',
                },
            ],
        ],
    };
};
