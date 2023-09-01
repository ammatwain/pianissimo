import { STR } from "@Global/STR";
import { BranchClassCollectionItem } from "@Interfaces/IBranchClassCollectionItem";
import { Constants } from "@Common/Constants";
import { IBranchObject } from "@Interfaces/IBranchObject";
import { ITreeStore } from "@Interfaces/ITreeStore";
import { BranchClass } from "@Frontend/BranchClass";
import { WPropertyEditor } from "@Frontend/WPropertyEditor";
import { Walk } from  "@Library/Common/Walk";
import { default as wTreeAjax } from "./WTreeAjax";
//
import "./WTree.scss";

//const { moduleSize } = STYLE;
const $moduleSize: number  = Constants.scss.$moduleSize;


declare global {
    interface ParentNode {
        branchId: string;
    }
    interface HTMLLIElement {
        branchId: string;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function uniq(arr: any[]): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map: {[index: string]: any} = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return arr.reduce((acc: any[], item: any) => {
    if (!map[item]) {
      map[item] = true;
      acc.push(item);
    }
    return acc;
  }, []);
}

function empty(ele: HTMLElement): void {
  while (ele.firstChild) {
    ele.removeChild(ele.firstChild);
  }
}

interface ICallbackAnimation {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    active(): any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enter(): any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    leave(): any;
}

function animation(duration: number, callback: ICallbackAnimation): void {
  requestAnimationFrame(() => {
    callback.enter();
    requestAnimationFrame(() => {
      callback.active();
      setTimeout(() => {
        callback.leave();
      }, duration);
    });
  });
}

function collapseFromLeaf(tree: WTree, leafBranch: BranchClass): void {
  try {
    const branchListItemElement: HTMLLIElement = tree.liElementsById[leafBranch.Parent.Id];
    if(!branchListItemElement.classList.contains("_close")) {
        (<HTMLDivElement>branchListItemElement.querySelector("switcher")).click();
    }
  } catch (error) {
    return;
  }
  if("parent" in leafBranch) {
    collapseFromLeaf(tree, leafBranch.Parent);
  }
}

function expandFromRoot(tree: WTree, root: BranchClass): void {
    const branchListItemElement: HTMLLIElement = tree.liElementsById[root.Id];
    if(branchListItemElement.classList.contains("_close")) {
        (<HTMLDivElement>branchListItemElement.querySelector("switcher")).click();
    }
    if("children" in root) {
        for(const child of root.Children) {
            expandFromRoot(tree, child);
        }
    }
}

interface ITreeOptions {
    data?: IBranchObject[];
    selectMode?:  "checkbox" | "radio";
    values?: number[];
    url?: string;
    method?: string;
    closeDepth?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    disables?: number[];
    // eslint-disable-next-line @typescript-eslint/ban-types
    onChange?: () => void;
    // eslint-disable-next-line @typescript-eslint/ban-types
    beforeLoad?: (arg: BranchClass[]) => BranchClass[];
    // eslint-disable-next-line @typescript-eslint/ban-types
    afterLoad?: (arg: BranchClass[]) => BranchClass[];
}

export class WTree extends HTMLElement{

    constructor(options: ITreeOptions ) {
        super();
        this.options = Object.assign(this.defaultOptions, options);
    }

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    private walk: Walk;
    private initcount: number = 0;
    private defaultOptions: ITreeOptions = {
        selectMode: "radio",
        values: [],
        disables: [],
        beforeLoad: null,
        afterLoad: null,
        onChange: null,
        url: null,
        method: "GET",
        closeDepth: null,
    };
    private treeStore: ITreeStore = {};
    private treeContainer: HTMLDivElement = null;
    private treeHeader: HTMLDivElement = null;
    private treeMain: HTMLDivElement = null;
    private treeFooter: HTMLDivElement = null;
    private propContainer: HTMLDivElement = null;
    private propEditor: WPropertyEditor = null;

    public liElementsById: {[index: string]: HTMLLIElement} = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private willUpdateBranchesById: BranchClass[] = [];
    private options: ITreeOptions;
    get values(): number[] {
        return this.getValues();
    }
    set values (values: number[]) {
        this.setValues(uniq(values));
    }
    get disables(): number[] {
        return this.getDisables();
    }
    set disables (values) {
        this.setDisables(uniq(values));
    }

    get onChange(): () => void {
        return this.options.onChange || null;
    }

    set onChange(func: () => void) {
        this.options.onChange = func;
    }

    get selectedBranches(): BranchClass[] {
        const branches: BranchClass[] = [];
        const branchesById: BranchClassCollectionItem = this.treeStore.branchesById;
        for (const id in branchesById) {
        if (
            id in branchesById &&
            (branchesById[id].Status === 1 || branchesById[id].Status === 2)
        ) {
            const branch: BranchClass = branchesById[id];
            branches.push(branch);
        }
        }
        return branches;
    }

    fillPropertyEditor(id: number): void {
        const ele: IBranchObject = Object.assign({},this.treeStore.branchesById[id].BranchObject);
        delete ele.$children;
        this.propEditor.properties = ele;
    }

    get disabledBranches(): BranchClass[] {
        const branches: BranchClass[] = [];
        const branchesById: BranchClassCollectionItem = this.treeStore.branchesById;
        for (const id in branchesById) {
            if (id in branchesById && branchesById[id].Disabled) {
                const branch: BranchClass = branchesById[id];
                branches.push(branch);
            }
        }
        return branches;
    }

    public getLeafById(id: number): BranchClass {
        return this.treeStore.leafBranchesById[id] || null;
    }

    public getBranchById(id: number): BranchClass {
        return this.treeStore.branchesById[id] || null;
    }

    connectedCallback(): void{
        this.treeContainer = document.createElement("div");
        this.treeContainer.classList.add("tree-container");
        this.appendChild(this.treeContainer);
        this.propContainer = document.createElement("div");
        this.propContainer.classList.add("prop-container");
        this.propEditor = <WPropertyEditor>document.createElement("w-property-editor");
        this.propContainer.appendChild(this.propEditor);
        this.appendChild(this.propContainer);
        if (this.options.url) {
            this.load((data: IBranchObject[]) => {
              this.initialize(data);
            });
        } else if (this.options.data){
            this.initialize(this.options.data);
        }
        /*
        else {
            this.initialize(
                [
                    {
                        id: '0',
                        percent:0,
                        name: 'undefined',
                    },
                ]
            );
        }
        */
    }

    createRootElement(): HTMLDivElement {
        const div: HTMLDivElement = <HTMLDivElement>document.createElement("div");
        div.classList.add("tree");
        return div;
    };

    getSelectedBranchesById(): BranchClass[] {
        return this.treeStore.linearBranches.filter((branch: BranchClass)=>{
            return (branch.Status === 1 || branch.Status === 2);
        });
    }

    getDisabledBranchesById(): BranchClass[] {
        return this.treeStore.linearBranches.filter((branch: BranchClass)=>{
            return (branch.Disabled===true);
        });
    }

    emptyBranchesCheckStatus(): void {
        this.willUpdateBranchesById = this.getSelectedBranchesById();
        this.willUpdateBranchesById.forEach((branch: BranchClass) => {
          if (!branch.Disabled) {branch.Status = 0;}
        });
    };

    emptyBranchesDisable(): void {
        this.willUpdateBranchesById = this.getDisabledBranchesById();
        this.willUpdateBranchesById.forEach((branch: BranchClass) => {
            branch.Disabled = false;
        });
    };

    initialize(data: IBranchObject[] ): void {
        this.walk = new Walk(data);
        this.initcount++;
//        console.time('init');
        this.treeStore = this.parseTreeData(this.walk);
        this.render(this.treeStore.treeBranches);
        const {values, disables, afterLoad} = this.options;

        if (values && values.length) {
            this.treeStore.defaultValues = values;
        }

        if (this.treeStore.defaultValues.length) {
            this.setValues(this.treeStore.defaultValues);
        }
        if (disables && disables.length) {
            this.treeStore.defaultDisables = disables;
        }

        if (this.treeStore.defaultDisables.length) {
            this.setDisables(this.treeStore.defaultDisables);
        }
        this.updateAllPercents();
        if (afterLoad) {
            afterLoad.call(this);
        }
//        console.timeEnd('init');
    };

    parseTreeData(data: Walk): ITreeStore {

        const treeData: ITreeStore = {
            treeBranches: data.TreeClasses,
            linearBranches: data.LinearClasses,
            branchesById: {},
            leafBranchesById: {},
            defaultValues: [],
            defaultDisables: [],
        };

        const walkTree: Function = function(branches: BranchClass[], parent: any = null): void {
            branches.forEach((branch: BranchClass)  => {
                treeData.branchesById[branch.Id] = branch;
                if (branch.Checked) {treeData.defaultValues.push(branch.Id);}
                if (branch.Disabled) {treeData.defaultDisables.push(branch.Id);}
                if (parent) {branch.Parent = parent;}
                if (branch.Children && branch.Children.length) {
                    walkTree(branch.Children, branch);
                } else {
                    treeData.leafBranchesById[branch.Id] = branch;
                }
            });
        };
        walkTree(treeData.treeBranches);
        return treeData;
    };

    render(treeBranches: BranchClass[]): void {
        this.treeHeader = document.createElement("div");
        this.treeMain = document.createElement("div");
        this.treeFooter = document.createElement("div");
        this.treeHeader.classList.add("tree-header");
        this.treeMain.classList.add("tree-main");
        this.treeFooter.classList.add("tree-footer");

        const treeElement: HTMLDivElement = this.createRootElement();
        treeElement.appendChild(this.buildTree(0,treeBranches, 0));
        this.bindEvent(treeElement);
        empty(this.treeContainer);
        this.treeContainer.appendChild(this.treeHeader);
        this.treeContainer.appendChild(this.treeMain);
        this.treeContainer.appendChild(this.treeFooter);
        this.treeMain.appendChild(treeElement);
        treeElement.addEventListener("click",(e: Event)=>{

            Object.values(this.liElementsById).forEach((element: HTMLLIElement)=>{
                element.classList.remove("_selected");
            });

            const liEle: HTMLLIElement = (<HTMLElement>e.target).closest("LI");
            if (liEle) {
                liEle.classList.add("_selected");
            }
        });

    };

    getValues(): number[] {
        const values: number[] = [];
        for (const id in this.treeStore.leafBranchesById) {
          if (id in this.treeStore.leafBranchesById) {
            if (
              this.treeStore.leafBranchesById[id].Status === 1 ||
              this.treeStore.leafBranchesById[id].Status === 2
            ) {
              values.push(Number(id));
            }
          }
        }
        return values;
    };

    setValues(values: number[]): void {
        this.emptyBranchesCheckStatus();
        values.forEach(value => {
            this.setValue(value);
        });
        this.updateListItemElements();
        const {onChange} = this.options;
        if(onChange) {
            onChange.call(this);
        }
    };

    setDisable(value: number): void {
        const branch: BranchClass = this.treeStore.branchesById[value];
        if (!branch) {return;}
        const prevDisabled: boolean = branch.Disabled;
        if (!prevDisabled) {
            branch.Disabled = true;
            this.markWillUpdateBranch(branch);
            this.walkOut(branch, "disabled");
            this.walkIn(branch, "disabled");
        }
    };

    getDisables(): number[] {
        const values: number[] = [];
        for (const id in this.treeStore.leafBranchesById) {
            if (id in this.treeStore.leafBranchesById) {
                if (this.treeStore.leafBranchesById[id].Disabled) {
                    values.push(Number(id));
                }
            }
        }
        return values;
    };

    setDisables(values: number[]): void {
        this.emptyBranchesDisable();
        values.forEach(value => {
            this.setDisable(value);
        });
        this.updateListItemElements();
    };

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    buildTree(id: number, branches: BranchClass[], depth: number, level: number = 0): HTMLUListElement {
        const rootUlEle: HTMLUListElement = this.createUnorderedListElelement(id);
        if (branches && branches.length) {
            branches.forEach(branch => {
                const liEle: HTMLLIElement = this.createListItemElement(
                    branch,
                    depth === this.options.closeDepth - 1,
                    level
                );
                this.liElementsById[branch.Id] = liEle;
                let ulEle: HTMLUListElement  = null;
                if (branch.Children && branch.Children.length) {
                    ulEle = this.buildTree(branch.Id, branch.Children, depth + 1, level + 1);
                }
                if(ulEle) {
                    liEle.appendChild(ulEle);
                }
                rootUlEle.appendChild(liEle);
                if (branch.Type === STR.section && branch.Sequence<0) {
                    liEle.style.display = "none";
                }
            });
        }
        return rootUlEle;
    };

    bindEvent(ele: HTMLElement): void {
        ele.addEventListener(
            "click", (e: Event) => {
                const target: HTMLElement  = <HTMLElement>e.target;
                if (
                    target.nodeName === "DIV" &&
                    (
                        target.classList.contains("checkbox")
                        ||
                        target.classList.contains("label")
                    )
                ) {
                    this.onItemClick(Number(target.closest("li").branchId));
                } else if (
                    target.nodeName === "LI" &&
                    target.classList.contains("branch")
                ) {
                    this.onItemClick(Number(target.branchId));
                } else if (
                    target.nodeName === "DIV" &&
                    (
                        target.classList.contains("switcher")
                        ||
                        target.classList.contains("spacer")
                        ||
                        target.classList.contains("percent")
                    )
                ) {
                    this.onSwitcherClick(target);
                }
            },
            false
        );
        /*
        ele.addEventListener("resize",(e)=>{

        })
        */
    };

    onItemClick(id: number): void {
//        console.time('onItemClick');
        const branch: BranchClass = this.treeStore.branchesById[id];
        const onChange: Function = this.options.onChange;
        if (!branch.Disabled) {
            this.setValue(id);
            this.updateListItemElements();
        }
        if(onChange) {
            onChange.call(this);
        }
//        console.timeEnd('onItemClick');
    };

    setValue(value: number): void {
        const branch: BranchClass = this.treeStore.branchesById[value];
        if (!branch) {return;}
        const prevStatus: number = branch.Status;
        const status: number = prevStatus === 1 || prevStatus === 2 ? 0 : 2;
        branch.Status = status;
        this.markWillUpdateBranch(branch);
        this.walkOut(branch, "status");
        this.walkIn(branch, "status");
    };

    setPercentLinearGradient(div: HTMLDivElement, value: number = null): void {
        value = value || 0;
        div.style.background = `linear-gradient(to right, rgba(0,0,0,0.666) ${value}%, rgba(0,0,0,0.333) ${value}%)`;
        div.innerHTML = `${(value || 0 ).toFixed(0)}%`;
    }

    updatePercent(branch: BranchClass): void{
        const li: HTMLLIElement = this.liElementsById[branch.Id];
        const percentDiv: HTMLDivElement = li.querySelector(".percent");
        this.setPercentLinearGradient(percentDiv, branch.Percent);
        if (branch.Children.length){
            branch.Children.forEach((childBranch: BranchClass) => {
                this.updatePercent(childBranch);
            });
        }
    }

    updateAllPercents(): void {
        this.treeStore.linearBranches.filter((branch: BranchClass)=>{
            return branch.ParentId === 0;
        }).forEach((branch: BranchClass)=>{
            this.updatePercent(branch, branch.Percent);
        });
    }

    updateListItemElements(): void {
        this.willUpdateBranchesById.forEach(branch => {
            this.updateListItemElement(branch);
        });
        this.willUpdateBranchesById = [];
    };

    markWillUpdateBranch(branch: BranchClass): void {
        this.willUpdateBranchesById.push(branch);
    };

    onSwitcherClick(target: HTMLElement): void {
        const liEle: HTMLElement = <HTMLElement>target.closest("li");
        const ele: HTMLElement = <HTMLElement>liEle.lastChild;
        const height: number = ele.scrollHeight;
        if (liEle.classList.contains("_close")) {
            animation(10, {
                enter: function(): void {
                    ele.style.height = "0";
                    ele.style.opacity = "0";
                },
                active: function(): void {
                    ele.style.height = `${height}px`;
                    ele.style.opacity = "1";
                },
                leave: function(): void {
                    ele.style.height = "";
                    ele.style.opacity = "";
                    liEle.classList.remove("_close");
                },
            });
        } else {
            animation(150, {
                enter: function(): void {
                    ele.style.height = `${height}px`;
                    ele.style.opacity = "1";
                },
                active: function(): void {
                    ele.style.height = "0";
                    ele.style.opacity = "0";
                },
                leave: function(): void {
                    ele.style.height = "";
                    ele.style.opacity = "";
                    liEle.classList.add("_close");
                },
            });
        }
    };

    public walkOut(branch: BranchClass, changeState: string): void {
        const {Parent: parent} = branch;
        if (parent) {
            if (changeState === "status") {
                let parentStatus: number = null;
                const statusCount: number = parent.Children.reduce((acc, child) => {
                if (!isNaN(child.Status)) {
                    return acc + child.Status;
                }
                return acc;
            }, 0);

            if (statusCount) {
                parentStatus = statusCount === parent.Children.length * 2 ? 2 : 1;
            } else {
                parentStatus = 0;
            }
            if (parent.Status === parentStatus) {return;}
                parent.Status = parentStatus;
            } else {
                const parentIsDisabled: boolean = parent.Children.reduce(
                    (acc, child) => acc && child.Disabled,
                    true
                );
                if (parent.Disabled === parentIsDisabled) {
                    return;
                }
                parent.Disabled = parentIsDisabled;
            }
            this.markWillUpdateBranch(parent);
            this.walkOut(parent, changeState);
        }
    }

    walkIn(branch: BranchClass, changeState: any): void {
        if (branch.Children && branch.Children.length) {
            branch.Children.forEach((child: BranchClass) => {
                if (changeState === "status") {
                    if(child.Disabled) {
                        return;
                    }
                    child.Status = branch.Status;
                } else if (changeState==="checked") {
                    child.Checked = branch.Checked;
                } else if (changeState==="disabled") {
                    child.Disabled = branch.Disabled;
                }
                this.markWillUpdateBranch(child);
                this.walkIn(child, changeState);
            });
        }
    }

    updateListItemElement(branch: BranchClass): void {
        const {classList} = this.liElementsById[branch.Id];
        switch (branch.Status) {
            case 0:
                classList.remove("_halfchecked", "_checked");
            break;
            case 1:
                classList.remove("_checked");
                classList.add("_halfchecked");
            break;
            case 2:
                classList.remove("_halfchecked");
                classList.add("_checked","selected");
            break;
            default: break;
        }

        switch (branch.Disabled) {
            case true:
                if (!classList.contains("_disabled")) {
                    classList.add("_disabled");
                }
            break;
            case false:
                if (classList.contains("_disabled")) {
                    classList.remove("_disabled");
                }
            break;
            default: break;
        }
    };

    collapseAll(): void {
        const leafBranchesById: BranchClassCollectionItem = this.treeStore.leafBranchesById;
        Object.values(leafBranchesById).forEach((leafBranch: BranchClass )=>{
            collapseFromLeaf(this, leafBranch);
        });
    }

    expandAll(): void {
        expandFromRoot(this, this.treeStore.treeBranches[0]);
    }

    createUnorderedListElelement(id: number): HTMLUListElement {
        const ul: HTMLUListElement = document.createElement("ul");
        ul.id = `ul-${id}`;
        ul.classList.add("branches");
        return ul;
    };
    get randomBranch(): BranchClass{
        let branch: BranchClass;
        do {
            const items: BranchClass[] = Object.values(this.treeStore.branchesById);
            branch = items[Math.floor(Math.random() * items.length)];
        } while (branch.Children && branch.Children.length);
        return branch;
    }
/*
    resizeLabel(ele: HTMLLIElement){
        outerLabelWidth = spacerWidth + switcherWidth + checkboxWidth + percentWidth + 12;
        const labelWidth: string = `${this.treeContainer.clientWidth - outerLabelWidth}px`;
        label.style.width = labelWidth;
    }
*/
    createListItemElement(branch: BranchClass, closed: boolean, level: number): HTMLLIElement {
        const li: HTMLLIElement = document.createElement("li");
        li.id = `li-${branch.Id}`;
        li.setAttribute("draggable","true");
        branch.HtmlLiElement = li;
        let spacerWidth: number = 0;
        const switcherWidth: number = $moduleSize;
        const checkboxWidth: number = $moduleSize;
        let outerLabelWidth: number = 0;
        const percentWidth: number = $moduleSize * 5;

        li.classList.add("branch");
        const divline: HTMLDivElement = document.createElement("div");
        divline.classList.add("divline");

        const spacer: HTMLDivElement = document.createElement("div");
        spacer.classList.add("spacer");
        divline.appendChild(spacer);

        if (closed) {li.classList.add("_close");}
        if (branch.Children && branch.Children.length) {
          spacerWidth = level * $moduleSize;
          spacer.style.width = `${spacerWidth}px`;
          const switcher: HTMLDivElement = document.createElement("div");
          switcher.classList.add("switcher");
          divline.appendChild(switcher);
        } else {
          spacerWidth = (level+1) * $moduleSize;
          spacer.style.width = `${spacerWidth}px`;
          li.classList.add("placeholder");
        }
        const checkbox: HTMLDivElement = document.createElement("div");
        checkbox.classList.add("checkbox");
        if (this.options.selectMode && this.options.selectMode==="radio"){
            checkbox.classList.add("radio");
        }
        divline.appendChild(checkbox);
        const label: HTMLDivElement = document.createElement("div");
        label.classList.add("label");
        label.innerHTML = branch.Name;
        divline.appendChild(label);
        li.branchId = String(branch.Id);

        checkbox.setAttribute("draggable","false");
        spacer.setAttribute("draggable","false");
        divline.setAttribute("draggable","false");

        const percent: HTMLDivElement = document.createElement("div");
        percent.innerHTML="0%";
        percent.classList.add("percent");
        percent.style.width = `${percentWidth}px`;
        divline.appendChild(percent);
        outerLabelWidth = spacerWidth + switcherWidth + checkboxWidth + percentWidth + 12;
        const labelWidth: string = `${this.treeContainer.clientWidth - outerLabelWidth}px`;
        label.style.width = labelWidth;
        label.style.minWidth = labelWidth;
        label.style.maxWidth = labelWidth;
        divline.style.gridTemplateColumns = `${spacerWidth}px ${switcherWidth}px ${checkboxWidth}px ${labelWidth} ${percentWidth}px`;

        li.appendChild(divline);
        percent.setAttribute("draggable","false");
        label.setAttribute("draggable","false");
        checkbox.setAttribute("draggable","false");
        spacer.setAttribute("draggable","false");
        divline.setAttribute("draggable","false");
        return li;
    };

    // eslint-disable-next-line @typescript-eslint/ban-types
    load(callback: Function): void {
//        console.time('load');
        const {url, method, beforeLoad} = this.options;
        wTreeAjax({
            url,
            method,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            success: (result: BranchClass[]) => {
                let data: BranchClass[];
                if (beforeLoad) {
                    data = beforeLoad(result);
                } else {
                    data = result;
                }
                callback(data);
            },
        });
    };
}


customElements.define("w-tree", WTree);
