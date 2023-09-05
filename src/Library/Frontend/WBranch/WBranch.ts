import { Constants } from "@Common/Constants";
import { WBranches } from "./WBranches";

import "./WBranch.scss";

export class WBranch extends HTMLElement {
    private adoptable: boolean = true;
    private canAdopt: boolean = true;
    private customIsConnected: boolean = false;
    private originalInnerHtml: string = "";
    private header: HTMLDivElement = null;
    private branches: WBranches = null;
    private spacer: HTMLDivElement = null;
    private switcher: HTMLDivElement = null;
    private checkbox: HTMLDivElement = null;
    private label: HTMLDivElement = null;
    private edit: HTMLDivElement = null;
    private percent: HTMLDivElement = null;
    private percentValue: number = 0;
    private sequence: number = NaN;
    private ctrlKey: boolean = false;

    constructor(){
        super();
        this.originalInnerHtml = this.innerHTML;
        this.innerHTML = "";
            //this.classList.add("leaf");
            this.setAttribute("draggable","true");
            this.header = document.createElement("div");
            this.header.classList.add("header");
            this.branches = <WBranches>document.createElement("w-branches");
            this.branches.classList.add("branches");
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
            this.edit.innerHTML = "&#x1F589";
            this.percent = document.createElement("div");
            this.percent.classList.add("percent");
            this.header.appendChild(this.spacer);
            this.header.appendChild(this.switcher);
            this.header.appendChild(this.checkbox);
            this.header.appendChild(this.label);
            this.header.appendChild(this.edit);
            this.header.appendChild(this.percent);
            this.appendChild(this.header);
            this.appendChild(this.branches);
            this.branches.innerHTML = this.originalInnerHtml;
        //this.label.innerHTML = `Level ${this.Level}`;
    }
    static get observedAttributes(): string[] {
            return ["w-label","w-type","w-adoptable","w-can-adopt"];
    }


    private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name === "w-label" && this.label) {
            this.label.innerHTML = newValue;
        } else if (name === "w-type") {
            this.Type = newValue;
        } else if (name === "w-adoptable") {
            this.IsAdoptable = !(newValue.toLocaleLowerCase()==="false");
//            this.adoptable = !(newValue.toLocaleLowerCase()==="false");
        } else if (name === "w-can-adopt") {
            this.canAdopt = !(newValue.toLocaleLowerCase()==="false");
        }
    }

    connectedCallback(): void {
        if (this.customIsConnected === false){
            this.render();
            this.update();
            this.updateAllPercents();
            this.attachEvents();
        }
        this.customIsConnected = true;
    }

    disconnectedCallback(): void {
        this.customIsConnected = false;
    }


    public addChild(child: WBranch): void {
        this.branches.addChild(child);
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
            this.updateAllPercents();
            console.log("TODO!!!", Date.now());
        };
        /**
         * TARGET è l'elemento che viene attraversato
         */
        this.ondrag = (event: DragEvent): void => {
            const source: WBranch = <WBranch>event.target;
            const destination: WBranch = <WBranch>event.currentTarget;
            if (
                source === this.RootBranches.DragBranch &&
                destination instanceof WBranch &&
                source !== destination
            ) {
                event.stopImmediatePropagation();
                event.stopPropagation();
            }
        };
/*
        this._ondragend =  (event: DragEvent): void => {
            const source: WBranch = this.RootBranches.DragBranch;
            const destination: WBranch =  this.RootBranches.DropBranch;
            if (
                source instanceof WBranch &&
                destination instanceof WBranch &&
                destination !== source
            ) {
                event.stopPropagation();
                //if (!source.IsAdoptable && )
                if ( destination!==source && (!destination.hasParent(source))){
                    if (destination.IsBranch) {
                        if (
                            source.ParentBranches === destination.ParentBranches ||
                            (
                                source.ParentBranches !== destination.ParentBranches &&
                                source.IsAdoptable
                            )
                        ) {
                            source.parentElement.removeChild(source);
                            destination.addChild(source);
                        }
                    } else {
                        if (destination.ParentBranches) {
                            if (source.ParentBranches === destination.ParentBranches) {
                                // chi c'è prima?
                                const s: number = source.ParentBranches.Children.indexOf(source);
                                const d: number = destination.ParentBranches.Children.indexOf(destination);
                                if (s>d) {
                                    source.parentElement.removeChild(source);
                                    destination.ParentBranches.insertBefore(source, destination);
                                } else if (d>s) {
                                    // inverse logic
                                    source.parentElement.removeChild(source);
                                    destination.ParentBranches.insertAfter(source, destination);
//                                    destination.parentElement.removeChild(destination);
//                                    source.ParentBranches.insertBefore(destination, source);
                                }
                            } else if(source.IsAdoptable){
                                source.parentElement.removeChild(source);
                                destination.ParentBranches.insertBefore(source,destination);
                            }
                        }
                    }
                }
            }
            this.RootBranches.DragBranch = null;
            this.RootBranches.DropBranch = null;
        };
*/
        this.ondragend = (event: DragEvent): void => {
            const source: WBranch = this.RootBranches.DragBranch;
            const destination: WBranch =  this.RootBranches.DropBranch;
//            const sourceBranches: WBranches = this.RootBranches.DragBranches;
//            const destinationBranches: WBranches =  this.RootBranches.DropBranches;
            if (
                source instanceof WBranch &&
                destination instanceof WBranch &&
                destination !== source &&
                !destination.hasParent(source)
            ) {
                console.log(event);
                event.stopPropagation();
                if (source.IsAdoptable) { //source = branch
                    if(destination.CanAdopt) {//destination = branch
                        if (source.ParentBranches === destination.ParentBranches) { //scambio d'ordine
                            console.log(this.ctrlKey);
                            if (!this.ctrlKey && !destination.hasParent(source)) {
                                source.parentElement.removeChild(source);
                                destination.addChild(source);
                            } else {
                                // chi c'è prima?
                                const s: number = source.ParentBranches.Children.indexOf(source);
                                const d: number = destination.ParentBranches.Children.indexOf(destination);
                                source.parentElement.removeChild(source);
                                if (s>d) {
                                    destination.ParentBranches.insertBefore(source, destination);
                                } else if (d>s) {
                                    destination.ParentBranches.insertAfter(source, destination);
                                }
                            }
                        } else if (destination === source.Parent) {
                            console.log("destination === source.Parent");
                            source.parentElement.removeChild(source);
                            destination.ParentBranches.insertBefore(source, destination);
                        } else if (source.ParentBranches !== destination.branches) {
                            source.parentElement.removeChild(source);
                            destination.addChild(source);
                        }
                    }
                } else {
                    if (source.ParentBranches === destination.ParentBranches) {
                        const s: number = source.ParentBranches.Children.indexOf(source);
                        const d: number = destination.ParentBranches.Children.indexOf(destination);
                        source.parentElement.removeChild(source);
                        if (s>d) {
                            destination.ParentBranches.insertBefore(source, destination);
                        } else if (d>s) {
                            destination.ParentBranches.insertAfter(source, destination);
                        }
                    }
                }
/*
                if ( destination!==source && (!destination.hasParent(source))){
                    if (destination.IsBranch) {
                    } else {
                        if (destination.ParentBranches) {
                            if (source.ParentBranches === destination.ParentBranches) {
                                // chi c'è prima?
                                const s: number = source.ParentBranches.Children.indexOf(source);
                                const d: number = destination.ParentBranches.Children.indexOf(destination);
                                if (s>d) {
                                    source.parentElement.removeChild(source);
                                    destination.ParentBranches.insertBefore(source, destination);
                                } else if (d>s) {
                                    // inverse logic
                                    source.parentElement.removeChild(source);
                                    destination.ParentBranches.insertAfter(source, destination);
                                }
                            } else if(source.IsAdoptable){
                                source.parentElement.removeChild(source);
                                destination.ParentBranches.insertBefore(source,destination);
                            }
                        }
                    }
                }
*/
            }
            this.RootBranches.DragBranch = null;
            this.RootBranches.DropBranch = null;
        };

        this.ondragenter = (event: DragEvent): void => {
            const source: WBranch = this.RootBranches.DragBranch;
            const destination: WBranch = <WBranch>event.currentTarget;
            if (source === destination) {
                event.stopImmediatePropagation();
                this.RootBranches.DropBranch = null;
            } else if (
                destination instanceof WBranch
            ) {
                event.stopImmediatePropagation();
                destination.style.backgroundColor = "yellow";
                this.RootBranches.DropBranch = destination;
            }
        };
        this.ondragleave = (event: DragEvent): void => {
            const leaved: WBranch = <WBranch>event.currentTarget;
            if (
                leaved instanceof WBranch &&
                leaved !== this.RootBranches.DragBranch
            ) {
                event.stopImmediatePropagation();
                leaved.style.backgroundColor = "";

            }
        };
        this.ondragover = (event: DragEvent): void => {
            const source: WBranch = this.RootBranches.DragBranch;
            const destination: WBranch = <WBranch>event.currentTarget;
            if (source === destination) {
                event.stopImmediatePropagation();
                this.RootBranches.DropBranch = null;
            } else if (
                destination instanceof WBranch &&
                destination !== this.RootBranches.DragBranch
            ) {
                event.stopImmediatePropagation();
                this.RootBranches.DropBranch = destination;
            }
        };
        this.ondragstart = (event: DragEvent): void => {
            event.stopImmediatePropagation();
            const target: WBranch = <WBranch>event.target;
            if (
                target instanceof WBranch &&
                target === this &&
                this.RootBranches.DragBranch !== this
            ) {
                this.RootBranches.DragBranch = this;
            }
        };

        document.onkeydown = (event: KeyboardEvent): void => {
            this.ctrlKey = event.ctrlKey;
            console.log(this.ctrlKey);
        };

        document.onkeyup = (event: KeyboardEvent): void => {
            this.ctrlKey = false;
            console.log(this.ctrlKey);
        };

    }

    public hasParent(branch: WBranch): boolean {
        if (this.Parent) {
            if (this.Parent === branch) {
                return true;
            } else {
                return this.Parent.hasParent(branch);
            }
        } else {
            return false;
        }
    }

    private render(): void {
            const ms: number = Constants.scss.$moduleSize;
            this.header.style.gridTemplateColumns =`${ms * this.Level}px ${ms}px ${ms}px 1fr ${ms}px ${ms * 5}px`;
    }

    private setPercent(): void {
        this.percent.style.background = `linear-gradient(to right, rgba(0,0,0,0.666) ${this.Percent}%, rgba(0,0,0,0.333) ${this.Percent}%)`;
        this.percent.innerHTML = `${(this.Percent || 0 ).toFixed(0)}%`;
    }

    public get Checked(): boolean {
        return this.classList.contains("checked") || this.classList.contains("halfchecked");
    }

    /**
     * CanAdopt.
     * Leaf non può adottare
     * Branch può adottare se non contiene leaf
     * In questo caso branch può solo "generare"
     */
    public get CanAdopt(): boolean {
        return this.canAdopt && this.IsAdoptable;
    }

    public set CanAdopt(canAdopt: boolean) {
        this.canAdopt = canAdopt;
    }

    public set Checked(checked: boolean) {
console.log("start 1");
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
console.log("end 1");
console.log("start 2");
//        if (checked && this.Type==="radio") {
//            if(this.Parent && this.Parent.Children) {
//                this.Parent.Children.filter((child: WBranch) => {
//                    return child !== this;
//                }).forEach((child: WBranch) => {
//                    child.Checked = false;
//                });
//            }
//        }
console.log("end 2");
console.log("start 3");
        if (this.Children.length) {
            if (this.Type === "radio") {
                this.Children[0].Checked = checked;
            }
//            else {
//                this.Children.forEach((child: WBranch)=>{
//                    child.Checked = checked;
//                });
//            }
        }
console.log("end 3");
console.log("SELECTED",this.Selected);
        this.Selected.forEach((selected: WBranch) => {
            console.log(selected.label.innerHTML);
        });
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
            if (this.IsNotAdoptable) {
                this.classList.add("leaf");
                this.Percent = Math.random() * 100;
            } else {
                this.classList.remove("leaf");
            }
        }
    }

    public updateAllPercents(): void {
        this.RootBranches.Children.forEach((child: WBranch)=>{
            child.updatePercent();
        });
    }

    public updatePercent(): number{
        if (this.Children.length) {
            this.Children.forEach((child: WBranch)=>{
                child.updatePercent();
            });
        }
        this.setPercent();
    }

    public get IsAdoptable(): boolean {
        return !this.classList.contains("leaf");
    }

    public set IsAdoptable(adoptable: boolean) {
        if (adoptable){
            this.classList.remove("leaf");
        } else {
            this.classList.add("leaf");
        }
    }

    public get IsNotAdoptable(): boolean {
        return !this.IsAdoptable;
    }

    public set IsNotAdoptable(notAdoptable: boolean) {
        this.IsAdoptable = !notAdoptable;
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
        if ( this.branches ) {
            return this.branches.Children;
        } else {
            return [];
        }
    }

    public get IsBranch(): boolean {
        return (!(this.IsLeaf && !(this.IsAdoptable)));
    }

    public get IsLeaf(): boolean {
        return this.classList.contains("leaf");
    }

    public set IsLeaf(isLeaf: boolean) {
        if (isLeaf) {
            this.classList.add("leaf");
        } else {
            this.classList.remove("leaf");
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

    public set Parent(branch: WBranch) {
        if (this.ParentBranches) {
            this.ParentBranches.removeChild(this);
        }
        branch.addChild(this);
    }

    public get ParentBranches(): WBranches {
        const parentBranches: WBranches = <WBranches>this.parentElement;
        if (parentBranches instanceof WBranches) {
            return parentBranches;
        }
        throw new Error("The elements of the 'w-branch' type must reside within a container element of type 'w-branches'.");
    }

    public get Percent(): number {
        if (this.IsBranch && Array.isArray(this.Children)) {
            const total: number = this.Children.length * 100;
            let accumulator: number = 0;
            this.Children.forEach((child: WBranch)=>{
                accumulator += child.Percent;
            });
            if (accumulator>0 && total>0) {
                this.percentValue = ( accumulator / total ) * 100;
            } else {
                this.percentValue = 0;
            }
        }
        return this.percentValue;
    }

    public set Percent(percentValue: number) {
        this.percentValue = percentValue || 0;
        if (this.percentValue < 0) {
            this.percentValue = 0;
        } else if (this.percentValue > 100){
            this.percentValue = 100;
        }
        this.setPercent();
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
            return this.branches;
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
            return this.branches.Status;
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


customElements.define("w-branches", WBranches);
customElements.define("w-branch", WBranch);

