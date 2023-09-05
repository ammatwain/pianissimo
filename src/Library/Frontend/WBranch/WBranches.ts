import { IBranchObject } from "@Library/Common/Interfaces/IBranchObject";
import { WBranch } from "./WBranch";

import "./WBranches.scss";
import { Walk } from "@Library/Common/Walk/Walk";
import { BranchClass } from "../BranchClass/BranchClass";


export class WBranches extends HTMLElement {
    private customIsConnected: boolean = false;
    private originalInnerHtml: string = "";
    private selected: WBranch[] = [];
    private dragBranch: WBranch = null;
    private dropBranch: WBranch = null;
    private walk: Walk = null;

    constructor() {
        super();
    }

    static get observedAttributes(): string[] {
        return ["w-type"];
    }

    private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name === "w-type") {
            this.Type = newValue;
        }
    }

    public addChild(child: WBranch): void {
        this.appendChild(child);
    }

    initialize(data: IBranchObject[] ): void {
        this.innerHTML = "";
        this.walk = new Walk(data);
        this.walkTree(this.walk.TreeClasses);
    };

    public insertAfter(newNode: WBranch, existingNode: WBranch): void {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }

    public walkTree (branches: BranchClass[], parent: WBranch | WBranches = this): void {
        branches.forEach((branch: BranchClass)  => {
            const guiBranch: WBranch = new WBranch();
            guiBranch.setAttribute("w-label",branch.Name);
            if (branch.Type === "sheet" ) {
                guiBranch.setAttribute("w-can-adopt","false");
            }
            if (branch.Type === "section" ) {
                guiBranch.setAttribute("w-adoptable","false");
                guiBranch.setAttribute("w-can-adopt","false");
            }
            parent.addChild(guiBranch);
            if (branch.Children && branch.Children.length) {
                this.walkTree(branch.Children, guiBranch);
            }
        });
    };

    ///TODO
    public get Children(): WBranch[] {
        const branches: WBranch[] = [];
        for(let i: number = 0 ; i < this.children.length ; i++ ) {
            try {
                if (this.children.item(i) instanceof WBranch) {
                    branches.push(<WBranch>this.children.item(i));
                }
            } catch {
                console.log("QUALCoSa di Storto", typeof this.children.item(i), this.children.item(i));
            }
        }
        return branches;
    }

    public get DragBranch(): WBranch {
        return this.dragBranch;
    }

    public set DragBranch(dragBranch: WBranch) {
        if (dragBranch instanceof WBranch) {
            this.dragBranch = dragBranch;
        } else {
            this.dragBranch = null;
        }
    }

    public get DragBranches(): WBranches {
        if (this.DragBranch) {
            return this.DragBranch.ParentBranches;
        } else {
            return null;
        }
    }

    public get DropBranch(): WBranch {
        return this.dropBranch;
    }

    public get DropBranches(): WBranches {
        if (this.DropBranch) {
            return this.DropBranch.ParentBranches;
        } else {
            return null;
        }
    }

    public set DropBranch(dropBranch: WBranch) {
        if (dropBranch instanceof WBranch) {
            this.dropBranch = dropBranch;
        } else {
            this.dropBranch = null;
        }
    }

    public get ParentBranch(): WBranch {
        try {
            const parent: WBranch = <WBranch>this.parentElement;
            if (parent instanceof WBranch) {
                return parent;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    public get Status(): string {
        const childrenLength: number = this.Children.length;
        let checked: number = 0;
        this.Children.forEach((child: WBranch) => {
            if (child.Status === "checked") {
                checked += 1;
            } else if (child.Status === "halfchecked") {
                checked += 0.5;
            }
        });
        if (checked>0 && checked===childrenLength){
            return "checked";
        } else if (checked>0 && checked<childrenLength){
            return "halfchecked";
        } else {
            return "unchecked";
        }
    }

    public get Selected(): WBranch[] {
        return this.selected;
    }

    public set Selected(branches: WBranch[]) {
        this.selected = branches;
    }

    public get Type(): string {
        if (this.classList.contains("radio")){
            return "radio";
        } else {
            return "checkbox";
        }
    }

    public set Type(type: string) {
        if (type === "radio"){
            this.classList.add("radio");
        } else {
            this.classList.remove("radio");
        }
        this.Children.forEach((child: WBranch) => {
            child.Type = type;
        });
    }
}