import { ASCSS } from "./ASCSS";
import { ScoreClass } from "@Common/DataObjects";
import { LibraryNode } from "./LibraryNode";
import { RackNode } from "./RackNode";
import { ASModal } from "./ASModal";
import { ASModalScore } from "./ASModalScore";
import { SheetNode } from "./SheetNode";

ASCSS.ScoreNode = {
};

export class ScoreNode extends LibraryNode {

    constructor (scoreFields: ScoreClass, parentRack: RackNode | LibraryNode)  {
        super({adoptable: true, canAdopt: false});
        this.ScoreFields = scoreFields;
        if (
            parentRack &&
            (
                parentRack instanceof RackNode ||
                parentRack instanceof LibraryNode
            )
        ) {
            parentRack.$appendNode(this);
        }
        this.$Caption = this.ScoreFields.Title;
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

    public get ScoreFields(): ScoreClass {
        return <ScoreClass>this.fields;
    }

    public set ScoreFields(scoreFields: ScoreClass) {
        this.fields = scoreFields;
    }

    public get DefaultSheet(): SheetNode{
        return <SheetNode>this.$Items[0];
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
        return this.ScoreFields.ScoreId;
    }

    public set ScoreId(scoreId: number) {
        this.ScoreFields.ScoreId = scoreId;
    }

    public get ParentRackId(): number {
        return this.ScoreFields.ParentRackId;
    }

    public set ParentRackId(parentRackId: number) {
        this.ScoreFields.ParentRackId = parentRackId;
    }

    public get Sequence(): number {
        return this.ScoreFields.Sequence;
    }

    public set Sequence(sequence: number) {
        this.ScoreFields.Sequence = sequence;
    }

    public get Status(): string {
        return this.ScoreFields.Status;
    }

    public set Status(status: string) {
        this.ScoreFields.Status = status;
    }

    public get Title(): string {
        return this.ScoreFields.Title;
    }

    public set Title(title: string) {
        this.ScoreFields.Title = title;
    }

    public get Subtitle(): string {
        return this.ScoreFields.Subtitle;
    }

    public set Subtitle(subtitle: string) {
        this.ScoreFields.Subtitle = subtitle;
    }

    public get Author(): string {
        return this.ScoreFields.Author;
    }

    public set Author(author: string) {
        this.ScoreFields.Author = author;
    }

    public get MainKey(): number {
        return this.ScoreFields.MainKey;
    }

    public set MainKey(mainKey: number) {
        this.ScoreFields.MainKey = mainKey;
    }

    public get Measures(): number {
        return this.ScoreFields.Measures;
    }

    public set Measures(measures: number) {
        this.ScoreFields.Measures = measures;
    }

    public get Parts(): string {
        return this.ScoreFields.Parts;
    }

    public set Parts(parts: string) {
        this.ScoreFields.Parts = parts;
    }

    //

    public get ParentRack(): RackNode{
        if (this.$Parent instanceof RackNode) {
            return this.$Parent;
        } else {
            return null;
        }
    }

}

customElements.define("score-node", ScoreNode);
