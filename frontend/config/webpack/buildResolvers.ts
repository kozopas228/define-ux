import { IBuildOptions } from './types';

export function buildResolvers(buildOptions: IBuildOptions): object {
    return {
        extensions: ['.tsx', '.ts', '.js'],
        // alias: {
        //     '@': buildOptions.paths.src,
        // },
        fallback: { process: require.resolve('process/browser') },
    };
}
