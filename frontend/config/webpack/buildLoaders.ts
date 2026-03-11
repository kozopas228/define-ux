import { IBuildOptions } from './types';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export function buildLoaders(buildOptions: IBuildOptions): any[] {
    return [
        {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
            // Previously svg was here too, but it doesn't work in combination with svgr loader,
            // which is responsible for correct svg operation
            test: /\.(png|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        },
        {
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: [{ loader: '@svgr/webpack', options: { icon: true } }],
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
        },
        {
            test: /\.(csv|tsv)$/i,
            use: ['csv-loader'],
        },
        {
            test: /\.xml$/i,
            use: ['xml-loader'],
        },
        {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
            },
        },
        {
            test: /\.m?js/,
            type: 'javascript/auto',
        },
        {
            test: /\.m?js/,
            resolve: {
                fullySpecified: false,
            },
        },
    ];
}
