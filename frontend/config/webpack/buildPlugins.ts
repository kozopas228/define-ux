import { IBuildOptions } from './types';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import path from 'path';
import Dotenv from 'dotenv-webpack';
import * as process from 'process';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export function buildPlugins(buildOptions: IBuildOptions): any[] {
    const commonPlugins = [
        new HtmlWebpackPlugin({
            template: buildOptions.paths.html,
            favicon: path.resolve(buildOptions.paths.public, 'favicon.ico'),
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[contenthash].css',
            chunkFilename: 'css/[contenthash].css',
        }),
        new webpack.ProgressPlugin(),
    ];
    const developmentPlugins: any[] = [
        new ReactRefreshWebpackPlugin(),
        new Dotenv({
            path: './.env',
        }),
    ];

    const productionPlugins: any[] = [
        new Dotenv({
            path: './.production.env',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/sitemap.xml', to: buildOptions.paths.output },
                { from: 'public/robots.txt', to: buildOptions.paths.output },
            ],
        }),
    ];

    if (buildOptions.mode === 'development') {
        return [...commonPlugins, ...developmentPlugins];
    }

    if (buildOptions.analyzeBundle) {
        productionPlugins.push(new BundleAnalyzerPlugin());
    }
    return [...commonPlugins, ...productionPlugins];
}
