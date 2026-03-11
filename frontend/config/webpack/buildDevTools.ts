import { IBuildOptions } from './types';

export function buildDevTools(buildOptions: IBuildOptions): string | false {
    return buildOptions.mode === 'development' ? 'inline-source-map' : false;
}
