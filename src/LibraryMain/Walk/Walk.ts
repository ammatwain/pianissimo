import FS from 'fs';
import PATH from 'path';
import { IInfoFile, IWorkItem } from '../../LibraryCommon/Interfaces';
import { app } from 'electron';

function safeReadDirSync (path: string): string[] {
    let dirData: string[];
    try {
      dirData = FS.readdirSync(path);
    } catch(ex) {
      if (ex.code == "EACCES" || ex.code == "EPERM") {
        //User does not have permissions, ignore directory
        return null;
      }
      else throw ex;
    }
    return dirData;
}

export function checkArrayInInfo(info: IInfoFile): boolean {
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let ok: boolean = true;
    if (!('keys' in info)) {
        info.keys = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
        ok = false;
    }
    if (!('shot' in info)) {
        info.shot = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        ok = false;
    }
    if (!('done' in info)) {
        info.done = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        ok = false;
    }
    if (!('fail' in info)) {
        info.fail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        ok = false;
    }
    return ok;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readInfo(dir: string): IInfoFile {
    //const removePath = PATH.resolve(__dirname,'../renderer/main_window');
    const removePath = PATH.resolve(__dirname, dir).split('/Letture/')[0];
    const dirBasename: string = PATH.basename(dir,'.jmxl');
    const isJmxl: boolean = PATH.extname(dir) === '.jmxl';
    const jsonFile: string = PATH.resolve(dir,'info.json');
    const mxlFile: string = PATH.resolve(dir,'sheet.mxl');
    console.log(removePath, jsonFile, mxlFile);
    let infoFile: IInfoFile;
    if (FS.existsSync(jsonFile)) {
        infoFile = <IInfoFile>JSON.parse(FS.readFileSync(jsonFile).toString('utf8'));
    } else {
        infoFile = {
            caption:  dirBasename,
            keys: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
            shot: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            done: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            fail: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            type: null,
            info: null,
        }
        if (isJmxl){
            infoFile.type = 'sheet';
            infoFile.practice = false;
            if (FS.existsSync(mxlFile)){
                infoFile.sheet = 'sheet.mxl';
            }
        } else {
            infoFile.type = 'book';
        }
        FS.writeFileSync(jsonFile,JSON.stringify(infoFile));
    }
    if (!checkArrayInInfo(infoFile)) {
        FS.writeFileSync(jsonFile,JSON.stringify(infoFile));
    }
    infoFile.info = jsonFile;
    return infoFile;
}

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const walk = function(dir: string, id: string = '') {
    //const removePath = PATH.resolve(__dirname,'../renderer');
    //const removePath = PATH.resolve(__dirname,'../renderer/main_window');
    const removePath = PATH.resolve(__dirname, dir).split('/Letture/')[0];
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let level: number = 0;
    let idStr: string = id;
    if (id!=='') {
        level = (id.split('-').length) || 0 ;
    }
    if (level) {
        idStr = id + '-';
    }
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let idNum: number = 0;
    dir = PATH.resolve(__dirname, dir);
    const results: IWorkItem[] = [];
    const list = safeReadDirSync(dir);
    list.forEach(function(file: string) {
        file = dir + '/' + file;
        let removedPath: string = '';
        const stat = FS.statSync(file);
        if (app.isPackaged) {
            removedPath = file.replace(removePath,'.');
        } else {
            removedPath = file.replace(removePath,'./main_window');
        }
        const workItem: IWorkItem = {
            id: idStr + idNum,
//            path: file.replace(removePath,'.'),
            path: removedPath,
            name: PATH.basename(file),
            level: level,
        }
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            if (PATH.extname(file)!=='.jmxl') {
                workItem.children = walk(file, workItem.id);
            }
            Object.assign(workItem,readInfo(file));
            results.push(workItem);
            idNum++;
        }
    });
    return results;
}

