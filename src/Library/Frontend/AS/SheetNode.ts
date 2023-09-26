import { ASCSS } from "./ASCSS";
import {
    TVariableMajorKeyNumberArray,
    SheetClass,
    TPartStave,
    THiddenPart
} from "@Common/DataObjects";

import { LibraryNode } from "./LibraryNode";
import { ScoreNode } from "./ScoreNode";
import { ASModal } from "./ASModal";
import { ASModalScore } from "./ASModalScore";

ASCSS.SheetNode = {
};

export class SheetNode extends LibraryNode {

    constructor (sheetFields: SheetClass, parentScore: ScoreNode)  {
        super({adoptable: false, canAdopt: false});
        this.SheetClass = sheetFields;
        if (parentScore && parentScore instanceof ScoreNode) {
            parentScore.$appendNode(this);
        }
        this.$Caption = sheetFields.Title;

    }

    protected $preConnect(): void {
        super.$preConnect();
        this.$Elements.arrow.style.fill="olive";
        this.$Elements.addRack.style.display = "none";
    }

    protected $alwaysConnect(): void {
        super.$alwaysConnect();
        if (this.Sequence===0) {
            this.style.display = "none";
        } else if (this.Sequence>0) {
            this.$Elements.delete.style.display = "";
        }
        this.$Elements.add.style.display = "none";
        this.$Elements.add.onclick = (): void => {
            ASModal.show("Sheet Add");
            console.log(this.constructor.name, "clicked", "add");
        };
        this.$Elements.delete.onclick = (): void => {
            this.Library.deleteLibraryObject(this.SheetId);
            console.log(this.ParentScore.$Items.length);
            console.log(this.constructor.name, "clicked", "delete");
        };
        this.$Elements.settings.onclick = (): void => {
            ASModalScore.showFromNode(this, "Sheet / Parent Score Settings");
            console.log(this.constructor.name, "clicked", "settings");
        };
    }

    public $selfRemove(): SheetNode {
        const parentScoreNode: ScoreNode = this.ParentScore;
        super.$selfRemove();
        if (parentScoreNode &&
            parentScoreNode instanceof ScoreNode
        ) {
            if (this.$Checked) {
                parentScoreNode.$Checked = true;
            }
            if (parentScoreNode.$Items.length <= 1) {
                parentScoreNode.classList.add("closed");
            }
        }
        return this;
    }

    public get ActiveKey(): number {
        return this.SheetClass.ActiveKey;
    }

    public set ActiveKey(activeKey: number) {
        this.SheetClass.ActiveKey = activeKey;
    }

    public get Author(): string {
        return this.ParentScore.Author;
    }

    public get HiddenParts(): THiddenPart {
        return this.SheetClass.HiddenParts;
    }

    public set HiddenParts(hiddenParts: THiddenPart) {
        this.SheetClass.HiddenParts = hiddenParts;
    }

    public get Id(): number {
        return this.SheetId;
    }

    public get MainKey(): number {
        return this.ParentScore.MainKey;
    }

    public get Measures(): number {
        return this.ParentScore.Measures;
    }

    public get MeasureEnd(): number {
        return this.SheetClass.MeasureEnd;
    }

    public set MeasureEnd(measureEnd: number) {
        this.SheetClass.MeasureEnd = measureEnd;
    }

    public get MeasureStart(): number {
        return this.SheetClass.MeasureStart;
    }

    public set MeasureStart(measureStart: number) {
        this.SheetClass.MeasureStart = measureStart;
    }

    public get ParentId(): number {
        return this.ParentScoreId;
    }

    public set ParentId(parentId: number) {
        this.ParentScoreId = parentId;
    }

    public get ParentScore(): ScoreNode{
        if (this.$Parent instanceof ScoreNode) {
            return this.$Parent;
        } else {
            return null;
        }
    }

    public get ParentScoreId(): number {
        return this.SheetClass.ParentScoreId;
    }

    public set ParentScoreId(parentScoreId: number) {
        this.SheetClass.ParentScoreId = parentScoreId;
    }

    public get Parts(): TPartStave[] {
        return this.ParentScore.Parts;
    }

    public get PracticeKeys(): number[] {
        return this.SheetClass.PracticeKeys;
    }

    public set PracticeKeys(practiceKeys: number[]) {
        this.SheetClass.PracticeKeys = practiceKeys;
    }

    public get Sequence(): number {
        return this.SheetClass.Sequence;
    }

    public set Sequence(sequence: number) {
        this.SheetClass.Sequence = sequence;
    }

    public get SheetClass(): SheetClass {
        return <SheetClass>this.fields;
    }

    public set SheetClass(sheetClass: SheetClass) {
        this.fields = sheetClass;
    }

    public get SheetId(): number {
        return this.SheetClass.SheetId;
    }

    public set SheetId(sheetId: number) {
        this.SheetClass.SheetId = sheetId;
    }

    public get Status(): string[] {
        return this.SheetClass.Status;
    }

    public set Status(status: string[]) {
        this.SheetClass.Status = status;
    }

    public get Subtitle(): string {
        return this.SheetClass.Subtitle;
    }

    public set Subtitle(subtitle: string) {
        this.SheetClass.Subtitle = subtitle;
    }

    public get Title(): string {
        return this.SheetClass.Title;
    }

    public set Title(title: string) {
        this.SheetClass.Title = title;
    }

    public practiceKeysAdd(practiceKey: number): void {
        this.SheetClass.practiceKeysAdd(practiceKey);
    }

    public practiceKeysDel(practiceKey: number): void {
        this.SheetClass.practiceKeysDel(practiceKey);
    }

    public practiceKeysExists(practiceKey: number): boolean {
        return this.SheetClass.practiceKeysExists(practiceKey);
    }

    public doSelected(): void{
        ;
        console.log(this.SheetId, "SELECTED!");
    }

    public update(): void{
        this.$Caption = this.SheetClass.Title;
        console.log(this.constructor.name, "updated", this.PracticeKeys );
    }

}

customElements.define("sheet-node", SheetNode);
