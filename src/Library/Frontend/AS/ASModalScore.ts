import { RackNode } from "@Frontend/AS/RackNode";
import { ASCSS } from "./ASCSS";
import { AS, ASCore } from "./ASCore";
import { ASModal } from "./ASModal";
import { SheetNode } from "./SheetNode";
import { ScoreNode } from "./ScoreNode";
import { MajorKeys } from "./MajorKeys";
import { MeasureRange } from "./MeasureRange";
import { PartStaveSelector } from "./PartStaveSelector";

ASCSS.ASModalRack = {
    ">.window":{
        ">.header": {
            ">.caption":{
            },
            ">.cancel-icon":{
            },
        },
        ">.main":{
            ">input":{
                "min-width":"64ch",
            }
        },
        ">.footer":{
            ">button":{
            },
        },
    },
    ".visible":{
    }
};

export class ASModalScore extends ASModal {

    constructor (args: {caption: string, scoreNode: ScoreNode, sheetNode: SheetNode }){
        super(args);
    }

    protected $preConnect(): void {
        if (!(
            this.$Argument.scoreNode &&
            this.$Argument.sheetNode && (
                this.$Argument.scoreNode instanceof ScoreNode ||
                this.$Argument.sheetNode instanceof SheetNode
            )
        )) {
            throw new Error("TScoreNode or TSheetNode  must be passed in argument string");
        }
        super.$preConnect();
        const labelTitle: HTMLDivElement = <HTMLDivElement>document.createElement("div");
        labelTitle.classList.add("label");
        labelTitle.textContent = "Title:";
        this.$Elements.title = <HTMLInputElement>document.createElement("input");

        const labelSubtitle: HTMLDivElement = <HTMLDivElement>document.createElement("div");
        labelSubtitle.classList.add("label");
        labelSubtitle.textContent = "Subtitle:";
        this.$Elements.subtitle = <HTMLInputElement>document.createElement("input");

        const labelAuthor: HTMLDivElement = <HTMLDivElement>document.createElement("div");
        labelAuthor.classList.add("label");
        labelAuthor.textContent = "Author:";
        this.$Elements.author = <HTMLInputElement>document.createElement("input");

        const labelPracticeKeys: HTMLDivElement = <HTMLDivElement>document.createElement("div");
        labelPracticeKeys.classList.add("label");
        labelPracticeKeys.innerHTML = "Practice Keys: <em>(MainKey is unselectable)</em>";
        this.$Elements.practiceKeys = new MajorKeys({boxType:"checkbox"});

        const labelActiveKey: HTMLDivElement = <HTMLDivElement>document.createElement("div");
        labelActiveKey.classList.add("label");
        labelActiveKey.textContent = "Active Key:";
        this.$Elements.activeKey = new MajorKeys({boxType:"radio"});

        const labelMeasures: HTMLDivElement = <HTMLDivElement>document.createElement("div");
        labelMeasures.classList.add("label");
        labelMeasures.textContent = "Measures:";
        this.$Elements.measures = new MeasureRange(this.ScoreNode.Measures);

        const labelParts: HTMLDivElement = <HTMLDivElement>document.createElement("div");
        labelParts.classList.add("label");
        labelParts.textContent = "Parts:";
        this.$Elements.parts = new PartStaveSelector();

        this.$Elements.main.appendChild(labelTitle);
        this.$Elements.main.appendChild(this.$Elements.title);

        this.$Elements.main.appendChild(labelSubtitle);
        this.$Elements.main.appendChild(this.$Elements.subtitle);

        this.$Elements.main.appendChild(labelAuthor);
        this.$Elements.main.appendChild(this.$Elements.author);

        this.$Elements.main.appendChild(labelPracticeKeys);
        this.$Elements.main.appendChild(this.$Elements.practiceKeys);

        this.$Elements.main.appendChild(labelActiveKey);
        this.$Elements.main.appendChild(this.$Elements.activeKey);

        this.$Elements.main.appendChild(labelMeasures);
        this.$Elements.main.appendChild(this.$Elements.measures);

        this.$Elements.main.appendChild(labelParts);
        this.$Elements.main.appendChild(this.$Elements.parts);
    }

    protected $alwaysConnect(): void {
        super.$alwaysConnect();
        if (this.SheetNode.Sequence === 0) {
            this.Title.value = this.ScoreNode.Title;
            this.Subtitle.value = this.ScoreNode.Subtitle;
        } else {
            this.Title.value = this.SheetNode.Title;
            this.Subtitle.value = this.SheetNode.Subtitle;
        }
        this.Author.value = this.ScoreNode.Author;
        this.PracticeKeys.setChecked(this.SheetNode.PracticeKeys,true);
        this.syncCheckBoxes();
        this.Measures.MeasureStart = this.SheetNode.MeasureStart;
        this.Measures.MeasureEnd = this.SheetNode.MeasureEnd;
        this.Parts.Parts = this.ScoreNode.Parts;
        this.PracticeKeys.doClick = (): void => {
            this.syncCheckBoxes();
        };
    }

    private syncCheckBoxes(): void{
        this.PracticeKeys.setDisabled([this.ScoreNode.MainKey],true);
        this.PracticeKeys.setChecked([this.ScoreNode.MainKey],false);

        this.ActiveKey.setEnabled(this.PracticeKeys.Values);

        if (
            this.ScoreNode.DefaultSheet.ActiveKey !== null &&
            this.ActiveKey.Enabled.includes(this.ScoreNode.DefaultSheet.ActiveKey)
        ) {
            this.ActiveKey.Value = this.ScoreNode.DefaultSheet.ActiveKey;
        } else {
            this.ActiveKey.Value = this.ScoreNode.MainKey;
        }
    }

    static showFromNode(node: ScoreNode | SheetNode, caption: string): ASModalScore {
        let scoreNode: ScoreNode;
        let sheetNode: SheetNode;
        if (node instanceof ScoreNode || node instanceof SheetNode) {
            if (node instanceof ScoreNode) {
                scoreNode = node;
                sheetNode = scoreNode.DefaultSheet;
            } else if (node instanceof SheetNode) {
                sheetNode = node;
                scoreNode = sheetNode.ParentScore;
            }
            return new ASModalScore({scoreNode: scoreNode, sheetNode: sheetNode, caption: caption}).show();
        }
        return null;
    }

    public show(): ASModalScore {
        return <ASModalScore>super.show();
    }

    public get Id(): number {
        return this.ScoreNode.Id;
    }

    public get Title(): HTMLInputElement {
        return <HTMLInputElement>this.$Elements.title;
    }

    public get Subtitle(): HTMLInputElement {
        return <HTMLInputElement>this.$Elements.subtitle;
    }

    public get Author(): HTMLInputElement {
        return <HTMLInputElement>this.$Elements.author;
    }

    public get MainKey(): MajorKeys {
        return <MajorKeys>this.$Elements.mainKey;
    }

    public get Measures(): MeasureRange {
        return <MeasureRange>this.$Elements.measures;
    }

    public get PracticeKeys(): MajorKeys {
        return <MajorKeys>this.$Elements.practiceKeys;
    }

    public get ScoreNode(): ScoreNode {
        return <ScoreNode>this.$Argument.scoreNode;
    }

    public get SheetNode(): SheetNode {
        return <SheetNode>this.$Argument.sheetNode;
    }

    public get ActiveKey(): MajorKeys {
        return <MajorKeys>this.$Elements.activeKey;
    }

    public get Parts(): PartStaveSelector {
        return <PartStaveSelector>this.$Elements.parts;
    }

    public okAction(): void{
        this.ScoreNode.Author = this.Author.value;
        if (this.ScoreNode.Sequence===0) {
            this.ScoreNode.Title = this.Title.value;
            this.ScoreNode.Subtitle = this.Subtitle.value;
        }
        this.SheetNode.Title = this.Title.value;
        this.SheetNode.Subtitle = this.Subtitle.value;
        this.SheetNode.PracticeKeys = this.PracticeKeys.Checked;
        this.SheetNode.ActiveKey = this.ActiveKey.Value;
        this.SheetNode.MeasureStart = this.Measures.MeasureStart;
        this.SheetNode.MeasureEnd = this.Measures.MeasureEnd;
        this.SheetNode.HiddenParts = this.Parts.HiddenParts;
    }
}

customElements.define("as-modal-score", ASModalScore);

