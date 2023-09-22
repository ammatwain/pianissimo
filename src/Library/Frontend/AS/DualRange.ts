import { ASCSS } from "./ASCSS";
import { AS, ASCore } from "./ASCore";

ASCSS.DualRange = {
    "box-sizing": "border-box",
    "display":"grid",
    "grid-gap":"1px",
    "grid-template-columns":"auto 1fr auto",
    "line-height":"24px",
    "min-height":"24px",
    ">label":{
        "color":"#d7d7d7",
        "display":"inline-block",
        "font-size":"80%",
        "min-width":"4ch",
        "vertical-align":"middle",
        "#min":{
            "text-align":"left",
        },
        "#max":{
            "text-align":"right",
        }
},
    ">div":{
        "box-sizing": "content-box",
        "position":"relative",
        ">input[type=\"range\"]":{
            "appareance":"none",
            "background-color": "transparent",
            "margin": "0px",
            "box-sizing": "border-box",
            "cursor":"pointer",
            "min-height":"24px",
            "pointer-events":"none",
            "position":"absolute",
            "width":"calc(100% - 24px)",
            "-webkit-appearance":"none;",
            "::-webkit-slider-runnable-track":{
                "pointer-events":"none",
            },
            "::-webkit-slider-thumb":{
                "min-width":"24px",
                "min-height":"24px",
                "pointer-events":"all",
            },
            "#min":{
                "left":"0px",
                "top":"0px",
            },
            "#max":{
                "left":"24px",
                "top":"0px",
            }
        },
    }
};

export class DualRange extends ASCore {
    private min: number = 100;
    private max: number = 0;
    private selectedMin: number = 100;
    private selectedMax: number = 0;
    constructor(min: number, max: number, selectedMin: number = null, selectedMax: number = null) {
        super();

        this.setMinMax(min,max);

        if (!selectedMin) {
            selectedMin = this.Min;
        }
        if (!selectedMax) {
            selectedMax = this.Max;
        }
        this.SelectedMin = Math.min(selectedMin,selectedMax);
        this.SelectedMax = Math.max(selectedMin,selectedMax);
    }

    protected $preConnect(): void {
        super.$preConnect();

        this.$Elements.labelMin = <HTMLLabelElement>document.createElement("label");
        this.LabelMin.textContent = String(this.Min);
        this.$Elements.labelMin.id="min";

        this.$Elements.labelMax = <HTMLLabelElement>document.createElement("label");
        this.LabelMax.textContent = String(this.Max);
        this.$Elements.labelMax.id="max";

        this.$Elements.inputMin = <HTMLInputElement>document.createElement("input");
        this.$Elements.inputMin.setAttribute("type","range");
        this.$Elements.inputMin.id="min";

        this.$Elements.inputMax = <HTMLInputElement>document.createElement("input");
        this.$Elements.inputMax.setAttribute("type","range");
        this.$Elements.inputMax.id="max";

        this.$Elements.div = <HTMLDivElement>document.createElement("div");

        this.$Elements.div.appendChild(this.$Elements.inputMin);
        this.$Elements.div.appendChild(this.$Elements.inputMax);

        this.appendChild(this.$Elements.labelMin);
        this.appendChild(this.$Elements.div);
        this.appendChild(this.$Elements.labelMax);
    }

    protected $alwaysConnect(): void {
        super.$alwaysConnect();
        this.InputMin.oninput = (event: InputEvent): void => {
            this.SelectedMin = Number(this.InputMin.value);
        };
        this.InputMax.oninput = (event: InputEvent): void => {
            this.SelectedMax = Number(this.InputMax.value);
        };
    }

    public setMinMax(min: number, max: number): void {
        this.min = Math.min(min,max);
        this.max = Math.max(min,max);

        this.InputMin.setAttribute("min",String(this.Min));
        this.InputMin.setAttribute("max",String(this.Max));
        this.InputMin.value = String(this.Min);

        this.InputMax.setAttribute("min",String(this.Min));
        this.InputMax.setAttribute("max",String(this.Max));
        this.InputMax.value = String(this.Max);
    }

    public get InputMax(): HTMLInputElement {
        return <HTMLInputElement>this.$Elements.inputMax;
    }

    public get InputMin(): HTMLInputElement {
        return <HTMLInputElement>this.$Elements.inputMin;
    }

    public get LabelMax(): HTMLLabelElement {
        return <HTMLLabelElement>this.$Elements.labelMax;
    }

    public get LabelMin(): HTMLLabelElement {
        return <HTMLLabelElement>this.$Elements.labelMin;
    }

    public get SelectedMax(): number {
        return Math.max(Number(this.InputMin.value),Number(this.InputMax.value));
    }

    public set SelectedMax(valMax: number) {
        /*
        const valMin: number = Number(this.InputMin.value);
        if (!(valMax>=valMin)){
            valMax = valMin;
            this.InputMax.value = String(valMax);
        }
        this.LabelMax.textContent = String(valMax);
        */
        const valMin: number = Number(this.InputMin.value);
        if (!(valMax>=valMin)){
            this.SelectedMin = valMax;
        }
        if (Number(this.InputMax.value) !== valMax) {
            this.InputMax.value = String(valMax);
        }
        this.LabelMax.textContent = String(valMax);
    }

    public get SelectedMin(): number {
        return Math.min(Number(this.InputMin.value),Number(this.InputMax.value));
    }

    public set SelectedMin(valMin: number) {
        /*
        const valMax: number = Number(this.InputMax.value);
        if (!(valMin<=valMax)){
            valMin = valMax;
            this.InputMin.value = String(valMin);
        }
        this.LabelMin.textContent = String(valMin);
        */
        const valMax: number = Number(this.InputMax.value);
        if (!(valMin<=valMax)){
            this.SelectedMax = valMin;
        }
        if (Number(this.InputMin.value) !== valMin) {
            this.InputMin.value = String(valMin);
        }
        this.LabelMin.textContent = String(valMin);

    }

    public get Max(): number {
        return Math.max(this.min,this.max);
    }

    public get Min(): number {
        return Math.min(this.min,this.max);
    }

}

customElements.define("dual-range", DualRange);
