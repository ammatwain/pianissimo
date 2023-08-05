/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import { App } from './LibraryRenderer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app: App = new App("osmd");

/*
const arborData: IArborBranch[] = [
    {
        id: '0',
        caption: 'branch-0',
        children: [
            {
                id: '0-0',
                caption: 'branch-0-0',
                children: [
                    {id: '0-0-0', caption: 'branch-0-0-0', percent: 0},
                    {id: '0-0-1', caption: 'branch-0-0-1', percent: 0},
                    {id: '0-0-2', caption: 'branch-0-0-2', percent: 0},
                ],
            },
            {id: '0-1', caption: 'branch-0-1', percent: 0},
        ],
    },
    {
        id: '1',
        caption: 'branch-1',
        children: [
            {id: '1-0', caption: 'branch-1-0', percent: 0},
            {id: '1-1', caption: 'branch-1-1', percent: 0}
        ],
    },
];
*/
