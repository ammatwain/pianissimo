import { ASCSS } from "./ASCSS";
import { ASCore } from "./ASCore";

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
    protected $preConnect(): void {
        this.$Property.checks = new Map();
        this.$Property.boxType = "checkbox";

        if (!("boxType" in this.$Argument && (this.$Argument.boxType==="checkbox" || this.$Argument.boxType === "radio") )) {
            this.$Argument.boxType="checkbox";
        }
        //super.$preConnect();

        this.BoxType = this.$Argument.boxType ;

        for (let i: number = 0; i< 15; i++){
            const label: HTMLLabelElement = <HTMLLabelElement>document.createElement("label");
            const div: HTMLDivElement = <HTMLDivElement>document.createElement("div");
            div.textContent = this.MajoryKeyStrings[i];
            const check: HTMLInputElement = <HTMLInputElement>document.createElement("input");
            check.setAttribute("type", this.BoxType);
            check.setAttribute("name", "major-keys");
            check.value = this.MajoryKeyStrings[i];
            label.appendChild(div);
            label.appendChild(check);
            this.appendChild(label);
            this.Checks.set(i-7,check);
            check.onclick = (): void => {
                this.doClick();
            };
        }
    }

    public get BoxType(): "checkbox" | "radio" {
        return this.$Property.boxType || "checkbox" ;
    }

    public set BoxType(boxType: "checkbox" | "radio") {
        this.$Property.boxType = boxType ;
    }

    public get Checked(): number[] {
        const values: number[] = [];
        for (let i: number = -7; i<=7 ; i++){
            if (this.Checks.get(i).checked) {
                values.push(i);
            }
        }
        return values;
    }

    public set Check(values: number[]) {
        this.Checks.forEach((check: HTMLInputElement, key: number ) => {
            if (values.includes(key)) {
                check.checked = true;
            }
        });
    }

    public get Checks(): Map<number,HTMLInputElement> {
        return this.$Property.checks;
    }

    public get MajoryKeyStrings(): string[] {
        return ["Cb","Gb","Db","Ab","Eb","Bb","F","C","G","D","A","E","B","F#","C#"];
    }

    public get Disabled(): number[] {
        const values: number[] = [];
        for (let i: number = -7; i<=7 ; i++){
            if (this.Checks.get(i).disabled) {
                values.push(i);
            }
        }
        return values;
    }

    public set Disabled(values: number[]) {
        this.Checks.forEach((check: HTMLInputElement, key: number ) => {
            if (values.includes(key)) {
                check.disabled = true;
            }
        });
    }

    public setEnabled(values: number[], impliesDisablingOtherElements: boolean = true): void {
        this.Checks.forEach((check: HTMLInputElement, key: number ) => {
            if(impliesDisablingOtherElements) {
                check.disabled = !values.includes(key);
            } else {
                if (values.includes(key)) {
                    check.disabled = false;
                }
            }
        });
    }

    public setChecked(values: number[], impliesUncheckOtherElements: boolean = true): void {
        this.Checks.forEach((check: HTMLInputElement, key: number ) => {
            if(impliesUncheckOtherElements) {
                check.checked = values.includes(key);
            } else {
                if (values.includes(key)) {
                    check.checked = true;
                }
            }
        });
    }

    public setDisabled(values: number[], impliesEnablingOtherElements: boolean = true): void {
        this.Checks.forEach((check: HTMLInputElement, key: number ) => {
            if(impliesEnablingOtherElements) {
                check.disabled = values.includes(key);
            } else {
                if (values.includes(key)) {
                    check.disabled = true;
                }
            }
        });
    }

    public get Enabled(): number[] {
        const values: number[] = [];
        for (let i: number = -7; i<=7 ; i++){
            if (!this.Checks.get(i).disabled) {
                values.push(i);
            }
        }
        return values;
    }

    public set Enabled(values: number[]) {
        this.Checks.forEach((check: HTMLInputElement, key: number ) => {
            if (values.includes(key)) {
                check.disabled = false;
            }
            console.log(key, check.disabled);
        });
    }

    public get Value(): number {
        for (let i: number = -7; i<=7 ; i++){
            if (this.Checks.get(i).checked) {
                return i;
            }
        }
        return null;
    }

    public set Value(value: number) {
        this.Checks.forEach((check: HTMLInputElement, key: number ) => {
            check.checked = key===value;
        });
    }

    public get Values(): number[] {
        const values: number[] = [];
        for (let i: number = -7; i<=7 ; i++){
            if (this.Checks.get(i).checked) {
                values.push(i);
            }
        }
        return values;
    }

    public set Values(values: number[]) {
        this.Checks.forEach((check: HTMLInputElement, key: number ) => {
            check.checked = values.includes(key);
        });
    }

    public get Visibles(): number[] {
        const values: number[] = [];
        for (let i: number = -7; i<=7 ; i++){
            if (!this.Checks.get(i).hidden) {
                values.push(i);
            }
        }
        return values;
    }

    public set Visibles(values: number[]) {
        this.Checks.forEach((check: HTMLInputElement, key: number ) => {
            check.hidden = !values.includes(key);
        });
    }


    public doClick(): void{
        ;
    }

}

customElements.define("major-keys", MajorKeys);
