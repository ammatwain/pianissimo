import type { Configuration } from 'webpack';
import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
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
    mode:"development",
    plugins,
    module: {
        rules,
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
        plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
    },
};
