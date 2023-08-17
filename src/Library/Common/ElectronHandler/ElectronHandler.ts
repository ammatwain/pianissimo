
//import { contextBridge, ipcRenderer /*, IpcRendererEvent */} from 'electron';
/*
export const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: any, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: any, func: any) {
    const subscription = (_event: any, ...args: any[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: any, func: any) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

export const appContextBridge = contextBridge;
export type ElectronHandler = typeof electronHandler;
*/
export const dummy: any = {};
 