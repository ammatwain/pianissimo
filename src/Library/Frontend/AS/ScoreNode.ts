import { ASCSS } from "./ASCSS";
import { ScoreClass, TPartStave } from "@Common/DataObjects";
import { LibraryNode } from "./LibraryNode";
import { RackNode } from "./RackNode";
import { ASModalScore } from "./ASModalScore";
import { SheetNode } from "./SheetNode";

ASCSS.ScoreNode = {
};

export class ScoreNode extends LibraryNode {

    constructor (scoreClass: ScoreClass, parentRack: RackNode | LibraryNode)  {
        super({adoptable: true, canAdopt: false});
        this.ScoreClass = scoreClass;
        if (
            parentRack &&
            (
                parentRack instanceof RackNode ||
                parentRack instanceof LibraryNode
            )
        ) {
            parentRack.$appendNode(this);
        }
        this.$Caption = this.ScoreClass.Title;
    }

    protected $preConnect(): void {
        super.$preConnect();
        this.$Elements.delete.style.display = "";
        this.$Elements.addRack.style.display = "none";
        this.$Elements.arrow.style.fill="#66f";
    }

    protected $alwaysConnect(): void {
        super.$alwaysConnect();

        this.$Elements.add.onclick = (): void => {
            console.log(this.$Items.length);
            this.Root.Library.newSheetObject(this.Id, this.$Items.length);
            console.log(this.$Items.length);
            this.$Closed = false;
            console.log(this.constructor.name, "clicked", "add");
        };
        this.$Elements.delete.onclick = (): void => {
            this.Library.deleteLibraryObject(this.ScoreId);
            console.log(this.constructor.name, "clicked", "delete");
        };
        this.$Elements.settings.onclick = (): void => {
            ASModalScore.showFromNode(this, "Rack Settings");
            console.log(this.constructor.name, "clicked", "settings");
        };
    }

    protected $getClosed(): boolean {
        return (this.$Items.length > 1) && this.classList.contains("closed");
    }

    public $selfRemove(): ScoreNode {
        const parentLibraryNode: LibraryNode = this.ParentRack || this.Root || null;
        super.$selfRemove();
        if (parentLibraryNode &&
            parentLibraryNode instanceof LibraryNode
        ) {
            if (this.$Checked) {
                parentLibraryNode.$Checked = true;
            }
            if (parentLibraryNode.$Items.length < 1){
                parentLibraryNode.classList.add("closed");
            }
        }
        return this;
    }

    public get ScoreClass(): ScoreClass {
        return <ScoreClass>this.fields;
    }

    public set ScoreClass(scoreFields: ScoreClass) {
        this.fields = scoreFields;
    }

    public get DefaultSheet(): SheetNode{
        if (this.Sheets.length) {
            return this.Sheets[0];
        } else {
            return null;
        }
    }

    public get Id(): number {
        return this.ScoreId;
    }

    public get ParentId(): number {
        return this.ParentRackId;
    }

    public set ParentId(parentId: number) {
        this.ParentRackId = parentId;
    }

    public get ScoreId(): number {
        return this.ScoreClass.ScoreId;
    }

    public set ScoreId(scoreId: number) {
        this.ScoreClass.ScoreId = scoreId;
    }

    public get ParentRackId(): number {
        return this.ScoreClass.ParentRackId;
    }

    public set ParentRackId(parentRackId: number) {
        this.ScoreClass.ParentRackId = parentRackId;
    }

    public get Sheets(): SheetNode[] {
        return <SheetNode[]>this.$Items;
    }

    public get Sequence(): number {
        return this.ScoreClass.Sequence;
    }

    public set Sequence(sequence: number) {
        this.ScoreClass.Sequence = sequence;
    }

    public get Status(): string[] {
        return this.ScoreClass.Status;
    }

    public set Status(status: string[]) {
        this.ScoreClass.Status = status;
    }

    public get Title(): string {
        return this.ScoreClass.Title;
    }

    public set Title(title: string) {
        this.ScoreClass.Title = title;
    }

    public get Subtitle(): string {
        return this.ScoreClass.Subtitle;
    }

    public set Subtitle(subtitle: string) {
        this.ScoreClass.Subtitle = subtitle;
    }

    public get Author(): string {
        return this.ScoreClass.Author;
    }

    public set Author(author: string) {
        this.ScoreClass.Author = author;
    }

    public get MainKey(): number {
        return this.ScoreClass.MainKey;
    }

    public set MainKey(mainKey: number) {
        this.ScoreClass.MainKey = mainKey;
    }

    public get Measures(): number {
        return this.ScoreClass.Measures;
    }

    public set Measures(measures: number) {
        this.ScoreClass.Measures = measures;
    }

    public get Parts(): TPartStave[] {
        return this.ScoreClass.Parts;
    }

    public set Parts(parts: TPartStave[]) {
        this.ScoreClass.Parts = parts;
    }

    //

    public get ParentRack(): RackNode{
        if (this.$Parent instanceof RackNode) {
            return this.$Parent;
        } else {
            return null;
        }
    }

    public update(): void{
        this.$Caption = this.ScoreClass.Title;
        console.log(this.constructor.name, "updated");
    }
}

customElements.define("score-node", ScoreNode);
