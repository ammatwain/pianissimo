import "./style/style.scss";

class WawaDiv{
    private tag: string;
    private $: any = {
        params: {},
        props: {
            connected: false,
        },
    };

    private _element: HTMLElement = null;

    constructor(element: HTMLElement | string | any) {
        this.$.element = null;
        if (typeof element === "string") {
            if (!element.startsWith("#")){
                element = "#" + element;
            }
            element = document.querySelector(element);
        }
        if (element instanceof HTMLElement) {
            this.$.element = element;
        }
    }


    public get element(): HTMLElement {
        return (<HTMLElement>this.$.element);
    }

    public get param(): any {
        return this.$.params;
    }

    public set param(params: any) {
        this.$.params = params;
    }

    public get prop(): any {
        return this.$.prop;
    }

    public set prop(properties: any) {
        this.$.prop = properties;
    }

    public get connected(): boolean {
        return document.body.contains(this.element);
    }

    public get disconnected(): boolean {
        return !this.connected;
    }

    connect(): void {
        //
    }
}

export class WTabContainer extends WawaDiv{
    private tabs: HTMLElement[];
    private panels: HTMLElement[];
    constructor(element: HTMLElement | string | any) {
        super(element);
        this.tabs = [];
        this.panels = [];
        this.connect();
    }
    connect(): boolean {
        this.element.querySelectorAll("w-tab").forEach((tab: HTMLElement)=>{
            this.tabs.push(tab);
        });
        this.element.querySelectorAll("w-tab-panel").forEach((panel: HTMLElement)=>{
            this.panels.push(panel);
        });
//        document.addEventListener("DOMContentLoaded",()=>{
            this.tabs.forEach((tab: HTMLElement,i: number)=>{
                tab.addEventListener("click", () => {
                    this.activate(i);
                });
            });
//        });
        return true;
    }

    activate(index: number): void {
        this.tabs.forEach((tab: HTMLElement,i: number) => {
            if (i !== index) {
                tab.classList.remove("active");
            } else {
                tab.classList.add("active");
            }
        });
        this.panels.forEach((panel: HTMLElement,i: number) => {
            if (i !== index) {
                panel.classList.remove("active");
            } else {
                panel.classList.add("active");
            }
        });
    }

}
