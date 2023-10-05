import path from 'path';
import FileManagerPlugin from 'filemanager-webpack-plugin';

import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
    new ForkTsCheckerWebpackPlugin({
        logger: 'webpack-infrastructure',
    }),
    new FileManagerPlugin({
        events: {
            onStart: {
                copy: [
/*
                    {
                        source: path.resolve(__dirname, "src/Data"), destination: path.resolve(__dirname, ".webpack/main/Data"),
                        options: {
                            flat: true,
                            preserveTimestamps: true,
                            overwrite: true,
                        },
                    },
*/
                    { source: path.resolve(__dirname, "src/pianissimo.png"), destination: path.resolve(__dirname, ".webpack/main/pianissimo.png")},
                    { source: path.resolve(__dirname, "Fonts/MaterialIconsTwoTone-Regular.otf"), destination: path.resolve(__dirname, ".webpack/renderer/main_window/assets/fonts/MaterialIconsTwoTone-Regular.otf")},
                ],
            },
        },
    }),

];
