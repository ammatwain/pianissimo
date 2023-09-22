import { ASCSS } from "./ASCSS";
import { AS, ASCore } from "./ASCore";

ASCSS.MajorKeys = {
    "background-color":"#2b2b2b",
    "border":"1px solid #2b2b2b",
    "display":"grid",
    "grid-gap":"1px",
    "grid-template-columns":"auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto ",
    ">label":{
        "background-color":"#1f1f1f",
        "cursor":"pointer",
        "text-align":"center",
        ">div":{
            "color":"#d7d7d7",
            "cursor":"pointer",
            "display":"block",
            "font-size":"80%",
        },
        ">input":{
            "cursor":"pointer",
        },
        ">input[type=\"checkbox\"]":{
            "height":"24px",
            "width":"24px",
        },
        ">input[type=\"radio\"]":{
            "height":"24px",
            "width":"24px",
        },
    }
};

export class MajorKeys extends ASCore {
    private boxType: "checkbox" | "radio";
    private majoryKeyStrings: string[];
    private checks: Map<number,HTMLLabelElement>;
    constructor(args: any = {} ){
        super(args);
    }
    protected $preConnect(): void {
        super.$preConnect();
        this.checks = new Map();
        this.majoryKeyStrings = ["Cb","Gb","Db","Ab","Eb","Bb","F","C","G","D","A","E","B","F#","C#"];
        if (!("boxType" in this.$Argument && (this.$Argument.boxType==="checkbox" || this.$Argument.boxType === "radio") )) {
            this.$Argument.boxType="checkbox";
        }
        this.boxType = this.$Argument.boxType;
        for (let i: number = 0; i< 15; i++){
            const label: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
            const div: HTMLDivElement = <HTMLDivElement>document.createElement("div");
            console.log(this.majoryKeyStrings);
            div.textContent = this.majoryKeyStrings[i];
            const check: HTMLInputElement = <HTMLInputElement>document.createElement("input");
            console.log("this.boxType",this.boxType);
            check.setAttribute("type", this.boxType);
            check.setAttribute("name", "major-keys");
            check.value = this.majoryKeyStrings[i];
            label.appendChild(div);
            label.appendChild(check);
            this.appendChild(label);
            this.checks.set(i-7,label);
        }
    }
}

customElements.define("major-keys", MajorKeys);
