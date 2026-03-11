import { IBuildOptions } from './types';

export function buildDevServer(
    buildOptions: IBuildOptions
): { [index: string]: any } | undefined {
    if (buildOptions.mode === 'development') {
        return {
            port: buildOptions.port,
            open: true,
            historyApiFallback: true,
            hot: true,
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow any origin
                'Access-Control-Allow-Methods':
                    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers':
                    'X-Requested-With, content-type, Authorization',
            },
        };
    }

    return undefined;
}
