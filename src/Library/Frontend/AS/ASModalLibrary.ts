import { LibraryNode } from "@Frontend/AS/LibraryNode";
import { ASCSS } from "./ASCSS";
import { AS, ASCore } from "./ASCore";
import { ASModal } from "./ASModal";

ASCSS.ASModalLibrary = {
    ">.window":{
        ">.header": {
            ">.caption":{
            },
            ">.cancel-icon":{
            },
        },
        ">.main":{
        },
        ">.footer":{
            ">button":{
            },
        },
    },
    ".visible":{
    }
};

export class ASModalLibrary extends ASModal {
    private libraryNode: LibraryNode;

    constructor (args: {caption: string, libraryNode: LibraryNode}){
        super(args);
        this.libraryNode = args.libraryNode;
    }

    protected $preConnect(): void {
        super.$preConnect();
        const labelTitle: HTMLDivElement = (<HTMLDivElement>document.createElement("div"));
        labelTitle.classList.add("label");
        labelTitle.textContent = "Title:";
        this.$Elements.title = <HTMLInputElement>document.createElement("input");

        this.$Elements.main.appendChild(labelTitle);
        this.$Elements.main.appendChild(this.$Elements.title);
    }

    protected $alwaysConnect(): void {
        super.$alwaysConnect();
        this.Title.value = this.libraryNode.Title;
    }

    static showFromNode(libraryNode: LibraryNode, caption: string): ASModalLibrary {
        return new ASModalLibrary({libraryNode: libraryNode, caption: caption}).show();
    }

    public show(): ASModalLibrary {
        return <ASModalLibrary>super.show();
    }


    public get Title(): HTMLInputElement {
        return <HTMLInputElement>this.$Elements.title;
    }

    public okAction(): void{
        this.libraryNode.Title = this.Title.value;
    }
}

customElements.define("as-modal-library", ASModalLibrary);

