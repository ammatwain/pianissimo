import { ASCSS } from "./ASCSS";
import { AS, ASCore } from "./ASCore";

ASCSS.MajorKeys = {
    "display":"grid",
    "grid-template-columns":"auto auto auto auto auto auto auto auto auto auto auto auto auto auto auto ",
};

export class MajorKeys extends ASCore {
    protected $preConnect(): void {
        super.$preConnect();
        for (let i: number = 0; i< 15; i++){
            const check: HTMLInputElement = <HTMLInputElement>document.createElement("input");
            check.setAttribute("type","checkbox");
            this.appendChild(check);
        }
    }
}

customElements.define("major-keys", MajorKeys);
