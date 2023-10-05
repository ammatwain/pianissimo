/* eslint-disable @typescript-eslint/no-explicit-any */
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

export const electronHandler: { [index: string]: any } = {
  ipcRenderer: {
    sendMessage(channel: any, ...args: any[]): void {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: any, func: any): any {
      const subscription: (...args: any[]) => void  = (_event: any, ...args: any[]) => func(...args);
      ipcRenderer.on(channel, subscription);
      return  () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: any, func: any): void {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke: ipcRenderer.invoke,
  },
};


contextBridge.exposeInMainWorld("electron", electronHandler);
