import { ASCSS } from "./ASCSS";
import { ASCore } from "./ASCore";

const $ms: number = 24;

const $_TRIANGLE: string = ""
+ "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 160 160\">"
+ "<circle cx=\"80\" cy=\"80\" r=\"60\" style=\"opacity:.2;fill:#000;fill-opacity:1;stroke-width:2.00979\"/>"
+  "<path id=\"arrow\" d=\"M38.43 56h83.14L80 128Z\" style=\"fill:#000;stroke-width:1.99844\"/>"
+"</svg>";

const $_SWITCHER: string = ""
+ "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 160 160\">"
+ "<circle cx=\"80\" cy=\"80\" r=\"60\" style=\"opacity:0;fill:#000;fill-opacity:1;stroke-width:2.00979\"/>"
+ "<path id=\"arrow\" d=\"M38.43 56 80 80l41.57-24L80 128Z\" style=\"fill:#000;stroke-width:1.99844\"/>"
+ "</svg>";

const $_EDIT: string = ""
+ "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 160 160\">"
+ "<path id=\"check\" "
+ "d=\"m 20.2 139.4 c -1.1 -5 2.6 -10.5 3.5 -15.7 c 2.5 -7.6 4.2 -15.6 8.2 -22.5 "
+ "c 25.1 -24.8 49.8 -49.9 75.2 -74.4 c 3.7 -3.7 8.2 -8.1 14 -6.3 c 5.8 2.1 9.5 7.7 13.9 11.7 "
+ "c 5.3 3.8 7.3 12.2 2.1 17 c -23.5 24.2 -47.6 47.8 -71.6 71.5 c -4.6 4.3 -8.9 9.5 -15.4 10.8 "
+ "c -9.7 3 -19.4 5.7 -29.1 8.5 z m 17.5 -8 c 7.4 -2.5 15.9 -3.5 21.4 -9.7 "
+ "c 19.2 -18.4 38 -37.4 56.9 -56.1 c -7.2 -7.1 -14.4 -14.3 -21.6 -21.4 "
+ "c -19.7 19.7 -39.7 39.1 -59 59.1 c -4.5 4.9 -5 11.9 -7.2 17.9 c -1.1 4.6 -3.2 9.3 -3.7 13.9 "
+ "c 4.4 -1.2 8.8 -2.5 13.2 -3.7 z m 89.5 -76.9 c 3.7 -4.4 11.2 -8.6 8.6 -15.4 "
+ "c -3.5 -5.6 -9 -9.8 -13.9 -14.1 c -6.4 -4.5 -11.3 3.8 -15.6 7.4 c -3.1 3.1 -6.3 6.2 -9.4 9.3 "
+ "c 7.2 7 14.1 14.4 21.6 21.1 c 3.1 -2.6 5.8 -5.5 8.7 -8.3 z\" "
+ "style=\"opacity:1;fill:#000;fill-opacity:1;stroke-width:2.66457\"/>"
+ "</svg>";

const $_PLUS: string = ""
+ "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 160 160\">"
+ "<path id=\"circle\" "
+ "d=\"m 80 10 a 70 70 0 0 0 -70 70 a 70 70 0 0 0 70 70 a 70 70 0 0 0 70 -70 a "
+ "70 70 0 0 0 -70 -70 z m 0 10 a 60 60 0 0 1 60 60 a 60 60 0 0 1 -60 60 a "
+ "60 60 0 0 1 -60 -60 a 60 60 0 0 1 60 -60 z\" "
+ "style=\"opacity:0.5;fill:#000;fill-opacity:1;stroke-width:2.66457\"/>"
+ "<path id=\"plus\" "
+ "d=\"m 75 35 l 0 40 l -40 0 l 0 10 l 40 0 l 0 40 l 10 0 l 0 -40 l 40 0 l 0 -10 l -40 0 l 0 -40 l -10 0 z\" "
+ "style=\"opacity:1;fill:#000;fill-opacity:1;stroke-width:2.66457\"/>"
+ "</svg>";

const $_RADIO: string = ""
+ "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 160 160\">"
+ "<path id=\"check\" "
+ "d=\"m34.038 80 35.355 35.355 56.569-56.568-14.142-14.142L69.393 87.07 48.18 65.858Z\" "
+ "style=\"opacity:1;fill:#000;fill-opacity:1;stroke-width:2.66457\"/>"
+ "</svg>";

ASCSS.ASNode = {
    "background-color":"transparent",
    "cursor":"pointer",
    "display": "grid",
    "font-size":`${$ms*0.6}px`,
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
            ">.caption":{
                "background-color":"transparent",
                "border-radius":`${$ms/4}px`,
                "display": "inline-block",
                "line-height":`${$ms}px`,
                "max-height": `${$ms}px`,
                "min-height": `${$ms}px`,
                "padding-left": `${$ms/4}px`,
                "padding-right": `${$ms/4}px`,
            },
        },
        ">.actions":{
            "box-sizing":"border-box",
            "max-height": `${$ms}px`,
            "min-height": `${$ms}px`,
            "opacity": "0",
            "transition": "all 100ms ease-out",
            "vertical-align": "middle",
            "white-space":"nowrap",
            ">i":{
                "border-radius":"50%",
                "display": "inline-block",
                "direction": "ltr",
                "filter": "invert(0%)",
                "font-family": "icons",
                "font-size": "24px",
                "font-style": "normal",
                "font-weight": "normal",
                "font-feature-settings": "liga",
                "font-smoothing": "antialiased",
                "letter-spacing": "normal",
                "line-height": "1",
                "max-height": `${$ms}px`,
                "max-width": `${$ms}px`,
                "min-height": `${$ms}px`,
                "min-width": `${$ms}px`,
                "opacity": "0.25",
                "text-transform": "none",
                "transition":"opacity .3s ease",
                "white-space": "nowrap",
                "word-wrap": "normal",
                "text-rendering": "optimizeLegibility",
                "-webkit-font-smoothing": "antialiased",
                ":hover":{
                    "opacity": "1",
                }
            }
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
            ">.label":{
                ">.caption":{
                    "background-color":"rgb(0,0,0,0.1)",
                },
            },
            ">.actions":{
                "opacity":"1",
            },
        },
    },
    ">.items":{
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
        ">.items":{
            "max-height":"0px",
            "overflow":"hidden",
        },
    },
};

export class ASNode extends ASCore {
    protected $preConnect(): void{
        if("adoptable" in this.$.arguments && this.$.arguments.adoptable===false){
            this.$Kind.adoptable = false;
        } else {
            this.$Kind.adoptable = true;
        }

        if("canAdopt" in this.$.arguments && this.$.arguments.canAdopt===false){
            this.$Kind.canAdopt = false;
        } else {
            this.$Kind.canAdopt = true;
        }

        if("draggable" in this.$.arguments && this.$.arguments.draggable===false){
            this.$Kind.draggable = false;
        } else {
            this.$Kind.draggable = true;
        }

        if("caption" in this.$.arguments && this.$.arguments.caption !== ""){
            this.$Property.caption = this.$.arguments.caption;
        } else {
            this.$Property.caption = "";
        }

        if("percent" in this.$.arguments && this.$.arguments.percent !== null){
            this.$Property.percent = Number(this.$.arguments.percent);
        } else {
            this.$Property.percent = 0;
        }

        this.setAttribute("draggable", String(this.$Kind.draggable));
        this.classList.add("closed");

        this.$Property.selected = null;
        this.$Property.percent = 0;
        this.$Elements.spacer = document.createElement("div");
        this.$Elements.spacer.classList.add("spacer");
        this.$Elements.switcher = document.createElement("div");
        this.$Elements.switcher.classList.add("switcher");
        this.$Elements.switcher.innerHTML = $_SWITCHER;
        this.$Elements.checkbox = document.createElement("div");
        this.$Elements.checkbox.classList.add("checkbox");
        this.$Elements.checkbox.innerHTML = $_RADIO;
        this.$Elements.label = document.createElement("div");
        this.$Elements.label.classList.add("label");
        this.$Elements.caption = document.createElement("span");
        this.$Elements.caption.classList.add("caption");
        this.$Elements.label.appendChild(this.$Elements.caption);
        this.$Elements.actions = document.createElement("div");
        this.$Elements.actions.classList.add("actions");
        this.$Elements.percent = document.createElement("div");
        this.$Elements.percent.classList.add("percent");
        this.$Elements.header = document.createElement("div");
        this.$Elements.header.classList.add("header");

        this.$Elements.header.appendChild(this.$Elements.spacer);
        this.$Elements.header.appendChild(this.$Elements.switcher);
        this.$Elements.header.appendChild(this.$Elements.checkbox);
        this.$Elements.header.appendChild(this.$Elements.label);
        this.$Elements.header.appendChild(this.$Elements.actions);
        this.$Elements.header.appendChild(this.$Elements.percent);

        this.$Caption = this.$Property.caption;
        this.$Percent = this.$Property.percent;

        if (this.$CannotAdopt){
            this.$Elements.caption.style.fontSize = "100%";
            this.$Elements.caption.style.fontStyle = "normal";
            this.$Elements.caption.style.fontWeight = "bold";
        }
        if (this.$IsNotAdoptable){
            this.$Elements.caption.style.fontSize = "80%";
            this.$Elements.caption.style.fontStyle = "italic";
            this.$Elements.caption.style.fontWeight = "100";
        }
        this.$Elements.arrow = this.$Elements.switcher.querySelector("svg>path#arrow");
        this.$Elements.check = this.$Elements.checkbox.querySelector("svg>path#check");
        this.$Elements.check.style.fillOpacity = String(0);
        this.$Elements.items = document.createElement("div");
        this.$Elements.items.classList.add("items");
        this.$Elements.items.innerHTML = this.$.originalHtml;

        this.$Property.dragTarget = null;
        this.$Property.dropTarget = null;
        this.$Property.dragAndDropMode = 0;
    }

    $getDragAndDropMode(drag: ASNode, drop: ASNode): number {
        if (
            drag &&
            drag instanceof ASNode &&
            drop &&
            drop instanceof ASNode &&
            drag !== drop
        ) {
            if (
                drag.$IsAdoptable &&
                drag.$CannotAdopt &&
                drop.$CanAdopt &&
                drop !== drag.$Parent
            ) {
                return 3;
            } else if (drag.$isSiblingOf(drop)) {
                if (drop.$IsEmpty && drop.$CanAdopt && drag.$IsAdoptable) {
                    return 3;
                } else {
                    if (drag.$IsNotAdoptable || drop.$IsNotAdoptable ) {
                        if (drag.$Index===0 || drop.$Index===0){
                            return 0;
                        }
                    }
                    if (drag.$Index < drop.$Index) {
                        return 1;
                    } else {
                        return 2;
                    }
                }
            } else {
                if (drag.$IsAdoptable) {
                    if (drop.$isNotChildOf(drag)){
                        if (drop.$IsEmpty) {
                            if(drop.$CanAdopt){
                                return 3;
                            }
                        } else {
                            if (drop.$Parent) {
                                if(drop.$Parent.$CanAdopt){
                                    return 2;
                                }
                            } else {
                                if(drag.$Parent !== drop){
                                    if(drop.$CanAdopt){
                                        return 3;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return 0;
    }

    protected $connect(): void{
        this.appendChild(this.$Elements.header);
        this.appendChild(this.$Elements.items);
    }

    protected $alwaysConnect(): void {
        if (this.$Parent) {
            //this.$Parent.$Elements.arrow.style.fill = "#000";
        }
        this.$Elements.header.style.gridTemplateColumns = `${$ms * this.$Level}px ${$ms}px ${$ms}px minmax(${$ms * 4}px, 1fr) auto ${$ms*4}px`;

        this.$Elements.spacer.onclick = (): void => {
            if(this.$IsEmpty) {
                this.$toggleCheck();
            } else {
                this.$Closed = !this.$Closed;
            }
        };

        this.$Elements.switcher.onclick = (): void => {
            if(this.$IsEmpty) {
                this.$toggleCheck();
            } else {
                this.$Closed = !this.$Closed;
            }
        };

        this.$Elements.checkbox.onclick = (): void => {
            this.$toggleCheck();
        };

        this.$Elements.label.onclick = (): void => {
            this.$toggleCheck();
        };

        this.ondragend = (event: DragEvent): void => {
            event.stopImmediatePropagation();
            if (this.$DragAndDropMode === 1) {
                this.$DragTarget.$insertAfterNode(this.$DropTarget);
            } else if (this.$DragAndDropMode === 2) {
                this.$DragTarget.$insertBeforeNode(this.$DropTarget);
            } else if (this.$DragAndDropMode === 3) {
                this.$DropTarget.$appendNode(this.$DragTarget);
            }
            this.$DragTarget = null;
            this.$DropTarget = null;
        };

        this.ondragenter = (event: DragEvent): void => {
            if (this.$DragTarget) {
                const dragTarget: ASNode = this.$DragTarget;
                const dropTarget: ASNode = <ASNode>event.currentTarget;
                if (dropTarget===dragTarget){
                    event.stopImmediatePropagation();
                    this.$DropTarget = null;
                } if (dropTarget===this){
                    this.$DragAndDropMode = this.$getDragAndDropMode(dragTarget, dropTarget);
                    if (this.$DragAndDropMode) {
                        event.stopImmediatePropagation();
                        this.$DropTarget = dropTarget;
                    }
                }
            }
        };

        this.ondragstart = (event: DragEvent): void =>{
            const dragTarget: ASNode = <ASNode>event.target;
            if (
                dragTarget instanceof ASNode &&
                dragTarget === this
            ) {
                event.stopImmediatePropagation();
                this.$DropTarget = null;
                if (event.dataTransfer) {
                    event.dataTransfer.setDragImage(
                        this.$Elements.caption,
                        this.$Elements.caption.offsetWidth/2,
                        this.$Elements.caption.offsetHeight/2
                    );
                }
                this.$DragTarget = this;
            }
        };
    }

    public $appendNode(node: ASNode, check: boolean = true): ASNode {
        if (!this.$Elements.items) {
            this.$Elements.items = document.createElement("div");
            this.$Elements.items.classList.add("items");
        }
        const oldParent: ASNode = node.$Parent;
        const newParent: ASNode = this;
        const oldParentId: number = (oldParent instanceof ASNode)?oldParent.Id:0;
        const newParentId: number = (newParent instanceof ASNode)?newParent.Id:0;
        if (oldParent) {
            node.$selfRemove();
        }
        const renewedNode: ASNode = this.$Elements.items.appendChild(node);
        if (check && oldParent && oldParent instanceof ASNode) {
            oldParent.doCheckItems();
        }
        if (
            check &&
            newParent &&
            newParent instanceof ASNode &&
            newParentId !== oldParentId
        ) {
            newParent.doCheckItems();
        }
        if (check && renewedNode && renewedNode instanceof ASNode) {
            renewedNode.doCheckParent();
        }
        return renewedNode;
    }

    public getAllChildren(children: {class: string, node: any}[] = []): {class: string, node: any}[] {
        this.$Items.forEach((item: ASNode)=>{
            item.getAllChildren(children);
        });
        children.push({class: this.constructor.name, node: this});
        return children;
    }

    public $isSiblingOf(node: ASNode): boolean {
        if (node instanceof ASNode) {
            return this.$Parent === node.$Parent;
        } else {
            return false;
        }
    }

    public $selfRemove(): ASNode {
        if (this.parentNode) {
            return this.parentNode.removeChild(this);
        } else {
            return null;
        }
    }

    public $insertAfterNode(existingNode: ASNode): ASNode {
        console.log("INSERT AFTER NODE");
        if(existingNode && existingNode.parentNode && this.parentNode){
            const oldParent: ASNode = this.$Parent;
            const newParent: ASNode = existingNode.$Parent;
            const oldParentId: number = (oldParent instanceof ASNode)?oldParent.Id:0;
            const newParentId: number = (newParent instanceof ASNode)?newParent.Id:0;
            const renewedNode: ASNode = existingNode.parentNode.insertBefore(this.$selfRemove(), existingNode.nextSibling);
            if (oldParent && oldParent instanceof ASNode) {
                oldParent.doCheckItems();
            }
            if (
                newParent &&
                newParent instanceof ASNode &&
                newParentId !== oldParentId
            ) {
                console.log(newParentId,oldParentId);
                newParent.doCheckItems();
            }
            if (renewedNode && renewedNode instanceof ASNode) {
                renewedNode.doCheckParent();
            }
            return renewedNode;
        } else {
            return null;
        }
    }

    public $insertBeforeNode(existingNode: ASNode): ASNode {
        console.log("INSERT BEFORE NODE");
        if(existingNode && existingNode.parentNode && this.parentNode){
            const oldParent: ASNode = this.$Parent;
            const newParent: ASNode = existingNode.$Parent;
            const oldParentId: number = (oldParent instanceof ASNode)?oldParent.Id:0;
            const newParentId: number = (newParent instanceof ASNode)?newParent.Id:0;
            const renewedNode: ASNode = existingNode.parentNode.insertBefore(this.$selfRemove(),existingNode);
            if (oldParent && oldParent instanceof ASNode) {
                oldParent.doCheckItems();
            }
            if (
                newParent &&
                newParent instanceof ASNode &&
                newParentId !== oldParentId
            ) {
                console.log(newParentId,oldParentId);
                newParent.doCheckItems();
            }
            if (renewedNode && renewedNode instanceof ASNode) {
                renewedNode.doCheckParent();
            }
            return renewedNode;
        } else {
            return null;
        }
    }


    private $drawPercent(): void {
        this.$Elements.percent.style.background = `linear-gradient(to right, rgba(0,0,0,0.666) ${this.$Percent}%, rgba(0,0,0,0.333) ${this.$Percent}%)`;
        this.$Elements.percent.innerHTML = `${(this.$Percent || 0 ).toFixed(0)}%`;
    }

    public $isChildOf(node: ASNode): boolean {
        if (this.$Parent) {
            if (this.$Parent === node) {
                return true;
            } else {
                return this.$Parent.$isChildOf(node);
            }
        } else {
            return false;
        }
    }

    public $isNotChildOf(node: ASNode): boolean {
        return !this.$isChildOf(node);
    }

    public $isNotParentOf(node: ASNode): boolean {
        return !node.$isChildOf(this);
    }

    public $isParentOf(node: ASNode): boolean {
        return node.$isChildOf(this);
    }

    public $toggleCheck(): boolean {
        this.$Checked = !this.$Checked;
        return this.$Checked;
    }

    public get $Actions(): HTMLDivElement {
        return <HTMLDivElement>this.$Elements.actions;
    }

    public get $CanAdopt(): boolean {
        if (!("canAdopt" in this.$Kind)) {
            this.$Kind.canAdopt = true;
        }
        return Boolean(this.$Kind.canAdopt);
    }

    public set $CanAdopt(canAdopt: boolean) {
        this.$Kind.canAdopt = canAdopt;
    }

    public get $CannotAdopt(): boolean {
        return !this.$CanAdopt;
    }

    public set $CannotAdopt(cannotAdopt: boolean) {
        this.$CanAdopt = !cannotAdopt;
    }

    public get $Caption(): string {
        return this.$Elements.caption.textContent;
    }

    public set $Caption(caption: string) {
        this.$Elements.caption.textContent = caption;
    }

    public get $Checked(): boolean {
        return this.$Elements.check.style.fillOpacity === String(1);
    }

    public set $Checked(checked: boolean) {
        if (checked) {
            if (this.$Selected instanceof ASNode) {
                this.$Selected.$Checked = false;
            }
            this.$Selected = this;
        }
        this.$Elements.check.style.fillOpacity = String(Number(checked));
        if (this.$Parent) {
            this.$Parent.$HalfChecked = checked;
        }
    }

    protected $getClosed(): boolean {
        return (this.$Items.length === 0) || this.classList.contains("closed");
    }

    public get $Closed(): boolean {
        return this.$getClosed();
    }

    public set $Closed(closed: boolean) {
        if (!closed /* && this.$Items.length>0 */) {
            this.classList.remove("closed");
        } else {
            this.classList.add("closed");
        }
    }

    private get $DragAndDropMode(): number {
        return Number(this.$Root.$Property.dragAndDropMode) || 0;
    }

    private set $DragAndDropMode(dragAndDropMode: number) {
        this.$Root.$Property.dragAndDropMode = dragAndDropMode;
    }

    public get $DragTarget(): ASNode {
        return <ASNode>this.$Root.$Property.dragTarget || null;
    }

    public set $DragTarget(dragTarget: ASNode | null) {
        this.$DropTarget = null;
        this.$Root.$Property.dragTarget = dragTarget;
    }

    public get $DropTarget(): ASNode {
        if (this.$DragTarget){
            return <ASNode>this.$Root.$Property.dropTarget;
        } else {
            return null;
        }
    }

    public set $DropTarget(dropTarget: ASNode | null) {
        const oldDropTarget: ASNode = this.$DropTarget;
        if  (this.$DragTarget && dropTarget instanceof ASNode) {
            this.$Root.$Property.dropTarget = dropTarget;
        } else {
            this.$Root.$Property.dropTarget = null;
        }
        if (oldDropTarget!==this.$DropTarget) {
            if (oldDropTarget instanceof ASNode) {
                oldDropTarget.$Elements.label.style.backgroundColor = "";
            }
            if (this.$DropTarget instanceof ASNode) {
                this.$DropTarget.$Elements.label.style.backgroundColor = "yellow";
            }
        }
    }

    public get $IsEmpty(): boolean {
        return !(this.$Items.length > 0);
    }

    public get $HalfChecked(): boolean {
        return this.$Elements.check.style.fillOpacity === String(0.333);
    }

    public set $HalfChecked(halfChecked: boolean) {
        if (halfChecked) {
            this.$Elements.check.style.fillOpacity = String(0.333);
        } else {
            this.$Elements.check.style.fillOpacity = String(0);
        }
        if (this.$Parent) {
            this.$Parent.$HalfChecked = halfChecked;
        }
    }

    public get $Index(): number {
        if (this.$Parent) {
            return this.$Parent.$Items.indexOf(this);
        } else {
            return 0;
        }
    }

    public get $IsAdoptable(): boolean {
        return Boolean(this.$Kind.adoptable);
    }

    public set $IsAdoptable(adoptable: boolean) {
        this.$Kind.adoptable = adoptable;
    }

    public get $IsNotAdoptable(): boolean {
        return !this.$IsAdoptable;
    }

    public set $IsNotAdoptable(notAdoptable: boolean) {
        this.$IsAdoptable = !notAdoptable;
    }

    public get $IsNotRoot(): boolean {
        return !this.$IsRoot;
    }

    public get $IsRoot(): boolean {
        return this === this.$Root;
    }

    /**
     * Get an array of children ASNode
     */
    public get $Items(): ASNode[] {
        const nodes: ASNode[] = [];
        if (this.$Elements && this.$Elements.items && this.$Elements.items.children) {
            for ( let i: number = 0 ; i < this.$Elements.items.children.length ; i++ ) {
                try {
                    if (this.$Elements.items.children.item(i) instanceof ASNode) {
                        nodes.push(<ASNode>this.$Elements.items.children.item(i));
                    }
                } catch {
                    console.log("BAD Elements.items");
                }
            }
        }
        return nodes;
    }

    public get $Percent(): number {
        if (this.$Items.length) {
            const total: number = this.$Items.length * 100;
            let accumulator: number = 0;
            this.$Items.forEach((item: ASNode)=>{
                accumulator += item.$Percent;
            });
            if (accumulator>0 && total>0) {
                this.$Property.percent = ( accumulator / total ) * 100;
            } else {
                this.$Property.percent = 0;
            }
        }
        return this.$Property.percent;
    }

    public set $Percent(percentValue: number) {
        this.$Property.percent = percentValue || 0;
        if (this.$Property.percent < 0) {
            this.$Property.percent = 0;
        } else if (this.$Property.percent > 100){
            this.$Property.percent = 100;
        }
        this.$drawPercent();
    }

    public get $Selected(): ASNode {
        return <ASNode>this.$Root.$Property.selected;
    }

    public set $Selected(selected: ASNode) {
        this.$Root.$Property.selected = selected;
        if (this.$Root.$Property.selected instanceof ASNode) {
            this.$Root.$Property.selected.doSelected();
        };
    }

    /**
     * get the first child node
     */
    public get $FirstChild(): ASNode {
        if (this.$Items.length) {
            return this.$Items[0];
        } else {
            return null;
        }
    }

    /**
     * get the last child node
     */
    public get $LastChild(): ASNode {
        if (this.$Items.length) {
            return this.$Items[this.$Items.length-1];
        } else {
            return null;
        }
    }

    /**
     * Get the ASNode parent, if exists
     */
    public get $Parent(): ASNode {
        if (
            "parentElement" in this &&
            this.parentElement &&
            "parentElement" in this.parentElement &&
            this.parentElement.parentElement &&
            this.parentElement.parentElement instanceof ASNode
        ) {
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
    public get $Level(): number {
        if (this.$Parent) {
            return this.$Parent.$Level + 1;
        } else {
            return 0;
        }
    }

    /**
     * Get the Root ASNode, or it self, if not exists
     */
    public get $Root(): ASNode {
        if (this.$Parent) {
            return this.$Parent.$Root;
        } else {
            return this;
        }
    }

    //

    protected doCheckItems(): void{
        ;
    }

    protected doCheckParent(): void{
        ;
    }

    public doSelected(): void {
        ;
    }

    public get Id(): number {
        return 0;
    }

}

customElements.define("as-node", ASNode);
