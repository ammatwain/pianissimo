import { Constants } from "@Common/Constants";

import "./WBranch.scss";

export class WBranch extends HTMLElement {
    private customIsConnected: boolean = false;
    private originalInnerHtml: string = "";
    private header: HTMLDivElement = null;
    private body: HTMLDivElement = null;
    private spacer: HTMLDivElement = null;
    private switcher: HTMLDivElement = null;
    private checkbox: HTMLDivElement = null;
    private label: HTMLDivElement = null;
    private percent: HTMLDivElement = null;

    constructor(){
        super();
        this.setAttribute("draggable","true");
        this.originalInnerHtml = this.innerHTML;
        this.innerHTML = "";
        this.header = document.createElement("div");
        this.header.classList.add("header");
        this.body = document.createElement("div");
        this.body.classList.add("body");
        this.spacer = document.createElement("div");
        this.spacer.classList.add("spacer");
        this.switcher = document.createElement("div");
        this.switcher.classList.add("switcher");
        this.checkbox = document.createElement("div");
        this.checkbox.classList.add("checkbox");
        this.label = document.createElement("div");
        this.label.classList.add("label");
        this.percent = document.createElement("div");
        this.percent.classList.add("percent");
        this.header.appendChild(this.spacer);
        this.header.appendChild(this.switcher);
        this.header.appendChild(this.checkbox);
        this.header.appendChild(this.label);
        this.header.appendChild(this.percent);
        this.appendChild(this.header);
        this.appendChild(this.body);
        this.body.innerHTML = this.originalInnerHtml;
        this.label.innerHTML = `Level ${this.Level}`;
    }

    connectedCallback(): void {
        if (this.customIsConnected === false){
            const ms: number = Constants.scss.$moduleSize;
            const gridTemplateColumns: string = `${ms * this.Level}px ${ms}px ${ms}px 1fr ${ms * 5}px`;
            this.header.style.gridTemplateColumns =`${ms * this.Level}px ${ms}px ${ms}px 1fr ${ms * 5}px`;
            console.log(this.Sequence);
            this.attachEvents();
        }
        this.customIsConnected = true;
    }

    disconnectedCallback(): void {
        this.customIsConnected = false;
    }

    private attachEvents(): void {
        this.switcher.onclick = (): void => {
            this.Closed = !this.Closed;
        };
        this.checkbox.onclick = (): void => {
            this.Checked = !this.Checked;
        };
    }

    static get observedAttributes(): string[] {
        return ["label"];
    }

    private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name === "label" && this.label) {
            this.label.innerHTML = newValue;
        }
    }

    public get Checked(): boolean {
        return this.classList.contains("checked");
    }

    public set Checked(checked: boolean) {
        if (checked) {
            this.classList.add("checked");
        } else {
            this.classList.remove("checked");
        }
        if (this.Parent) {
            this.Parent.Checked = checked;
        }
        //this.Children.forEach((child: WBranch)=>{
        //    child.Checked = checked;
        //});
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
        const branches: WBranch[] = [];
        for(let i: number = 0 ; i < this.body.children.length ; i++ ) {
            if (this.body.children.item(i) instanceof WBranch) {
                branches.push(<WBranch>this.body.children.item(i));
            }
        }
        return branches;
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
            const parent: WBranch = <WBranch>this.parentElement.parentElement;
            if (parent instanceof WBranch) {
                return parent;
            } else {
                return null;
            }
        } catch {
            return null;
        }
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
        if(this.Parent){
            return this.Parent.Root;
        } else {
            return this;
        }
    }

    public get Sequence(): number {
        if (this.PreviousSibling) {
            return this.PreviousSibling.Sequence + 1;
        } else {
            return 0;
        }
    }
}

customElements.define("w-branch", WBranch);
