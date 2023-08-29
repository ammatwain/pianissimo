import PATH from "path";
import directoryTree, { DirectoryTree } from "directory-tree";
import { STR } from "../../Global/STR";
import { IWalk } from "../../Common/Interfaces";
import { IBranchObject } from "../../Common/Interfaces/IBranchObject";

export class FSWalk implements IWalk{

    constructor(dir: string = "./"){
        this.dir = dir;
        this.tree = this.postwalk(null,null,dir);
    }

    private dir: string;
    private nextuid: number = 1;
    private tree: IBranchObject[] = [];
    private linear: IBranchObject[] = [];

    private prewalk(dir: string): DirectoryTree {
        return directoryTree(dir, {
            attributes:["type", "atime", "extension"],
            extensions: /\.(xml|musicxml|mxl)$/,
        });
    }

    private postwalk(treeNode: DirectoryTree | DirectoryTree []= null, parentid: number = 0, dir: string = null): IBranchObject[] {
        parentid = parentid || 0;
        let sequence: number = 0;
        const jsonChildren: IBranchObject[] = [];
        let nodes: DirectoryTree[] = [];

        if (treeNode===null && dir!==null){
            this.linear = [];
            this.nextuid = Date.now();
            treeNode = this.prewalk(dir);
        }

        if (!Array.isArray(treeNode)) {
            nodes = [treeNode];
        } else {
            nodes = treeNode;
        }

        nodes.forEach((node: DirectoryTree)=>{

            const tmp: string[] = PATH.basename(node.name,".musicxml").split(".",3);
            if (tmp.length===3) {
                if (tmp[0].startsWith("§")){
                    node.name = `${tmp[2]};${tmp[1]}`;
                } else if(!isNaN(Number(tmp[0]))) {
                    node.name = `${tmp[1]}.${tmp[2]};${Number(tmp[0])}`;
                }
            }

            const jsonChild: IBranchObject = {
                id: this.nextuid++,
                sequence: sequence++,
                parentid: parentid,
                type: null,
                name: node.name.replaceAll("_"," ").replaceAll("'","''"),
                data: null,
                $path: node.path,
                $children: [],
            };

            jsonChildren.push(jsonChild);
            if(node.type === "directory" && node.children && node.children.length ) {
                jsonChild.type = STR.book;
                jsonChild.$children = this.postwalk(node.children, jsonChild.id);
                //for (let i: number = 0; i < jsonChild.$children.length; i++){
                //    jsonChild.$children[i].sequence = i;
                //}
            } else if(node.type === "file" && node.extension === ".musicxml"){
                jsonChild.name = PATH.basename(jsonChild.name,".musicxml");
                jsonChild.type = STR.sheet;
            }

            const jsonLeveled: IBranchObject = Object.assign({},jsonChild);
            delete jsonLeveled.$children;
            this.linear.push(jsonLeveled);
        });
        return jsonChildren;
    }

    private jsonStringifyReplacer(key: string, value: any): any{
        if (key==="EXAMPLE_KEY") {
            return undefined;
        }
        return value;
    }

    public get TreeObjects(): IBranchObject[] {
        return this.tree;
    }

    public get LinearObjects(): IBranchObject[] {
        return this.linear.sort((a: IBranchObject, b: IBranchObject)=>{
            return a.id - b.id;
        });
    }

    public get TreeAsJSONString(): string {
        return JSON.stringify(this.TreeObjects,this.jsonStringifyReplacer,2);
    }

    public get LinearAsJSONString(): string {
        return JSON.stringify(this.LinearObjects,this.jsonStringifyReplacer,2);
    }

}
/*
const walk = new Walk("./Letture");

FS.writeFileSync("./walk1.json", walk.TreeAsJSONString);
FS.writeFileSync("./walk2.json", walk.LinearAsJSONString);
*/
