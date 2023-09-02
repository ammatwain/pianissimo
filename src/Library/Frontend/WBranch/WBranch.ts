import { Constants } from "@Common/Constants";

import { WBranches } from "./WBranches";

import "./WBranch.scss";

export class WBranch extends HTMLElement {
    private customIsConnected: boolean = false;
    private originalInnerHtml: string = "";
    private header: HTMLDivElement = null;
    private body: WBranches = null;
    private spacer: HTMLDivElement = null;
    private switcher: HTMLDivElement = null;
    private checkbox: HTMLDivElement = null;
    private label: HTMLDivElement = null;
    private edit: HTMLDivElement = null;
    private percent: HTMLDivElement = null;

    constructor(){
        super();
        this.originalInnerHtml = this.innerHTML;
        this.innerHTML = "";
        this.classList.add("leaf");
        this.setAttribute("draggable","true");
        this.header = document.createElement("div");
        this.header.classList.add("header");
        this.body = <WBranches>document.createElement("w-branches");
        this.body.classList.add("body");
        this.spacer = document.createElement("div");
        this.spacer.classList.add("spacer");
        this.switcher = document.createElement("div");
        this.switcher.classList.add("switcher");
        this.checkbox = document.createElement("div");
        this.checkbox.classList.add("checkbox");
        this.label = document.createElement("div");
        this.label.classList.add("label");
        this.edit = document.createElement("div");
        this.edit.classList.add("edit");
        this.percent = document.createElement("div");
        this.percent.classList.add("percent");
        this.header.appendChild(this.spacer);
        this.header.appendChild(this.switcher);
        this.header.appendChild(this.checkbox);
        this.header.appendChild(this.label);
        this.header.appendChild(this.edit);
        this.header.appendChild(this.percent);
        this.appendChild(this.header);
        this.appendChild(this.body);
        this.body.innerHTML = this.originalInnerHtml;
        //this.label.innerHTML = `Level ${this.Level}`;
    }

    connectedCallback(): void {
        if (this.customIsConnected === false){
            const ms: number = Constants.scss.$moduleSize;
            this.header.style.gridTemplateColumns =`${ms * this.Level}px ${ms}px ${ms}px 1fr ${ms}px ${ms * 5}px`;
            console.log(this.Sequence);
            this.attachEvents();
        }
        this.customIsConnected = true;
        this.update();
    }

    disconnectedCallback(): void {
        this.customIsConnected = false;
    }

    private attachEvents(): void {
        this.switcher.onclick = (): void => {
            if (this.classList.contains("leaf")) {
                this.checkbox.click();
            } else {
                this.Closed = !this.Closed;
            }
        };
        this.checkbox.onclick = (): void => {
            this.Checked = !this.Checked;
        };
        this.edit.onclick = (): void => {
            console.log(this);
        };
    }

    static get observedAttributes(): string[] {
        return ["branch-label","branch-type"];
    }

    private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name === "branch-label" && this.label) {
            this.label.innerHTML = newValue;
        } else if (name === "branch-type") {
            this.Type = newValue;
        }
    }

    public get Checked(): boolean {
        return this.classList.contains("checked") || this.classList.contains("halfchecked");
    }

    public set Checked(checked: boolean) {
        if (checked) {
            this.classList.add("checked");
            if (!(this.Children && this.Children.length)) {
                if (this.Type === "radio") {
                    this.Selected.forEach((branch: WBranch)=>{
                        branch.Checked = false;
                    });
                    this.Selected =  [this];
                } else {
                    if (!this.Selected.contains(this)) {
                        this.Selected.push(this);
                    }
                }
            }
        } else {
            this.classList.remove("checked");
            if (!(this.Children && this.Children.length)) {
                if (this.Selected.contains(this)) {
                    delete this.Selected[this.Selected.indexOf(this)];
                }
            }
        }
        if (checked && this.Type==="radio") {

            if(this.Parent && this.Parent.Children) {
                this.Parent.Children.filter((child: WBranch) => {
                    return child !== this;
                }).forEach((child: WBranch) => {
                    child.Checked = false;
                });
            }
        }
        if (this.Children.length) {
            if (checked && this.Type === "radio") {
                this.Children[0].Checked = true;
            } else {
                this.Children.forEach((child: WBranch)=>{
                    child.Checked = checked;
                });
            }
        }
        this.setParentStatus();
    }

    public setParentStatus(): void {
        if (this.Parent) {
            const status: string = this.Parent.Status;
            if (status === "checked") {
                this.Parent.classList.add("checked");
                this.Parent.classList.remove("halfchecked");
            } else if (status==="halfchecked") {
                this.Parent.classList.add("halfchecked");
                this.Parent.classList.remove("checked");
            } else {
                this.Parent.classList.remove("halfchecked");
                this.Parent.classList.remove("checked");
            }
            this.Parent.setParentStatus();
        }
    }

    public update(): void{
        if (this.Children.length) {
            this.Children.forEach((child: WBranch)=>{
                child.update();
            });
            this.classList.remove("leaf");
        } else {
            this.classList.add("leaf");
        }
    }

    public get Closed(): boolean {
        return this.classList.contains("closed");
    }

    public set Closed(closed: boolean) {
        if (closed) {
            this.classList.add("closed");
        } else {
            this.classList.remove("closed");
        }
    }


    public get Children(): WBranch[] {
        if ( this.body ) {
            return this.body.Children;
        } else {
            return [];
        }
    }

    public get Level(): number {
        if (this.Parent) {
            return this.Parent.Level + 1;
        } else {
            return 0;
        }
    }

    public get Parent(): WBranch {
        try {
            if (this.ParentBranches) {
                return this.ParentBranches.ParentBranch;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    public get ParentBranches(): WBranches {
        const parentBranches: WBranches = <WBranches>this.parentElement;
        if (parentBranches instanceof WBranches) {
              return parentBranches;
        }
        console.log(this.label.innerHTML, parentBranches);
        throw new Error("The elements of the 'w-branch' type must reside within a container element of type 'w-branches'.");
    }

    public get PreviousSibling(): WBranch {
        try {
            const sibling: WBranch = <WBranch>this.previousElementSibling;
            if (sibling instanceof WBranch) {
                return sibling;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    public get Root(): WBranch {
        if(this.Parent && this.Parent.Root){
            return this.Parent.Root;
        } else {
            return this;
        }
        throw new Error("The elements of the 'w-branch' type must reside within a container element of type 'w-branches'.");
    }

    public get RootBranches(): WBranches {
        if(this.Parent && this.Parent.Root){
            return this.Parent.RootBranches;
        } else if (this.ParentBranches && this.ParentBranches instanceof WBranches) {
            return this.ParentBranches;
        } else {
            return this.body;
        }
    }

    public get Sequence(): number {
        if (this.PreviousSibling) {
            return this.PreviousSibling.Sequence + 1;
        } else {
            return 0;
        }
    }

    public get Selected(): WBranch[] {
        return this.RootBranches.Selected;
    }

    public set Selected(branches: WBranch[]) {
        this.RootBranches.Selected = branches;
    }

    public get Type(): string {
        if (this.Root.classList.contains("radio") || this.RootBranches.classList.contains("radio")){
            return "radio";
        } else {
            return "checkbox";
        }
    }

    public set Type(type: string) {
        if (type === "radio"){
            this.Root.classList.add("radio");
        } else {
            this.Root.classList.remove("radio");
        }
    }

    public get Status(): string {
        const childrenLength: number = this.Children.length;
        if (childrenLength) {
            this.classList.remove("leaf");
            return this.body.Status;
        } else {
            this.classList.add("leaf");
            if (this.Checked) {
                return "checked";
            } else {
                return "unchecked";
            }
        }
    }
}

customElements.define("w-branch", WBranch);
