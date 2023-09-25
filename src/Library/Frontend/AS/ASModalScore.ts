import { RackNode } from "@Frontend/AS/RackNode";
import { ASCSS } from "./ASCSS";
import { AS, ASCore } from "./ASCore";
import { ASModal } from "./ASModal";
import { ScoreNode } from "./ScoreNode";
import { MajorKeys } from "./MajorKeys";
import { DualRange } from "./DualRange";
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
    private scoreNode: ScoreNode;

    constructor (args: {caption: string, scoreNode: ScoreNode}){
        super(args);
    }

    protected $preConnect(): void {
        if (!this.$Argument.scoreNode) {
            throw new Error("TScoreNode must be passed in argument string");
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
/*
        const labelMainKey: HTMLDivElement = <HTMLDivElement>document.createElement("div");
        labelMainKey.classList.add("label");
        labelMainKey.textContent = "Main Key:";
        this.$Elements.mainKey = new MajorKeys({boxType:"radio"});
*/
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
        this.$Elements.measures = new DualRange(1,this.ScoreNode.Measures);

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
/*
        this.$Elements.main.appendChild(labelMainKey);
        this.$Elements.main.appendChild(this.$Elements.mainKey);
*/
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
        this.Title.value = this.ScoreNode.Title;
        this.Subtitle.value = this.ScoreNode.Subtitle;
        this.Author.value = this.ScoreNode.Author;
        this.PracticeKeys.Values = this.ScoreNode.DefaultSheet.PracticeKeys;
        //this.PracticeKeys.Disabled = [this.ScoreNode.MainKey];
        this.syncCheckBoxes();
        console.log("MEASURES", this.ScoreNode.Measures);
        this.Measures.value = String(this.ScoreNode.Measures);
        this.Parts.Parts = this.ScoreNode.Parts;
        this.PracticeKeys.doClick = (): void => {
            this.syncCheckBoxes();
        };
    }

    private syncCheckBoxes(): void{
        //if (!this.PracticeKeys.Disabled.length) {
            this.PracticeKeys.Disabled = [this.ScoreNode.MainKey];
            this.PracticeKeys.Check = [this.ScoreNode.MainKey];// this.ScoreNode.DefaultSheet.PracticeKeys;
        //}
        this.ActiveKeys.Enabled = this.PracticeKeys.Values;

        if(this.ActiveKeys.Value === null) {
            this.ActiveKeys.Value = this.ScoreNode.MainKey;
        }
    }

    static showFromNode(scoreNode: ScoreNode, caption: string): ASModalScore {
        return new ASModalScore({scoreNode: scoreNode, caption: caption}).show();
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

    public get Measures(): HTMLInputElement {
        return <HTMLInputElement>this.$Elements.measures;
    }

    public get PracticeKeys(): MajorKeys {
        return <MajorKeys>this.$Elements.practiceKeys;
    }

    public get ScoreNode(): ScoreNode {
        return <ScoreNode>this.$Argument.scoreNode;
    }

    public get ActiveKeys(): MajorKeys {
        return <MajorKeys>this.$Elements.activeKey;
    }

    public get Parts(): PartStaveSelector {
        return <PartStaveSelector>this.$Elements.parts;
    }

    public okAction(): void{
        this.ScoreNode.Title = this.Title.value;
        this.ScoreNode.Subtitle = this.Subtitle.value;
        this.ScoreNode.Author = this.Author.value;
        this.ScoreNode.DefaultSheet.PracticeKeys = this.PracticeKeys.Values;
        console.log(this.ScoreNode.DefaultSheet.PracticeKeys);
    }
}

customElements.define("as-modal-score", ASModalScore);

