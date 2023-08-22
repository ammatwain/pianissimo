import "./WPropertyEditor.scss";

export class WPropertyEditor extends HTMLElement{
    private table: HTMLTableElement = null;
    private templateData: any = {
        name : {},
        key : {},
        keys : {},

    };
    constructor() {
        super();
    }

    connectedCallback(): void{
        this.table = <HTMLTableElement>document.createElement("table");
        this.appendChild(this.table);
    }

    set template(templateData: any) {
        this.templateData = templateData;
    }

    set properties(props: any) {
        if (this.table) {
            this.table.innerHTML = "";
            Object.keys(props).sort().forEach((key: string)=>{
                if (Object.keys(this.templateData).length === 0 || key in this.templateData){
                    const input: HTMLInputElement = document.createElement("input");
                    const tdKey: HTMLTableCellElement = document.createElement("td");
                    tdKey.classList.add("key");
                    const tdValue: HTMLTableCellElement = document.createElement("td");
                    tdValue.classList.add("value");
                    tdKey.innerHTML = key;
                    tdValue.appendChild(input);
                    input.placeholder = String(props[key]);
                    const tr: HTMLTableRowElement = document.createElement("tr");
                    tr.appendChild(tdKey);
                    tr.appendChild(tdValue);
                    this.table.appendChild(tr);
                }
            });
        }
    }

    setProperty(input: HTMLInputElement, key: string, value: any): void {
        if (Object.keys(this.templateData).length === 0 || key in this.templateData){
            input.value = value;
        }
    }
}

customElements.define("w-property-editor", WPropertyEditor);
