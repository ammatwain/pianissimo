import { ASCore } from "./AS";

const $ms: number = 24;

ASCore.CSS["AS-NODE"] = {
    "AS-NODE": {
        "display": "grid",
        "grid-template-rows": `${$ms}px 1fr`,
        ">.header":{
            "display": "grid",
            "grid-template-columns": `auto ${$ms}px ${$ms}px minmax(${$ms * 4}px, 1fr) ${$ms}px ${$ms*4}px`,
            "max-height": `${$ms}px`,
            "min-height": `${$ms}px`,
            "padding-bottom": `${$ms/12}px`,
        },
        ">.children":{
            "display": "block",
            "min-height":"0px",
        },

    },
};


export class ASNode extends ASCore {
    protected preConnect(): void{
        this.Elements.header = document.createElement("div");
        this.Elements.header.classList.add("header");
        this.Elements.children = document.createElement("div");
        this.Elements.children.classList.add("children");
    }

    protected connect(): void{
        this.appendChild(this.Elements.header);
        this.appendChild(this.Elements.children);
    }

    public addNode(node: ASNode): ASNode {
        return this.Elements.children.appendChild(node);
    }

    /**
     * Get an array of children ASNode
     */
    public get Children(): ASNode[] {
        const nodes: ASNode[] = [];
        if (this.Elements && this.Elements.children && this.Elements.children.children) {
            for ( let i: number = 0 ; i < this.Elements.children.children.length ; i++ ) {
                try {
                    if (this.Elements.children.children.item(i) instanceof ASNode) {
                        nodes.push(<ASNode>this.Elements.children.children.item(i));
                    }
                } catch {
                    console.log("BAD Elements.children");
                }
            }
        }
        return nodes;
    }

    public get Closed(): boolean {
        return this.Elements.children.style.height==="0px";
    }

    public set Closed(closed: boolean) {
        if (closed) {
            this.Elements.children.style.height = "0px";
        } else {
            this.Elements.children.style.height = null;
        }
    }

    /**
     * get the first child node
     */
    public get FirstChild(): ASNode {
        if (this.Children.length) {
            return this.Children[0];
        } else {
            return null;
        }
    }

    /**
     * get the last child node
     */
    public get LastChild(): ASNode {
        if (this.Children.length) {
            return this.Children[this.Children.length-1];
        } else {
            return null;
        }
    }

    /**
     * Get the ASNode parent, if exists
     */
    public get Parent(): ASNode {
        if (this.parentElement.parentElement instanceof ASNode) {
            return this.parentElement.parentElement;
        } else {
            return null;
        }
    }

    /**
     * Return node Level
     * Root = 0
     * Children = x +1
     */
    public get Level(): number {
        if (this.Parent) {
            return this.Parent.Level + 1;
        } else {
            return 0;
        }
    }

    /**
     * Get the Root ASNode, or it self, if not exists
     */
    public get Root(): ASNode {
        if (this.Parent) {
            return this.Parent.Root;
        } else {
            return this;
        }
    }

}

customElements.define("as-node", ASNode);
