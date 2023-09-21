import { RackNode } from "@Frontend/AS/RackNode";
import { ASCSS } from "./ASCSS";
import { AS, ASCore } from "./ASCore";
import { ASModal } from "./ASModal";
import { ScoreNode } from "./ScoreNode";

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
        this.scoreNode = args.scoreNode;
    }

    protected $preConnect(): void {
        super.$preConnect();
        const labelTitle = <HTMLDivElement>document.createElement("div");
        labelTitle.classList.add("label");
        labelTitle.textContent = "Title:";
        this.$Elements.title = <HTMLInputElement>document.createElement("input");

        const labelSubtitle = <HTMLDivElement>document.createElement("div");
        labelSubtitle.classList.add("label");
        labelSubtitle.textContent = "Subtitle:";
        this.$Elements.subtitle = <HTMLInputElement>document.createElement("input");

        const labelAuthor = <HTMLDivElement>document.createElement("div");
        labelAuthor.classList.add("label");
        labelAuthor.textContent = "Author:";
        this.$Elements.author = <HTMLInputElement>document.createElement("input");

        const labelMainKey = <HTMLDivElement>document.createElement("div");
        labelMainKey.classList.add("label");
        labelMainKey.textContent = "Main Key:";
        this.$Elements.mainKey = <HTMLInputElement>document.createElement("input");
        this.$Elements.mainKey.setAttribute("type","number");
        this.$Elements.mainKey.setAttribute("min","-7");
        this.$Elements.mainKey.setAttribute("max","7");

        const labelMeasures = <HTMLDivElement>document.createElement("div");
        labelMeasures.classList.add("label");
        labelMeasures.textContent = "Measures:";
        this.$Elements.measures = <HTMLInputElement>document.createElement("input");

        const labelParts = <HTMLDivElement>document.createElement("div");
        labelParts.classList.add("label");
        labelParts.textContent = "Parts:";
        this.$Elements.parts = <HTMLInputElement>document.createElement("input");

        this.$Elements.main.appendChild(labelTitle);
        this.$Elements.main.appendChild(this.$Elements.title);
 
        this.$Elements.main.appendChild(labelSubtitle);
        this.$Elements.main.appendChild(this.$Elements.subtitle);
 
        this.$Elements.main.appendChild(labelAuthor);
        this.$Elements.main.appendChild(this.$Elements.author);

        this.$Elements.main.appendChild(labelMainKey);
        this.$Elements.main.appendChild(this.$Elements.mainKey);

        this.$Elements.main.appendChild(labelMeasures);
        this.$Elements.main.appendChild(this.$Elements.measures);

        this.$Elements.main.appendChild(labelParts);
        this.$Elements.main.appendChild(this.$Elements.parts);
    }

    protected $alwaysConnect(): void {
        super.$alwaysConnect();
        this.Title.value = this.scoreNode.Title;
        this.Subtitle.value = this.scoreNode.Subtitle;
        this.Author.value = this.scoreNode.Author;
        this.MainKey.value = String(this.scoreNode.MainKey);
        this.Measures.value = String(this.scoreNode.Measures);
        this.Parts.value = this.scoreNode.Parts;
    }

    static showFromNode(scoreNode: ScoreNode, caption: string): ASModalScore {
        const modal: ASModalScore = new ASModalScore({scoreNode: scoreNode, caption: caption});
        document.body.appendChild(modal);
        return modal;
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

    public get MainKey(): HTMLInputElement {
        return <HTMLInputElement>this.$Elements.mainKey;
    }

    public get Measures(): HTMLInputElement {
        return <HTMLInputElement>this.$Elements.measures;
    }

    public get Parts(): HTMLInputElement {
        return <HTMLInputElement>this.$Elements.parts;
    }

    public okAction(): void{
        this.scoreNode.Title = this.Title.value;
    }
}

customElements.define("as-modal-score", ASModalScore);

