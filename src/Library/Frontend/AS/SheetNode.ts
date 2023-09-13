import { ASSCSS } from "./ASCSS";
import { ASNode } from "./ASNode";
import { BookNode } from "./BookNode";

ASSCSS.SheetNode = {
};

export class SheetNode extends BookNode {
}

customElements.define("sheet-node", SheetNode);
