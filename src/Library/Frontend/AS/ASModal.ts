import { ASCSS } from "./ASCSS";
import { AS, ASCore } from "./ASCore";

ASCSS.ASModal = {
    "animation": "fadeOut 0.3s",
    "background-color":"rgba(0,0,0,0.4)",
    "display":"block",
    "height":"100vh",
    "left":"0px",
    "opacity":"0",
    "position":"fixed",
    "top":"0px",
    "width":"100vw",
    ">.window":{
        "background-color":"#1f1f1f",
        "box-shadow": "2vmin 2vmin 10vmin black",
        "box-sizing":"border-box",
        "display":"block",
        "height":"50vh",
        "left":"25vw",
        "position":"absolute",
        "top":"15vh",
        "user-select":"none",
        "width":"50vw",
        ">.caption":{
            "background-color":"#2b2b2b",
            "border-bottom":"1px solid #3f3f3f",
            "box-sizing":"content-box",
            "color": "#FFFFFF",
            "display": "block",
            "left":"0px",
            "line-height": "24px",
            "max-height": "24px",
            "min-height": "24px",
            "padding":"4px",
            "padding-left":"8px",
            "position":"relative",
            "top":"0px",
            "vertical-align": "middle",
        },
        ">.cancel":{
            "box-sizing":"content-box",
            "color": "#FFFFFF",
            "cursor":"pointer",
            "direction": "ltr",
            "display": "inline-block",
//            "filter": "invert(8%) sepia(94%) saturate(4590%) hue-rotate(358deg) brightness(101%) contrast(112%)",
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
            "padding":"4px",
            "position":"absolute",
            "right":"0px",
            "text-transform": "none",
            "top":"0px",
            "white-space": "nowrap",
            "word-wrap": "normal",
            "-webkit-font-smoothing": "antialiased",
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
        this.$Elements.window = <HTMLDivElement>document.createElement("div");
        this.$Elements.window.classList.add("window");

        this.$Elements.caption = <HTMLDivElement>document.createElement("div");
        this.$Elements.caption.classList.add("caption");
        this.$Elements.caption.textContent = caption;
        this.$Elements.window.appendChild(this.$Elements.caption);

        this.$Elements.cancel = <HTMLElement>document.createElement("i");
        this.$Elements.cancel.classList.add("cancel");
        this.$Elements.cancel.textContent = "cancel";
        this.$Elements.window.appendChild(this.$Elements.cancel);

        this.appendChild(this.$Elements.window);
    }

    protected $alwaysConnect(): void {
        super.$alwaysConnect();
        this.classList.add("visible");
        this.$Elements.cancel.onclick = (): void => {
            this.classList.remove("visible");
        };
        this.addEventListener("animationend", (event: AnimationEvent) => {
            if (event.animationName==="fadeOut"){
                this.parentElement.removeChild(this);
            }
        });
    }

    static show(caption: string): ASModal {
        const modal: ASModal = new ASModal({caption: caption});
        document.body.appendChild(modal);
        return modal;
    }
}

customElements.define("as-modal", ASModal);

