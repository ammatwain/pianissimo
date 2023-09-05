import { ASCore } from "./AS";

const $ms: number = 24;

ASCore.CSS["AS-NODE"] = {
    "AS-NODE": {
        "background-color":"transparent",
        "cursor":"pointer",
        "display": "grid",
        "grid-template-rows": "auto 1fr",
        "gap":`${$ms/12}px`,
        ">.header":{
            "display": "grid",
            "grid-template-columns": `auto ${$ms}px ${$ms}px minmax(${$ms * 4}px, 1fr) ${$ms}px ${$ms*4}px`,
            "max-height": `${$ms}px`,
            "min-height": `${$ms}px`,
            ">.spacer":{
                "display": "inline-block",
            },
            ">.switcher":{
                "display": "inline-block",
                "vertical-align": "middle",
                "max-height": `${$ms}px`,
                "max-width": `${$ms}px`,
                "min-height": `${$ms}px`,
                "min-width": `${$ms}px`,
                ">svg":{
                    "transition": "all 100ms ease-out",
                    "transform":"rotate(0deg)",
                }
            },
            ">.checkbox":{
                "display": "inline-block",
                "max-height": `${$ms}px`,
                "max-width": `${$ms}px`,
                "min-height": `${$ms}px`,
                "min-width": `${$ms}px`,
                "vertical-align": "middle",
            },
            ">.label":{
                "display": "inline-block",
                "max-height": `${$ms}px`,
                "min-height": `${$ms}px`,
                "line-height": `${$ms}px`,
                "vertical-align": "middle",
            },
            ">.edit":{
                "display": "inline-block",
                "max-height": `${$ms}px`,
                "min-height": `${$ms}px`,
                "vertical-align": "middle",
            },
            ">.percent":{
                "display": "inline-block",
                "max-height": `${$ms}px`,
                "min-height": `${$ms}px`,
                "vertical-align": "middle",
            },
            ":hover":{
                "background-color":"rgb(0,0,0,0.1)",
            },
        },
        ">.children":{
            "display": "block",
            "min-height":"0px",
        },
        ".closed":{
            ">.header":{
                ">.switcher":{
                    ">svg":{
                        "transition": "all 100ms ease-out",
                        "transform":"rotate(-90deg)",
                    },
                },
            },
            ">.children":{
                "max-height":"0px",
                "overflow":"hidden",
            },
        },
    },
};

const $_SWITCHER: string = ""
+ "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 42.333 42.333\">"
+ "<circle cx=\"21.167\" cy=\"21.167\" r=\"15.875\" style=\"opacity:.2;fill:#000;fill-opacity:0.5;stroke-width:.531758\"/>"
+ "<path id=\"arrow\" d=\"M10.168 14.817h21.997l-10.998 19.05Z\" style=\"fill:#666;opacity;1;stroke-width:.528751\"/>"
+ "</svg>";

const $_RADIO: string = ""
+ "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 42.333 42.333\">"
+ "<path d=\"M80 10a70 70 0 0 0-70 70 70 70 0 0 0 70 70 70 70 0 0 0 70-70 70 70 0 0 0-70-70zm0 "
+ "10a60 60 0 0 1 60 60 60 60 0 0 1-60 60 60 60 0 0 1-60-60 60 60 0 0 1 60-60z\" "
+ "style=\"opacity:.2;fill:#000;fill-opacity:1;stroke-width:2.34476\" transform=\"scale(.26458)\"/>"
+ "<path id=\"check\" d=\"m9.006 21.167 9.354 9.354 14.967-14.967-3.741-3.742L18.36 23.038l-5.612-5.613z\" "
+ "style=\"fill:#000;fill-opacity:0;stroke-width:.705001\"/>"
+ "</svg>";

export class ASNode extends ASCore {
    protected preConnect(): void{
        this.setAttribute("draggable","true");
        this.classList.add("closed");
        this.$.props.selected = null;
        this.Elements.spacer = document.createElement("div");
        this.Elements.spacer.classList.add("spacer");
        this.Elements.switcher = document.createElement("div");
        this.Elements.switcher.classList.add("switcher");
        this.Elements.switcher.innerHTML = $_SWITCHER;
        this.Elements.checkbox = document.createElement("div");
        this.Elements.checkbox.classList.add("checkbox");
        this.Elements.checkbox.innerHTML = $_RADIO;
        this.Elements.label = document.createElement("div");
        this.Elements.label.classList.add("label");
        this.Elements.edit = document.createElement("div");
        this.Elements.edit.classList.add("edit");
        this.Elements.percent = document.createElement("div");
        this.Elements.percent.classList.add("percent");
        this.Elements.header = document.createElement("div");
        this.Elements.header.classList.add("header");

        this.Elements.header.appendChild(this.Elements.spacer);
        this.Elements.header.appendChild(this.Elements.switcher);
        this.Elements.header.appendChild(this.Elements.checkbox);
        this.Elements.header.appendChild(this.Elements.label);
        this.Elements.header.appendChild(this.Elements.edit);
        this.Elements.header.appendChild(this.Elements.percent);
        this.Elements.arrow = this.Elements.switcher.querySelector("svg>path#arrow");
        this.Elements.check = this.Elements.checkbox.querySelector("svg>path#check");
        this.Elements.children = document.createElement("div");
        this.Elements.children.classList.add("children");
        this.Elements.children.innerHTML = this.$.originalHtml;
    }

    protected connect(): void{
        this.appendChild(this.Elements.header);
        this.appendChild(this.Elements.children);
    }

    protected alwaysConnect(): void {
        if (this.Parent) {
            this.Parent.Elements.arrow.style.fill = "#000";
        }
        this.Elements.header.style.gridTemplateColumns = `${$ms * this.Level}px ${$ms}px ${$ms}px minmax(${$ms * 4}px, 1fr) ${$ms}px ${$ms*4}px`;
        this.Elements.switcher.onclick = (): void => {
            this.Closed = !this.Closed;
        };
        this.Elements.checkbox.onclick = (): void => {
            this.toggleCheck();
        };
        this.Elements.label.onclick = (): void => {
            this.toggleCheck();
        };
    }

    public addNode(node: ASNode): ASNode {
        if (!this.Elements.children) {
            this.Elements.children = document.createElement("div");
            this.Elements.children.classList.add("children");
        }
        return this.Elements.children.appendChild(node);
    }

    public toggleCheck(): boolean {
        this.Checked = !this.Checked;
        return this.Checked;
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

    public get Checked(): boolean {
        return this.Elements.check.style.fillOpacity === String(1);
    }

    public set Checked(checked: boolean) {
        if (checked) {
            if (this.Selected instanceof ASNode) {
                this.Selected.Checked = false;
            }
            this.Selected = this;
        }
        this.Elements.check.style.fillOpacity = String(Number(checked));
        if (this.Parent) {
            this.Parent.HalfChecked = checked;
        }
    }

    public get Closed(): boolean {
        return (this.Children.length === 0) || this.classList.contains("closed");
    }

    public set Closed(closed: boolean) {
        if (!closed && this.Children.length>0) {
            this.classList.remove("closed");
        } else {
            this.classList.add("closed");
        }
    }

    public get HalfChecked(): boolean {
        return this.Elements.check.style.fillOpacity === String(0.333);
    }

    public set HalfChecked(halfChecked: boolean) {
        if (halfChecked) {
            this.Elements.check.style.fillOpacity = String(0.333);
        } else {
            this.Elements.check.style.fillOpacity = String(0);
        }
        if (this.Parent) {
            this.Parent.HalfChecked = halfChecked;
        }
    }

    public get Selected(): ASNode {
        return <ASNode>this.Root.$.props.selected;
    }

    public set Selected(selected: ASNode) {
        this.Root.$.props.selected = selected;
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
