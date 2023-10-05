import { RackNode } from "@Frontend/AS/RackNode";
import { ASCSS } from "./ASCSS";
import { ASModal } from "./ASModal";

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

export class ASModalRack extends ASModal {
    private rackNode: RackNode;

    constructor (args: {caption: string, rackNode: RackNode}){
        super(args);
        this.rackNode = args.rackNode;
    }

    protected $preConnect(): void {
        super.$preConnect();
        const labelTitle: HTMLDivElement = <HTMLDivElement>document.createElement("div");
        labelTitle.classList.add("label");
        labelTitle.textContent = "Title:";
        this.$Elements.title = <HTMLInputElement>document.createElement("input");

        this.$Elements.main.appendChild(labelTitle);
        this.$Elements.main.appendChild(this.$Elements.title);
    }

    protected $alwaysConnect(): void {
        super.$alwaysConnect();
        this.Title.value = this.rackNode.Title;
    }

    static showFromNode(rackNode: RackNode, caption: string): ASModalRack {
        return new ASModalRack({rackNode: rackNode, caption: caption}).show();
    }

    public show(): ASModalRack {
        return <ASModalRack>super.show();
    }

    public get Id(): number {
        return this.rackNode.Id;
    }

    public get Title(): HTMLInputElement {
        return <HTMLInputElement>this.$Elements.title;
    }

    public okAction(): void{
        this.rackNode.Title = this.Title.value;
    }
}

customElements.define("as-modal-rack", ASModalRack);

