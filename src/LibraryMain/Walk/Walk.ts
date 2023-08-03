import FS from 'fs';
import PATH from 'path';

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

interface WorkItem {
    id: string;
    level: number;
    children?: WorkItem[];
}

export const walk2 = function(path: string, level: number = 0): WorkItem[] {
    path = PATH.resolve(__dirname,path);
    console.log("PATH",path);
    const workItems: WorkItem[] = [];
    const workItem: WorkItem = {
        id: path,
        level: level,
    };
    const pathStats: FS.Stats = FS.statSync(path);
    if (pathStats.isDirectory){
        const entries: string[] = safeReadDirSync(path);
        entries.forEach((entry: string)=>{
            const entryStats: FS.Stats = FS.statSync(path);
            console.log("ENTRY", entry);
            if (entryStats.isDirectory){
                workItem.children = walk(entry, level + 1);
            }
        });
    }
    workItems.push(workItem);
    return workItems;
};

export const walk = function(dir: string, level: number = 0) {
    dir = PATH.resolve(__dirname, dir);
    const results: WorkItem[] = [];
    const list = safeReadDirSync(dir);
    list.forEach(function(file: string) {
        file = dir + '/' + file;
        const stat = FS.statSync(file);
        const workItem: WorkItem = {
            id: file,
            level: level,
        }
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            workItem.children = walk(file, level + 1);
        }
        results.push(workItem);
    });
    return results;
}

