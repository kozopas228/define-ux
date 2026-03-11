export interface IBuildPaths {
    entry: string;
    html: string;
    output: string;
    src: string;
    public: string;
}

export interface IBuildOptions {
    port: number;
    paths: IBuildPaths;
    mode: Mode;
    analyzeBundle: boolean;
}

export interface IEnvironmentVariables {
    mode?: Mode;
    port?: number;
    analyzeBundle?: string;
}

export type Mode = 'production' | 'development';
