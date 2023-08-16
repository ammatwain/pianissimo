// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isBrowser, isNode, isWebWorker, isJsDom, isDeno } from "browser-or-node";
import { contextBridge, ipcMain } from "electron";

export class Trait {
    private _type: string;
    private _obj: any | any[];

    constructor(type: string, obj: any) {
        this._obj = obj;
    }

    sendMessage(messageName: string, args: any = {}){
        if(isBrowser){
            window.electron.ipcRenderer.sendMessage(messageName, args);
        } else {
            electron.ipcMain(messageName, args);
        }
    }

    $(key: string | number, value: any = undefined): any | undefined | void {
        if(value === undefined) {
            if (typeof this._obj === "object" && key in this._obj) {
                key = String(key);
                return this._obj[key];
            } else if(Array.isArray(this._obj)) {
                key = Number(key);
                if (key>=0 && key<this._obj.length){
                    return this._obj[key];
                }
            }
            return undefined;
        } else {
            if (typeof this._obj === "object") {
                key = String(key);
                if (!(key in this._obj) || (this._obj[key] !== value) ) {
                    this._obj[key] = value;
                    this.sendMessage('alert-trait-changed', {
                        emitter: this,
                        obj: this._obj,
                        key: key,
                    });
                }
            } else if (Array.isArray(this._obj)){
                key = Number(key);
                if (key>=0 && key<this._obj.length){
                    this._obj[key] = Number(key);
                    this.sendMessage('alert-trait-changed', {
                        emitter: this,
                        obj: this._obj,
                        key: key,
                    });
                }
            }
        }
    }
}
