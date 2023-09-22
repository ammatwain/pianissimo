import { ASCSS } from "./ASCSS";
import { AS, ASCore } from "./ASCore";

ASCSS.MajorKeys = {
    "background-color":"#2b2b2b",
    "border":"1px solid #2b2b2b",
    "display":"grid",
    "grid-gap":"1px",
    "grid-template-columns":"auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto ",
    ">div":{
        "background-color":"#1f1f1f",
        "text-align":"center",
        ">label":{
            "color":"#d7d7d7",
            "display":"block",
            "font-size":"80%",
        },
        ">input":{
            "cursor":"pointer",
        },
    }
};

export class MajorKeys extends ASCore {
    private boxType: "checkbox" | "radio";
    constructor(args: any = {} ){
        super(args);
    }
    protected $preConnect(): void {
        super.$preConnect();
        if (!("boxType" in this.$Argument && (this.$Argument.boxType==="checkbox" || this.$Argument.boxType === "radio") )) {
            this.$Argument.boxType="checkbox";
        }
        this.boxType = this.$Argument.boxType;
        const majoryKeyStrings: string[] = ["Cb","Gb","Db","Ab","Eb","Bb","F","C","G","D","A","E","B","F#","C#"];
        for (let i: number = 0; i< 15; i++){
            const label: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
            label.textContent = majoryKeyStrings[i];
            const check: HTMLInputElement = <HTMLInputElement>document.createElement("input");
            const div: HTMLDivElement = <HTMLDivElement>document.createElement("div");
            console.log("this.boxType",this.boxType);
            check.setAttribute("type", this.boxType);
            check.setAttribute("name", "major-keys");
            div.appendChild(label);
            div.appendChild(check);
            this.appendChild(div);
        }
    }
}

customElements.define("major-keys", MajorKeys);
