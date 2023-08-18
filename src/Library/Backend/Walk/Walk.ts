import FS from "fs";
import PATH from "path";

import directoryTree, { DirectoryTree } from "directory-tree";

interface IBranch {
    $id?: number;
    parentid?: number;
    sequence?: number;
    status?: number;
    type?: "book"|"sheet";
    name?: string;
    data?: any;
    $path?: string;
    $children?: IBranch[];
}

export class Walk{

    constructor(dir: string = "./"){
        this.dir = dir;
        this.tree = this.postwalk(null,null,dir);
    }

    private dir: string;
    private nextuid: number = 1;
    private tree: IBranch[] = [];
    private linear: IBranch[] = [];
    
    private prewalk(dir: string): DirectoryTree {
        return directoryTree(dir, {
            attributes:['type', 'atime', 'extension'],
            extensions: /\.(xml|musicxml|mxl)$/,
        });
    }
    
    private postwalk(treeNode: DirectoryTree | DirectoryTree []= null, parentid: number = null, dir: string = null): IBranch[] {
        const jsonChildren: IBranch[] = [];
        let nodes: DirectoryTree[] = [];
    
        if (treeNode===null && dir!==null){
            this.linear = [];
            this.nextuid = 1;
            treeNode = this.prewalk(dir);
        }
    
        if (!Array.isArray(treeNode)) {
            nodes = [treeNode];
        } else {
            nodes = treeNode;
        }

        nodes.forEach((node: DirectoryTree)=>{

            if (node.name.startsWith("§")){
                const tmp: string[] = node.name.split('.',3);
                if (tmp.length===3) {
                    node.name = `${tmp[2]};${tmp[1]}`;
                }
            }

            const jsonChild: IBranch = {
                $id: this.nextuid,
                sequence: this.nextuid++,
                parentid: parentid,
                status: 1,
                type: null,
                name: node.name.replaceAll('_',' '),
                data: null,
                $path: node.path,
                $children: [],
            };
    
            jsonChildren.push(jsonChild);
            if(node.type === "directory" && node.children && node.children.length ) {
                jsonChild.type = "book";
                jsonChild.$children = this.postwalk(node.children, jsonChild.$id);
            } else if(node.type === "file" && node.extension === '.musicxml'){
                jsonChild.name = PATH.basename(jsonChild.name,".musicxml");
                jsonChild.type = "sheet";
            }

            const jsonLeveled: IBranch = {};
            Object.assign(jsonLeveled,jsonChild);
            delete jsonLeveled.$children;
            this.linear.push(jsonLeveled);
        });
        return jsonChildren;
    }

    public get Tree(): IBranch[] {
        return this.tree;
    } 

    public get Linear(): IBranch[] {
        return this.linear.sort((a: IBranch, b: IBranch)=>{
            return a.$id - b.$id;
        });
    }

    public get TreeAsJSONString(): string {
        return JSON.stringify(this.Tree,null,2);
    } 

    public get LinearAsJSONString(): string {
        return JSON.stringify(this.Linear,null,2);
    }

}
/*
const walk = new Walk("./Letture");

FS.writeFileSync("./walk1.json", walk.TreeAsJSONString);
FS.writeFileSync("./walk2.json", walk.LinearAsJSONString);
*/