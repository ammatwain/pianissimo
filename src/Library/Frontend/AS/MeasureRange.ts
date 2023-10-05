import { ASCSS } from "./ASCSS";
import { ASCore } from "./ASCore";

ASCSS.MeasureRange = {
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
        "background":"linear-gradient(transparent 0px, transparent 11px, #888 12px, #888 13px, transparent 14px,transparent 24px)",
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
//                "appareance":"none",
//                "border": "1px solid #000000",
                "background-color":"#00f",
                "border-radius": "0%",
                "width":"24px",
                "height":"24px",
                "min-width":"24px",
                "min-height":"24px",
                "pointer-events":"all",
//                "-webkit-appearance":"none;",
            },
            "#min":{
                "left":"0px",
                "top":"0px",
//                "::-webkit-slider-thumb":{
//                    "border-top-left-radius": "50%",
//                    "border-bottom-left-radius": "50%",
//                }
            },
            "#max":{
                "left":"24px",
                "top":"0px",
//                "::-webkit-slider-thumb":{
//                    "border-top-right-radius": "50%",
//                    "border-bottom-right-radius": "50%",
//                }
            }
        },
    }
};

export class MeasureRange extends ASCore {
    private min: number = 0;
    private max: number = 100;
    private selectedMin: number = 100;
    private selectedMax: number = 0;
    constructor(max: number, measureStart: number = null, measureEnd: number = null) {
        super();

        this.setMax(max);

        if (!measureStart) {
            measureStart = this.Min;
        }
        if (!measureEnd) {
            measureEnd = this.Max;
        }
        this.MeasureStart = Math.min(measureStart,measureEnd);
        this.MeasureEnd = Math.max(measureStart,measureEnd);
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
            this.MeasureStart = Number(this.InputMin.value);
        };
        this.InputMax.oninput = (event: InputEvent): void => {
            this.MeasureEnd = Number(this.InputMax.value);
        };
    }

    public setMax(max: number): void {
        if(max<1) {
            throw new Error("Bad measure value");
        }
        this.min = 1;
        this.max = max;

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

    public get MeasureEnd(): number {
        return Math.max(Number(this.InputMin.value),Number(this.InputMax.value));
    }

    public set MeasureEnd(measureEnd: number) {
        const valMin: number = Number(this.InputMin.value);
        if (!(measureEnd>=valMin)){
            this.MeasureStart = measureEnd;
        }
        if (Number(this.InputMax.value) !== measureEnd) {
            this.InputMax.value = String(measureEnd);
        }
        this.LabelMax.textContent = String(measureEnd);
    }

    public get MeasureStart(): number {
        return Math.min(Number(this.InputMin.value),Number(this.InputMax.value));
    }

    public set MeasureStart(measureStart: number) {
        const valMax: number = Number(this.InputMax.value);
        if (!(measureStart<=valMax)){
            this.MeasureEnd = measureStart;
        }
        if (Number(this.InputMin.value) !== measureStart) {
            this.InputMin.value = String(measureStart);
        }
        this.LabelMin.textContent = String(measureStart);
    }

    public get Max(): number {
        return Math.max(this.min,this.max);
    }

    public get Min(): number {
        return Math.min(this.min,this.max);
    }

}

customElements.define("measure-range", MeasureRange);
