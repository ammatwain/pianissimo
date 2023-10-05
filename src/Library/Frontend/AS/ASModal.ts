import { ASCSS } from "./ASCSS";
import { ASCore } from "./ASCore";

ASCSS.ASModal = {
    "animation": "fadeOut 0.3s",
    "background-color":"rgba(0,0,0,0.4)",
    "cursor":"no-drop",
    "height":"100vh",
    "left":"0px",
    "opacity":"0",
    "position":"fixed",
    "top":"0px",
    "width":"100vw",
    ">.window":{
        "background-color":"#3f3f3f",
        "box-shadow": "2vmin 2vmin 10vmin #0c0a0f",
        "box-sizing":"border-box",
        "cursor":"default",
        "display":"grid",
        "gap":"1px",
        "grid-template-rows":"auto 1fr auto",
        "min-width":"20vh",
        "left":"50%",
        "position":"absolute",
        "top":"50%",
        //"transform":"translate(-50%,-75%)",
        "user-select":"none",
        ">.header": {
            "background-color":"#2b2b2b",
            "box-sizing":"content-box",
            "cursor":"grab",
            "display":"grid",
            "grid-template-columns":"1fr 24px",
            "line-height": "24px",
            "max-height": "24px",
            "min-height": "24px",
            "padding":"4px",
            ":active":{
                "cursor":"grabbing",
            },
            ">.caption":{
                "box-sizing":"content-box",
                "color": "#FFFFFF",
                "display": "inline-block",
                "left":"0px",
                "line-height": "24px",
                "max-height": "24px",
                "min-height": "24px",
                "padding-left":"8px",
                "vertical-align": "middle",
            },
            ">.cancel-icon":{
                "box-sizing":"content-box",
                "color": "#FFFFFF",
                "cursor":"pointer",
                "direction": "ltr",
                "display": "inline-block",
                "filter": "invert(100%)",
                "font-family": "icons",
                "font-feature-settings": "liga",
                "font-size": "24px",
                "font-style": "normal",
                "font-weight": "normal",
                "letter-spacing": "normal",
                "line-height": "1",
                "max-height": "24px",
                "max-width": "24px",
                "min-height": "24px",
                "min-width": "24px",
                "text-transform": "none",
                "white-space": "nowrap",
                "word-wrap": "normal",
                "-webkit-font-smoothing": "antialiased",
            },
        },
        ">.main":{
            "background-color":"#1f1f1f",
            "padding":"12px",
            "display":"grid",
            ">.label":{
                "color":"#868686",
                "padding-top":"4px",
            },
            ">input":{
                "min-width":"64ch",
            },
        },
        ">.footer":{
            "background-color":"#1f1f1f",
            "display":"grid",
            "gap":"4px",
            "grid-template-columns":"1fr 33% 33%",
            "padding":"12px",
            ">button":{
                "cursor":"pointer",
                "padding":"12px",
            },
        },
    },
    ".visible":{
        "animation": "fadeIn 0.3s",
        "opacity":"1",
    }
};

export class ASModal extends ASCore {
    protected $preConnect(): void {
        super.$preConnect();
        let caption: string = "";
        if ("caption" in this.$Argument){
            caption = this.$Argument.caption;
        }

        this.$Elements.caption = <HTMLDivElement>document.createElement("div");
        this.$Elements.caption.classList.add("caption");
        this.$Elements.caption.textContent = caption;

        this.$Elements.cancelIcon = <HTMLElement>document.createElement("i");
        this.$Elements.cancelIcon.classList.add("cancel-icon");
        this.$Elements.cancelIcon.textContent = "cancel";

        this.$Elements.header = <HTMLDivElement>document.createElement("div");
        this.$Elements.header.classList.add("header");
        this.$Elements.header.appendChild(this.$Elements.caption);
        this.$Elements.header.appendChild(this.$Elements.cancelIcon);

        this.$Elements.main = <HTMLDivElement>document.createElement("main");
        this.$Elements.main.classList.add("main");

        this.$Elements.spacer = <HTMLDivElement>document.createElement("div");
        this.$Elements.spacer.classList.add("spacer");

        this.$Elements.cancelButton = <HTMLButtonElement>document.createElement("button");
        this.$Elements.okButton = <HTMLButtonElement>document.createElement("button");
        //this.$Elements.goButton = <HTMLButtonElement>document.createElement("button");
        //this.$Elements.goButton.style.display = "none";
        this.$Elements.cancelButton.innerHTML = "Cancel";
        this.$Elements.okButton.innerHTML = "Ok";
        //this.$Elements.goButton.innerHTML = "Ok & Go!";

        this.$Elements.footer = <HTMLDivElement>document.createElement("div");
        this.$Elements.footer.classList.add("footer");

        this.$Elements.footer.appendChild(this.$Elements.spacer);
        this.$Elements.footer.appendChild(this.$Elements.cancelButton);
        this.$Elements.footer.appendChild(this.$Elements.okButton);
        //this.$Elements.footer.appendChild(this.$Elements.goButton);

        this.$Elements.window = <HTMLDivElement>document.createElement("div");
        this.$Elements.window.classList.add("window");
        this.$Elements.window.appendChild(this.$Elements.header);
        this.$Elements.window.appendChild(this.$Elements.main);
        this.$Elements.window.appendChild(this.$Elements.footer);

        this.appendChild(this.$Elements.window);
    }

    protected $alwaysConnect(): void {
        super.$alwaysConnect();
        this.$Elements.cancelIcon.onclick = (): void => {
            this.classList.remove("visible");
        };

        this.$Elements.cancelButton.onclick = (): void => {
            this.classList.remove("visible");
        };

        this.$Elements.okButton.onclick = (): void => {
            this.okAction();
            this.classList.remove("visible");
        };

        this.addEventListener("animationend", (event: AnimationEvent) => {
            if (event.animationName==="fadeOut"){
                this.parentElement.removeChild(this);
            }
        });

        this.$Elements.caption.onmousedown = (mouseEvent: MouseEvent): void => {
//            this.requestPointerLock();

            const moveElement: any = (event: MouseEvent): void => {
                const currentX: number = event.clientX;
                const currentY: number = event.clientY;
                const left: number = (this.$Elements.window.offsetLeft + event.movementX);
                const top: number = (this.$Elements.window.offsetTop + event.movementY);
                const right: number = (this.$Elements.window.offsetLeft + this.$Elements.window.offsetWidth + event.movementX);
                const bottom: number = (this.$Elements.window.offsetTop + this.$Elements.window.offsetHeight + event.movementY);

                if (
                    left >=0 &&
                    top >= 0 &&
                    right <= this.offsetWidth &&
                    bottom <= this.offsetHeight
                ) {
                    this.$Elements.window.style.left = `${left}px`;
                    this.$Elements.window.style.top = `${top}px`;
                }
            };

            const stopElement: any = (event: MouseEvent): void => {
//                document.exitPointerLock();
                document.removeEventListener("mousemove", moveElement);
                document.removeEventListener("mouseup", stopElement);
            };

            document.addEventListener("mousemove", moveElement);
            document.addEventListener("mouseup", stopElement);

        };
    }

    public center(): ASModal {
        const left: number = (this.offsetWidth - this.$Elements.window.offsetWidth) * 0.5;
        const top: number = (this.offsetHeight - this.$Elements.window.offsetHeight) * 0.25;
        this.$Elements.window.style.left = `${left}px`;
        this.$Elements.window.style.top = `${top}px`;
        return this;
    }

    public show(): ASModal {
        console.log("SHOW");
        this.classList.add("visible");
        document.body.appendChild(this);
        return this.center();
    }

    public okAction(): void {
        ;
    }

}

customElements.define("as-modal", ASModal);

