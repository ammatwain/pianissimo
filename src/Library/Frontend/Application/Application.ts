import "./Application.scss";

export class Application {
    private header: HTMLDivElement;
    private footer: HTMLDivElement;
    private left: HTMLDivElement;
    private right: HTMLDivElement;
    private main: HTMLDivElement;
    private library: any;

    constructor(){
        this.setListeners();
    }

    setListeners(): void{
        document.addEventListener("DOMContentLoaded",(event: Event)=>{
            this.header = <HTMLDivElement>document.querySelector("#header");
            this.footer = <HTMLDivElement>document.querySelector("#footer");
            this.left = <HTMLDivElement>document.querySelector("#left");
            this.right = <HTMLDivElement>document.querySelector("#right");
            this.main = <HTMLDivElement>document.querySelector("#main");
            window.electron.ipcRenderer.invoke("request-library-index").then((result: any)=>{
                this.library = result;
                this.buildTree(this.library);
            });
        });
    }

    buildTree(library: any) {
        library.racks.forEach((rack: any)=>{
            console.log(rack.title);
        });
    }
}
