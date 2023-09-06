import { ASCore } from "./AS";

const $ms: number = 24;

ASCore.CSS["AS-NODE"] = {
    "AS-NODE": {
        "background-color":"transparent",
        "cursor":"pointer",
        "display": "grid",
        "gap":`${$ms/12}px`,
        "grid-template-rows": "auto 1fr",
        "user-select": "none",
        ">.header":{
            "display": "grid",
            "grid-template-columns": `auto ${$ms}px ${$ms}px minmax(${$ms * 4}px, 1fr) ${$ms}px ${$ms*4}px`,
            "max-height": `${$ms}px`,
            "min-height": `${$ms}px`,
            ">.spacer":{
                "display": "inline-block",
            },
            ">.switcher":{
                "background-color":"inherited",
                "border-radius":"50%",
                "box-sizing":"border-box",
                "display": "inline-block",
                "vertical-align": "middle",
                "max-height": `${$ms}px`,
                "max-width": `${$ms}px`,
                "min-height": `${$ms}px`,
                "min-width": `${$ms}px`,
                ">svg":{
                    "transition": "all 100ms ease-out",
                    "transform":"rotate(0deg)",
                },
            },
            ">.checkbox":{
                "background-color":"inherited",
                "border": `${$ms/12}px solid rgba(0,0,0,0.5)`,
                "border-radius":"50%",
                "box-sizing":"border-box",
                "display": "inline-block",
                "max-height": `${$ms}px`,
                "max-width": `${$ms}px`,
                "min-height": `${$ms}px`,
                "min-width": `${$ms}px`,
                "vertical-align": "middle",
                ":hover":{
                    "box-shadow": "0 0 2px 2px #666;",
                },
            },
            ">.label":{
                "display": "inline-block",
                "max-height": `${$ms}px`,
                "min-height": `${$ms}px`,
                "line-height": `${$ms}px`,
                "overflow":"hidden",
                "padding-left": `${$ms/4}px`,
                "padding-right": `${$ms/4}px`,
                "text-overflow": "ellipsis",
                "vertical-align": "middle",
                "white-space":"nowrap",
            },
            ">.edit":{
                "display": "inline-block",
                "max-height": `${$ms}px`,
                "min-height": `${$ms}px`,
                "vertical-align": "middle",
            },
            ">.percent":{
                "background-color":"red",
                "border-radius":`${$ms/2}px`,
                "display": "inline-block",
                "line-height": `${$ms}px`,
                "max-height": `${$ms}px`,
                "min-height": `${$ms}px`,
                "text-align": "center",
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


const $_TRIANGLE: string = ""
+ "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 160 160\">"
+ "<circle cx=\"80\" cy=\"80\" r=\"60\" style=\"opacity:.2;fill:#000;fill-opacity:1;stroke-width:2.00979\"/>"
+  "<path id=\"arrow\" d=\"M38.43 56h83.14L80 128Z\" style=\"fill:#000;stroke-width:1.99844\"/>"
+"</svg>";

const $_SWITCHER: string = ""
+ "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 160 160\">"
+ "<circle cx=\"80\" cy=\"80\" r=\"60\" style=\"opacity:0;fill:#000;fill-opacity:1;stroke-width:2.00979\"/>"
+ "<path id=\"arrow\" d=\"M38.43 56 80 80l41.57-24L80 128Z\" style=\"fill:#66F;stroke-width:1.99844\"/>"
+ "</svg>";

const $_RADIO: string = ""
+ "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 160 160\">"
+ "<path id=\"check\" "
+ "d=\"m34.038 80 35.355 35.355 56.569-56.568-14.142-14.142L69.393 87.07 48.18 65.858Z\" "
+ "style=\"opacity:1;fill:#000;fill-opacity:1;stroke-width:2.66457\"/>"
+ "</svg>";

export class ASNode extends ASCore {
    protected preConnect(): void{

        if(this.$.args.adoptable && this.$.args.adoptable===false){
            this.$.kinds.adoptable = false;
        } else {
            this.$.kinds.adoptable = true;
        }

        if(this.$.args.canAdopt && this.$.args.canAdopt===false){
            this.$.kinds.canAdopt = false;
        } else {
            this.$.kinds.canAdopt = true;
        }

        if(this.$.args.caption && this.$.args.caption !== ""){
            this.$.props.caption = this.$.args.caption;
        } else {
            this.$.props.caption = "";
        }

        if(this.$.args.percent && this.$.args.percent !== null){
            this.$.props.percent = Number(this.$.args.percent);
        } else {
            this.$.props.percent = 0;
        }

        this.setAttribute("draggable","true");
        this.classList.add("closed");

        this.$.props.selected = null;
        this.$.props.percent = 0;
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

        this.Caption = this.$.props.caption;
        this.Percent = this.$.props.percent;

        this.Elements.arrow = this.Elements.switcher.querySelector("svg>path#arrow");
        this.Elements.check = this.Elements.checkbox.querySelector("svg>path#check");
        this.Elements.check.style.fillOpacity = String(0);
        this.Elements.items = document.createElement("div");
        this.Elements.items.classList.add("children");
        this.Elements.items.innerHTML = this.$.originalHtml;

        this.$.props.dragTarget = null;
        this.$.props.dropTarget = null;
    }

    protected connect(): void{
        this.appendChild(this.Elements.header);
        this.appendChild(this.Elements.items);
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

        this.ondragenter = (event: DragEvent): void => {
            const dragTarget: ASNode = this.DragTarget;
            const dropTarget: ASNode = <ASNode>event.currentTarget;
            if (
                dragTarget &&
                dropTarget instanceof ASNode &&
                dragTarget !== dropTarget &&
                dragTarget.Parent !== dropTarget &&
                dropTarget.isNotChildOf(dragTarget)
            ) {
                this.DropTarget = dropTarget;
                console.log("ON DRAG ENTER", dragTarget.Caption, dropTarget.Caption)
                event.stopImmediatePropagation();
            } else {
                event.stopImmediatePropagation();
                this.DropTarget = null;
            }
        };

        this.ondragleave = (event: DragEvent): void => {
            const leaved: ASNode = <ASNode>event.currentTarget;
            if (
                leaved instanceof ASNode &&
                leaved !== this.DragTarget
            ) {
                event.stopImmediatePropagation();
                leaved.style.backgroundColor = "";

            }
        };

        this.ondragstart = (event: DragEvent): void =>{
            event.stopImmediatePropagation();
            const dropTarget: ASNode = <ASNode>event.target;
            if (
                dropTarget instanceof ASNode &&
                dropTarget === this &&
                this.DragTarget !== dropTarget
            ) {
                this.DragTarget = this;
                console.log("ON DRAG START", this.DragTarget)
            }
        }
    

    }

    public addNode(node: ASNode): ASNode {
        if (!this.Elements.items) {
            this.Elements.items = document.createElement("div");
            this.Elements.items.classList.add("children");
        }
        return this.Elements.items.appendChild(node);
    }

    private drawPercent(): void {
        this.Elements.percent.style.background = `linear-gradient(to right, rgba(0,0,0,0.666) ${this.Percent}%, rgba(0,0,0,0.333) ${this.Percent}%)`;
        this.Elements.percent.innerHTML = `${(this.Percent || 0 ).toFixed(0)}%`;
    }

    public isChildOf(node: ASNode): boolean {
        if (this.Parent) {
            if (this.Parent === node) {
                return true;
            } else {
                return this.Parent.isChildOf(node);
            }
        } else {
            return false;
        }
    }

    public isNotChildOf(node: ASNode): boolean {
        return !this.isChildOf(node);
    }

    public isNotParentOf(node: ASNode): boolean {
        return !node.isChildOf(this);
    }

    public isParentOf(node: ASNode): boolean {
        return node.isChildOf(this);
    }

    public toggleCheck(): boolean {
        this.Checked = !this.Checked;
        return this.Checked;
    }

    public get Adoptable(): boolean {
        return Boolean(this.$.kinds.adoptable);
    }

    public set Adoptable(adoptable: boolean) {
        this.$.kinds.adoptable = adoptable;
    }

    public get CanAdopt(): boolean {
        return Boolean(this.$.kinds.canAdopt);
    }

    public set CanAdopt(canAdopt: boolean) {
        this.$.kinds.canAdopt = canAdopt;
    }

    public get Caption(): string {
        return this.Elements.label.textContent;
    }

    public set Caption(caption: string) {
        this.Elements.label.textContent = caption;
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
        return (this.Items.length === 0) || this.classList.contains("closed");
    }

    public set Closed(closed: boolean) {
        if (!closed && this.Items.length>0) {
            this.classList.remove("closed");
        } else {
            this.classList.add("closed");
        }
    }

    public get DragTarget(): ASNode {
        return <ASNode>this.Root.$.props.dragTarget || null;
    }

    public set DragTarget(dragTarget: ASNode) {
        this.DropTarget = null;
        this.Root.$.props.dragTarget = dragTarget;
    }

    public get DropTarget(): ASNode {
        if (this.DragTarget){
            return <ASNode>this.Root.$.props.dropTarget;
        } else {
            return null;
        }
    }

    public set DropTarget(dropTarget: ASNode) {
        let oldDropTarget: ASNode = this.DropTarget;
        if  (this.DragTarget && dropTarget instanceof ASNode) {
            this.Root.$.props.dropTarget = dropTarget;
        } else {
            this.Root.$.props.dropTarget = null;
        }
        if (oldDropTarget!==this.DropTarget) {
            if (oldDropTarget instanceof ASNode) {
                oldDropTarget.Elements.header.style.backgroundColor = "";
            }
            if (this.DropTarget instanceof ASNode) {
                this.DropTarget.Elements.header.style.backgroundColor = "yellow";
            }
            console.log("DROP TARGET", this.DropTarget);
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

    /**
     * Get an array of children ASNode
     */
    public get Items(): ASNode[] {
        const nodes: ASNode[] = [];
        if (this.Elements && this.Elements.items && this.Elements.items.children) {
            for ( let i: number = 0 ; i < this.Elements.items.children.length ; i++ ) {
                try {
                    if (this.Elements.items.children.item(i) instanceof ASNode) {
                        nodes.push(<ASNode>this.Elements.items.children.item(i));
                    }
                } catch {
                    console.log("BAD Elements.items");
                }
            }
        }
        return nodes;
    }

    public get Percent(): number {
        if (this.Items.length) {
            const total: number = this.Items.length * 100;
            let accumulator: number = 0;
            this.Items.forEach((item: ASNode)=>{
                accumulator += item.Percent;
            });
            if (accumulator>0 && total>0) {
                this.$.props.percent = ( accumulator / total ) * 100;
            } else {
                this.$.props.percent = 0;
            }
        }
        return this.$.props.percent;
    }

    public set Percent(percentValue: number) {
        this.$.props.percent = percentValue || 0;
        if (this.$.props.percent < 0) {
            this.$.props.percent = 0;
        } else if (this.$.props.percent > 100){
            this.$.props.percent = 100;
        }
        this.drawPercent();
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
        if (this.Items.length) {
            return this.Items[0];
        } else {
            return null;
        }
    }

    /**
     * get the last child node
     */
    public get LastChild(): ASNode {
        if (this.Items.length) {
            return this.Items[this.Items.length-1];
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
