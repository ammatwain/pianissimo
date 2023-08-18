import { default as wTreeAjax } from "./WTreeAjax";
import { WPropertyEditor } from "../WPropertyEditor";
import "./style/style.scss";
import STYLE from "./style/variables.module.scss";

//const { moduleSize } = STYLE;
const $moduleSize: number  =  Number(parseInt(STYLE.moduleSize));

import { IEntry, ITreeBranch, ITreeStore } from "../../Common";

declare global {
    interface ParentNode {
        branchId: string;
    }
    interface HTMLLIElement {
        branchId: string;
    }
}

function deepClone(obj: ITreeBranch[] ): ITreeBranch[] {
  return JSON.parse(JSON.stringify(obj));
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

function collapseFromLeaf(tree: WTree, leafBranch: ITreeBranch) {
  try {
    const branchListItemElement: HTMLLIElement = tree.liElementsById[leafBranch.parent.id];
    if(!branchListItemElement.classList.contains('_close')) {
        (<HTMLDivElement>branchListItemElement.querySelector('switcher')).click();
    }
  } catch (error) {
    return;
  }
  if('parent' in leafBranch) {
    collapseFromLeaf(tree, leafBranch.parent);
  }
}

function expandFromRoot(tree: WTree, root: ITreeBranch) {
    const branchListItemElement = tree.liElementsById[root.id];
    if(branchListItemElement.classList.contains('_close')) {
        (<HTMLDivElement>branchListItemElement.querySelector('switcher')).click();
    }
    if('children' in root) {
        for(let child of root.children) {
            expandFromRoot(tree, child);
        }
    }
}

interface ITreeOptions {
    data?: ITreeBranch[];
    selectMode?: string;
    values?: string[];
    url?: string;
    method?: string;
    closeDepth?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    disables?: any[];
    // eslint-disable-next-line @typescript-eslint/ban-types
    onChange?: Function;
    // eslint-disable-next-line @typescript-eslint/ban-types
    beforeLoad?: Function;
    // eslint-disable-next-line @typescript-eslint/ban-types
    afterLoad?: Function;
}

export class WTree extends HTMLElement{
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    private initcount: number = 0;
    private defaultOptions: ITreeOptions = {
        selectMode: 'checkbox',
        values: [],
        disables: [],
        beforeLoad: Function,
        afterLoad: Function,
        onChange: Function,
        url: null,
        method: 'GET',
        closeDepth: null,
    }
    private treeStore: ITreeStore = {};
    private treeContainer: HTMLDivElement = null;
    private propContainer: HTMLDivElement = null;
    private propEditor: WPropertyEditor = null;

    public liElementsById: {[index: string]: HTMLLIElement} = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private willUpdateBranchesById: any = {};
    private options: ITreeOptions;
    get values() {
        return this.getValues();
    }
    set values (values: string[]) {
        this.setValues(uniq(values));
    }
    get disables(): string[] {
        return this.getDisables();
    }
    set disables (values) {
        this.setDisables(uniq(values));
    }

    get onChange(): Function {
        return this.options.onChange || null;
    }

    set onChange(func: Function) {
        this.options.onChange = func;
    }

    get selectedBranches(): ITreeBranch[] {
        const branches: ITreeBranch[] = [];
        const branchesById: {[index: string]: ITreeBranch} = this.treeStore.branchesById;
        for (const id in branchesById) {
        if (
            id in branchesById &&
            (branchesById[id].status === 1 || branchesById[id].status === 2)
        ) {
            const branch = Object.assign({}, branchesById[id]);
            delete branch.parent;
            delete branch.children;
            branches.push(branch);
        }
        }
        return branches;
    }

    fillPropertyEditor(id: string) {
        const ele: IEntry = Object.assign({},this.treeStore.branchesById[id]);
        delete ele.parent;
        delete ele.children;
        this.propEditor.properties = ele;
    }

    get disabledBranches(): ITreeBranch[] {
        const branches: ITreeBranch[] = [];
        const branchesById: {[index: string]: ITreeBranch} = this.treeStore.branchesById;
        for (const id in branchesById) {
            if (id in branchesById && branchesById[id].disabled) {
                const branch: ITreeBranch = <ITreeBranch>Object.assign({}, branchesById[id]);
                delete branch.parent;
                branches.push(branch);
            }
        }
        return branches;
    }

    public getLeafById(id: string): ITreeBranch {
        return this.treeStore.leafBranchesById[id] || null;
    }

    constructor(options: ITreeOptions ) {
        super();
        this.options = Object.assign(this.defaultOptions, options);
    }

    connectedCallback(){
        this.treeContainer = document.createElement("div");
        this.treeContainer.classList.add("tree-container");
        this.appendChild(this.treeContainer);
        this.propContainer = document.createElement("div");
        this.propContainer.classList.add("prop-container");
        this.propEditor = document.createElement("w-property-editor");
        this.propContainer.appendChild(this.propEditor);
        this.appendChild(this.propContainer);
        if (this.options.url) {
            this.load((data: ITreeBranch[]) => {
              this.initialize(data);
            });
        } else if (this.options.data){
            this.initialize(this.options.data);
        } else {
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
    }

    createRootElement(): HTMLDivElement {
        const div: HTMLDivElement = <HTMLDivElement>document.createElement('div');
        div.classList.add('tree');
        return div;
    };

    emptyBranchesCheckStatus(): void {
        this.willUpdateBranchesById = this.getSelectedBranchesById();
        Object.values(this.willUpdateBranchesById).forEach((branch: ITreeBranch) => {
          if (!branch.disabled) branch.status = 0;
        });
    };

    emptyBranchesDisable(): void {
        this.willUpdateBranchesById = this.getDisabledBranchesById();
        Object.values(this.willUpdateBranchesById).forEach((branch: ITreeBranch) => {
          branch.disabled = false;
        });
    };

    initialize(data: ITreeBranch[] ) {
        this.initcount++;
//        console.log("INIT COUNTER",this.initcount);
//        console.time('init');
        this.treeStore = this.parseTreeData(data);
        this.render(this.treeStore.treeBranches);
        const {values, disables, afterLoad} = this.options;

        if (values && values.length) {
            this.treeStore.defaultValues = values;
        }

        this.treeStore.defaultValues.length && this.setValues(this.treeStore.defaultValues);
        if (disables && disables.length) {
            this.treeStore.defaultDisables = disables;
        }

        this.treeStore.defaultDisables.length && this.setDisables(this.treeStore.defaultDisables);
        this.updateAllPercents();
        afterLoad && afterLoad.call(this);
//        console.timeEnd('init');
    };

    parseTreeData(data: ITreeBranch[]): ITreeStore {

        const treeData: ITreeStore = {
            treeBranches: deepClone(data),
            branchesById: {},
            leafBranchesById: {},
            defaultValues: [],
            defaultDisables: [],
        }

        const walkTree = function(branches: ITreeBranch[], parent: any = null) {
            branches.forEach((branch: ITreeBranch)  => {
                treeData.branchesById[branch.id] = branch;
                if (branch.checked) treeData.defaultValues.push(String(branch.id));
                if (branch.disabled) treeData.defaultDisables.push(String(branch.id));
                if (parent) branch.parent = parent;
                if (branch.children && branch.children.length) {
                    walkTree(branch.children, branch);
                } else {
                    treeData.leafBranchesById[branch.id] = branch;
                }
            });
        };
        walkTree(treeData.treeBranches);
        return treeData;
    };

    render(treeBranches : ITreeBranch[]) {
        const treeElement = this.createRootElement();
        treeElement.appendChild(this.buildTree(treeBranches, 0));
        this.bindEvent(treeElement);
        empty(this.treeContainer);
        this.treeContainer.appendChild(treeElement);
        treeElement.addEventListener("click",(e: Event)=>{

            Object.values(this.liElementsById).forEach((element: HTMLLIElement)=>{
                element.classList.remove("_selected");
            });

            const liEle: HTMLLIElement = (<HTMLElement>e.target).closest('LI');
            if (liEle) {
                liEle.classList.add("_selected");
            }
        });

    };

    getValues() {
        const values: string[] = [];
        for (const id in this.treeStore.leafBranchesById) {
          if (id in this.treeStore.leafBranchesById) {
            if (
              this.treeStore.leafBranchesById[id].status === 1 ||
              this.treeStore.leafBranchesById[id].status === 2
            ) {
              values.push(id);
            }
          }
        }
        return values;
    };

    setValues(values: string[]) {
        this.emptyBranchesCheckStatus();
        values.forEach(value => {
            this.setValue(value);
        });
        this.updateListItemElements();
        const {onChange} = this.options;
        onChange && onChange.call(this);
    };

    setDisable(value: string): void {
        const branch = this.treeStore.branchesById[value];
        if (!branch) return;
        const prevDisabled = branch.disabled;
        if (!prevDisabled) {
            branch.disabled = true;
            this.markWillUpdateBranch(branch);
            this.walkOut(branch, 'disabled');
            this.walkIn(branch, 'disabled');
        }
    };

    getDisables(): string[] {
        const values = [];
        for (const id in this.treeStore.leafBranchesById) {
            if (id in this.treeStore.leafBranchesById) {
                if (this.treeStore.leafBranchesById[id].disabled) {
                    values.push(id);
                }
            }
        }
        return values;
    };

    setDisables(values: string[]) {
        this.emptyBranchesDisable();
        values.forEach(value => {
            this.setDisable(value);
        });
        this.updateListItemElements();
    };

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    buildTree(branches: ITreeBranch[], depth: number, level: number = 0) {
        const rootUlEle = this.createUnorderedListElelement();
        if (branches && branches.length) {
            branches.forEach(branch => {
                const liEle = this.createListItemElement(
                    branch,
                    depth === this.options.closeDepth - 1,
                    level
                );
                this.liElementsById[branch.id] = liEle;
                let ulEle = null;
                if (branch.children && branch.children.length) {
                    ulEle = this.buildTree(branch.children, depth + 1, level + 1);
                }
                ulEle && liEle.appendChild(ulEle);
                rootUlEle.appendChild(liEle);
            });
        }
        return rootUlEle;
    };

    bindEvent(ele: HTMLElement): void {
        ele.addEventListener(
            'click', (e: Event) => {
                const target: HTMLElement  = <HTMLElement>e.target;
                if (
                    target.nodeName === 'DIV' &&
                    (
                        target.classList.contains('checkbox')
                        ||
                        target.classList.contains('label')
                    )
                ) {
                    this.onItemClick(target.closest("li").branchId);
                } else if (
                    target.nodeName === 'LI' &&
                    target.classList.contains('branch')
                ) {
                    this.onItemClick(target.branchId);
                } else if (
                    target.nodeName === 'DIV' &&
                    (
                        target.classList.contains('switcher')
                        ||
                        target.classList.contains('spacer')
                        ||
                        target.classList.contains('percent')
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

    onItemClick(id: string): void {
//        console.time('onItemClick');
        const branch = this.treeStore.branchesById[id];
        const onChange = this.options.onChange;
        if (!branch.disabled) {
            this.setValue(id);
            this.updateListItemElements();
        }
        onChange && onChange.call(this);
//        console.timeEnd('onItemClick');
    };

    setValue(value: string): void {
        const branch = this.treeStore.branchesById[value];
        if (!branch) return;
        const prevStatus = branch.status;
        const status = prevStatus === 1 || prevStatus === 2 ? 0 : 2;
        branch.status = status;
        this.markWillUpdateBranch(branch);
        this.walkOut(branch, 'status');
        this.walkIn(branch, 'status');
    };
    setPercentLinearGradient(div: HTMLDivElement, value: number = null) {
        value = value || 0;
        div.style.background = `linear-gradient(to right, rgba(0,0,0,0.666) ${value}%, rgba(0,0,0,0.333) ${value}%)`;
        div.innerHTML = `${(value || 0 ).toFixed(0)}%`;
    }
    setPercent(branch: ITreeBranch, value: number): void{
        if (!branch.children || branch.children.length===0){
            branch.percent = value;
            const li = this.liElementsById[branch.id];
            const percentDiv: HTMLDivElement = li.querySelector(".percent");
            this.setPercentLinearGradient(percentDiv, branch.percent);

            if (branch.parent){
                this.updatePercents(branch.parent);
            }
        }
//        console.log(branch.id, 'percent update',value)
    }

    updatePercents(branch: ITreeBranch){
        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        let thisPercent: number = 0;
        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        let childrenPercent: number = 0;

        if (branch.children && branch.children.length>0){
            thisPercent = branch.children.length * 100;
            branch.children.forEach((n: ITreeBranch)=>{
                childrenPercent += (n.percent || 0);
            });
        }
        branch.percent = (((childrenPercent / thisPercent) * 100) || 0);
        const li = this.liElementsById[branch.id];
        const percentDiv: HTMLDivElement = li.querySelector(".percent");
        this.setPercentLinearGradient(percentDiv, branch.percent);

        if (branch.parent){
            this.updatePercents(branch.parent);
        }
    }

    updateAllPercents(): void {
        Object.values(this.treeStore.branchesById).forEach((branch: ITreeBranch)=>{
//            console.log(branch.id);
            if (!(branch.children && branch.children.length)){
                this.setPercent(branch, branch.percent);
            }
        });
    }

    getSelectedBranchesById(): ITreeBranch {
        return Object.entries(this.treeStore.branchesById).reduce((acc: {[index: string]: ITreeBranch}, [id, branch]) => {
            if (branch.status === 1 || branch.status === 2) {
                acc[id] = branch;
            }
            return acc;
        }, {});
    };

    getDisabledBranchesById(): ITreeBranch {
        return Object.entries(this.treeStore.branchesById).reduce((acc: {[index: string]: ITreeBranch}, [id, branch]) => {
            if (branch.disabled) {
                acc[id] = branch;
            }
            return acc;
        }, {});
    };

    updateListItemElements(): void {
        Object.values(this.willUpdateBranchesById).forEach(branch => {
            this.updateListItemElement(branch);
        });
        this.willUpdateBranchesById = {};
    };

    markWillUpdateBranch(branch: ITreeBranch): void {
        this.willUpdateBranchesById[branch.id] = branch;
    };

    onSwitcherClick(target: HTMLElement) {
        const liEle: HTMLElement = <HTMLElement>target.closest("li");
        const ele: HTMLElement = <HTMLElement>liEle.lastChild;
        const height = ele.scrollHeight;
        if (liEle.classList.contains('_close')) {
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
                    ele.style.height = '';
                    ele.style.opacity = '';
                    liEle.classList.remove('_close');
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
                    ele.style.height = '';
                    ele.style.opacity = '';
                    liEle.classList.add('_close');
                },
            });
        }
    };

    public walkOut(branch: ITreeBranch, changeState: string) {
        const {parent} = branch;
        if (parent) {
            if (changeState === 'status') {
                let parentStatus = null;
                const statusCount = parent.children.reduce((acc, child) => {
                if (!isNaN(child.status)) {
                    return acc + child.status;
                }
                return acc;
            }, 0);

            if (statusCount) {
                parentStatus = statusCount === parent.children.length * 2 ? 2 : 1;
            } else {
                parentStatus = 0;
            }
            if (parent.status === parentStatus) return;
                parent.status = parentStatus;
            } else {
                const pDisabled = parent.children.reduce(
                    (acc, child) => acc && child.disabled,
                    true
                );
                if (parent.disabled === pDisabled) return;
                parent.disabled = pDisabled;
            }
            this.markWillUpdateBranch(parent);
            this.walkOut(parent, changeState);
        }
    }

    walkIn(branch: ITreeBranch, changeState: any) {
        if (branch.children && branch.children.length) {
            branch.children.forEach((child: ITreeBranch) => {
                if (changeState === 'status') {
                    if(child.disabled) {
                        return;
                    }
                    child.status = branch.status;
                } else if (changeState==='checked') {
                    child.checked = branch.checked;
                } else if (changeState==='disabled') {
                    child.disabled = branch.disabled;
                }
                this.markWillUpdateBranch(child);
                this.walkIn(child, changeState);
            });
        }
    }

    updateListItemElement(branch: ITreeBranch): void {
        const {classList} = this.liElementsById[branch.id];
        switch (branch.status) {
            case 0:
                classList.remove('_halfchecked', '_checked');
            break;
            case 1:
                classList.remove('_checked');
                classList.add('_halfchecked');
            break;
            case 2:
                classList.remove('_halfchecked');
                classList.add('_checked','selected');
            break;
        }

        switch (branch.disabled) {
            case true:
                if (!classList.contains('_disabled')) {
                    classList.add('_disabled');
                }
            break;
            case false:
                if (classList.contains('_disabled')) {
                    classList.remove('_disabled');
                }
            break;
        }
    };

    collapseAll() {
        const leafBranchesById = this.treeStore.leafBranchesById;
        for(let id in leafBranchesById) {
            const leafBranch = leafBranchesById[id];
            collapseFromLeaf(this, leafBranch);
        }
    }

    expandAll() {
        expandFromRoot(this, this.treeStore.treeBranches[0]);
    }

    createUnorderedListElelement(): HTMLUListElement {
        const ul: HTMLUListElement = document.createElement('ul');
        ul.classList.add('branches');
        return ul;
    };
    get randomBranch(): ITreeBranch{
        let branch: ITreeBranch;
        do {
            const items: ITreeBranch[] = Object.values(this.treeStore.branchesById);
            branch = items[Math.floor(Math.random() * items.length)];
        } while (branch.children && branch.children.length);
        return branch;
    }
/*
    resizeLabel(ele: HTMLLIElement){
        outerLabelWidth = spacerWidth + switcherWidth + checkboxWidth + percentWidth + 12;
        const labelWidth: string = `${this.treeContainer.clientWidth - outerLabelWidth}px`;
        label.style.width = labelWidth;
    }
*/
    createListItemElement(branch: ITreeBranch, closed: boolean, level: number): HTMLLIElement {
        const li: HTMLLIElement = document.createElement('li');
        let spacerWidth: number = 0;
        const switcherWidth: number = $moduleSize;
        const checkboxWidth: number = $moduleSize;
        let outerLabelWidth: number = 0;
        const percentWidth: number = $moduleSize * 5;

        li.classList.add('branch');
        const divline: HTMLDivElement = document.createElement('div');

        divline.classList.add("divline");

        const spacer: HTMLDivElement = document.createElement('div');
        spacer.classList.add('spacer');
        divline.appendChild(spacer);

        if (closed) li.classList.add('_close');
        if (branch.children && branch.children.length) {
          spacerWidth = level * $moduleSize;
          spacer.style.width = `${spacerWidth}px`;
          const switcher:HTMLDivElement = document.createElement('div');
          switcher.classList.add('switcher');
          divline.appendChild(switcher);
        } else {
          spacerWidth = (level+1) * $moduleSize;
          spacer.style.width = `${spacerWidth}px`;
          li.classList.add('placeholder');
        }
        const checkbox: HTMLDivElement = document.createElement('div');
        checkbox.classList.add('checkbox');
        divline.appendChild(checkbox);
        const label: HTMLDivElement = document.createElement('div');
        label.classList.add('label');
        label.innerHTML = branch.name
        divline.appendChild(label);
        li.branchId = branch.id;

        const percent: HTMLDivElement = document.createElement('div');
        percent.innerHTML="0%";
        percent.classList.add('percent');
        percent.style.width = `${percentWidth}px`;
        divline.appendChild(percent);
        outerLabelWidth = spacerWidth + switcherWidth + checkboxWidth + percentWidth + 12;
        const labelWidth: string = `${this.treeContainer.clientWidth - outerLabelWidth}px`;
        label.style.width = labelWidth;
        label.style.minWidth = labelWidth;
        label.style.maxWidth = labelWidth;
        divline.style.gridTemplateColumns = `${spacerWidth}px ${switcherWidth}px ${checkboxWidth}px ${labelWidth} ${percentWidth}px`;

        li.appendChild(divline);
        return li;
    };

    // eslint-disable-next-line @typescript-eslint/ban-types
    load(callback: Function) {
//        console.time('load');
        const {url, method, beforeLoad} = this.options;
        wTreeAjax({
            url,
            method,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            success: (result: any) => {
                let data = result;
//                console.timeEnd('load');
                if (beforeLoad) {
                    data = beforeLoad(result);
                }
                callback(data);
            },
        });
    };
}


customElements.define("w-tree", WTree);
