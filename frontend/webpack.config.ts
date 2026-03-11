import path from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';
import {
    IBuildOptions,
    IBuildPaths,
    IEnvironmentVariables,
} from './config/webpack/types';
import { buildDevTools } from './config/webpack/buildDevTools';
import { buildDevServer } from './config/webpack/buildDevServer';
import { buildOutput } from './config/webpack/buildOutput';
import { buildPlugins } from './config/webpack/buildPlugins';
import { buildLoaders } from './config/webpack/buildLoaders';
import { buildResolvers } from './config/webpack/buildResolvers';

export default (env: IEnvironmentVariables) => {
    const paths: IBuildPaths = {
        output: path.resolve(__dirname, 'dist'),
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        src: path.resolve(__dirname, 'src'),
        public: path.resolve(__dirname, 'public'),
    };

    const buildOptions: IBuildOptions = {
        port: env.port ?? 3000,
        mode: env.mode ?? 'development',
        analyzeBundle: env.analyzeBundle !== 'false',
        paths,
    };

    const config: webpack.Configuration = {
        mode: buildOptions.mode,
        entry: buildOptions.paths.entry,
        devtool: buildDevTools(buildOptions),
        devServer: buildDevServer(buildOptions),
        output: buildOutput(buildOptions),
        plugins: buildPlugins(buildOptions),
        optimization: {
            runtimeChunk: 'single',
        },
        module: {
            rules: buildLoaders(buildOptions),
        },
        resolve: buildResolvers(buildOptions),
    };

    return config;
};
