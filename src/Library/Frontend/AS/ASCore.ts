/*
                            stop   |    prevent     | prevent "same element"
                          bubbling | default action | event handlers

return false                 Yes           Yes             No
preventDefault               No            Yes             No
stopPropagation              Yes           No              No
stopImmediatePropagation     Yes           No              Yes
*/

import { ASCSS } from "./ASCSS";

declare global {
    interface HTMLElement {
        insertAfter: (newNode: HTMLElement, existingNode: Node) => HTMLElement;
    }
}

HTMLElement.prototype.insertAfter = (newNode: HTMLElement, existingNode: Node): HTMLElement => {
    return existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
};

function ø( element: Element | string ): any {
    let NODES: any[] = [];
    if(element instanceof Element){
        NODES.push(element);
    } else {
        NODES = Array.from(document.querySelectorAll(element));
    }
    const OBJ: any = {
        nodes:NODES,
        attr: function(attr: string, value: string | number): any{
            NODES.forEach(node=>{
                node.setAttribute(attr,value);
            });
            return OBJ;
        },
        prop: function( prop: string, add: boolean = true): any{
            NODES.forEach(node=>{
            if (add){
                node.setAttribute(prop,"");
            } else {
                node.removeAttribute(prop);
            }
            });
            return OBJ;
        },
        class: {
            add: function(aClass: string): any{
                NODES.forEach(node=>{
                    node.classList.add(aClass);
                });
                return OBJ;
            },
            del: function(aClass: string): any{
                NODES.forEach(node=>{
                    node.classList.remove(aClass);
                });
                return OBJ;
            },
        },
        names: function(): any{
            console.log(this.nodes);
            return OBJ;
        },
        css: function(prop: string, value: string | number): any{
            NODES.forEach(node=>{
                node.style[prop]=value;
            });
            return OBJ;
        },
    };
    return OBJ;
}

interface IASCoreInternalData {
    arguments: {[index: string]: any};
    fn: {[index: string]: any};
    props: {[index: string]: any};
    kinds: {[key: string]: boolean};
    elements: {[index: string]: HTMLElement};
    originalHtml: string;
}

export class AS extends HTMLElement {
}

ASCSS.ASCore = {
    "font-weight":"100",
};

export class ASCore extends AS {

    private $: IASCoreInternalData;;

    constructor(args: any = {} ){
        super();

        this.$ClassChainArray.forEach((aClass: string)=>{
            this.classList.add(aClass);
        });

        this.$applyDefaultStyle();

        this.$ = {
            arguments: args,
            fn: {
                round: Math.round,
                min: Math.min,
                max: Math.max,
                create: document.createElement,
                log: console.log,
                rand: (max: number): number => { return Math.floor(Math.random() * max); },
            },
            props: {},
            kinds: {
                connected: false,
            },
            elements: {},
            originalHtml: this.innerHTML,
        };
        this.innerHTML = "";

        this.$preConnect();
    }

    private connectedCallback(): void{
        if (this.$Disconnected){
            this.$connect();
            this.$.kinds.connected = true;
        }
        this.$alwaysConnect();
    }

    /* ********************************************************************* */

    protected $applyDefaultStyle(): void{
        let classNames: string = "";
        this.$ClassChainArray.forEach((className: string)=>{
            classNames += `.${className}`;
            if (className in ASCSS) {
                let css: Element  = <Element>document.head.querySelector(`style[as-class-chain='${classNames}']`);
                if (!css){
                    const STYLE: any = {};
                    STYLE[classNames] = ASCSS[className];
                    css = document.createElement("style");
                    css.setAttribute("as-class-chain",classNames);
                    css.textContent = this.$processTemplateObject(STYLE);
                    document.head.appendChild(css);
                }
            }
        });
    }

    protected $defaultStyle(className: string): any {
        if (className in ASCSS) {
            return ASCSS[className] || {};
        } else {
            return {};
        }
    }

    private $getComputedStyle (property: string = null): string {
        const cs: any = window.getComputedStyle(this);
        if (property) {
            return cs[property];
        } else {
            return cs;
        }
    }

    protected $getConstructorChain(obj: any, type: string): any {
        const cs: any[] = [];
        let pt: any = obj;
        do {
           pt = Object.getPrototypeOf(pt);
           if (pt) {
                cs.push(pt.constructor || null);
           }
        } while (pt != null);
        return type === "names" ? cs.map(function(c) {
            return c ? c.toString().split(/\s|\(/)[1] : null;
        }) : cs;
    }

    private $processTemplateObject(cssTemplate: any, parents: string = ""): string{
        let s: string = "";
        if (cssTemplate instanceof Object) {
            Object.keys(cssTemplate).forEach((cssTemplateKey)=>{
                const value: any = cssTemplate[cssTemplateKey];
                if (value instanceof Object){
                    if (parents !== "") {s += "}\r\n";}
                    const par: string= `${parents}${cssTemplateKey}`;
                    s +=`${par}{\r\n${this.$processTemplateObject(value,par)}`;
                } else {
                    s += `\t${cssTemplateKey}:${value};\r\n`;
                }
            });
            if (parents === "") {s += "}\r\n";}
        }
        return s;
    }

    public $stopEvent(e: Event): boolean{
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
    }

    /* ************************** PSEUDO-ABSTRACT *************************** */

    protected $preConnect(): void {
        ;
    }

    protected $connect(): void {
        ;
    }

    protected $alwaysConnect(): void {
        ;
    }

    /* ********************************************************************* */

    public get $Connected(): boolean{
        return this.$.kinds.connected||false;
    }

    public get $Disconnected(): boolean{
        return !this.$Connected;
    }

    protected get $ClassChainArray(): string[] {
        const cn: string[] = this.$getConstructorChain(this,"names");
        const result: string[] = [];
        for(let i: number = cn.length-1; cn[i]!=="ASCore"; i--) {
            cn.pop();
        }
        for(let i: number = cn.length-1; i>=0; i--) {
            result.push(cn[i]);
        }
        return result;
    }

    protected get $ClassChainString(): string {
        return `.${this.$ClassChainArray.join(".")}`;
    }

    protected get $ClassChainID(): string {
        return this.$ClassChainArray.join("-");
    }

    protected get $Kind(): {[index: string]: boolean} {
        return this.$.kinds;
    }

    protected get $Argument(): {[index: string]: any} {
        return this.$.arguments;
    }

    protected get $Property(): {[index: string]: any} {
        return this.$.props;
    }

    public get $Elements(): {[index: string]: HTMLElement}{
        return this.$.elements;
    }

}
