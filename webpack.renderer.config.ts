import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
//added
//import path from 'path';
//import CopyPlugin from 'copy-webpack-plugin';
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

rules.push({
    test: /\.css$/,
    use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'sass-loader' }
    ],
});

export const rendererConfig: Configuration = {
    plugins,
    module: {
        rules,
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
        plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
    },
};
