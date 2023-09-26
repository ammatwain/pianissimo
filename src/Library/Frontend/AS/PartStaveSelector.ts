import { THiddenPart, TPartStave } from "@Library/Common/DataObjects";
import { ASCSS } from "./ASCSS";
import { AS, ASCore } from "./ASCore";

ASCSS.PartStaveSelector = {
    "display": "block",
    "max-width": "100%",
    "min-width": "100%",
    "width": "100%",
    ">select":{
        "display": "block",
        "max-width": "100%",
        "min-width": "100%",
        "width": "100%",
    },
    ">select[multiple]:not(:focus) option:checked": {
        "background": "#1e90ff",
        "color": "white",
    },
};

export class PartStaveSelector extends ASCore {
    constructor(partsAndStaves: TPartStave[] = []) {
        super({partsAndStaves:partsAndStaves});
    }

    protected $preConnect(): void {
        this.$Elements.select = <HTMLSelectElement>document.createElement("select");
        this.$Elements.select.setAttribute("multiple",null);
        this.$Elements.select.setAttribute("size","5");
        super.$preConnect();
    }

    protected $alwaysConnect(): void {
        super.$alwaysConnect();
    }

    public get Parts(): TPartStave[] {
        return this.$Argument.partsAndStaves;
    }

    public get HiddenParts(): THiddenPart {
        const hiddenParts: THiddenPart = {};
        this.$Elements.select.querySelectorAll("option").forEach((option: HTMLOptionElement) => {
            if(!option.selected) {
                const path: string[] = option.value.split(",");
                if (path.length===2) {
                    const part: number = Number(path[0]);
                    if (!(part in hiddenParts)) {
                    hiddenParts[part]=[];
                    }
                    hiddenParts[part].push(Number(path[1]));
                }
            }
        });
        return hiddenParts;
    }

    public set Parts(partStave: TPartStave[]) {
        this.$Argument.partsAndStaves = partStave;
        this.$Elements.select.innerHTML = "";
        let countRows: number = 0;
        for (let p: number = 0 ; p < this.Parts.length ; p++) {
            countRows++;
            const part: TPartStave = this.Parts[p];
            const optGroup: HTMLOptGroupElement = <HTMLOptGroupElement>document.createElement("optgroup");
            optGroup.setAttribute("label",part.part);
            for (let o: number = 0; o < part.staves.length; o++){
                countRows++;
                const option: HTMLOptionElement = <HTMLOptionElement>document.createElement("option");
                option.value = `${p},${o}`;
                option.selected = part.staves[o];
                option.innerHTML = `Staff ${o+1}`;
                option.onmousedown = (event): void => {
                    this.$Elements.select.focus();
                    this.$stopEvent(event);
                };
                option.onmouseup = (event): void => {
                    this.$stopEvent(event);
                    option.selected = !option.selected;
                };
                option.onclick = (event): void => {
                    this.$stopEvent(event);
                };
                optGroup.appendChild(option);
            }
            this.$Elements.select.appendChild(optGroup);
        }
        if (countRows>15){
            countRows = 15;
        }
        this.$Elements.select.setAttribute("size",String(countRows));
        this.appendChild(this.$Elements.select);
    }

    public getPart(index: number): TPartStave {
        return this.Parts[index];
    }
}

customElements.define("part-stave", PartStaveSelector);
