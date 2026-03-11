import { IBuildOptions } from './types';

export function buildOutput(buildOptions: IBuildOptions): object {
    return {
        filename: 'js/bundle.[contenthash].js',
        path: buildOptions.paths.output,
        publicPath: '/',
        clean: true,
        assetModuleFilename: 'assets/[hash][ext]',
    };
}
