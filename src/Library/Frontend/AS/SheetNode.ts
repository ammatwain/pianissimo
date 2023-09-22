import { ASCSS } from "./ASCSS";
import {
    TVariableMajorKeyNumberArray,
    SheetClass
} from "@Common/DataObjects";

import { LibraryNode } from "./LibraryNode";
import { ScoreNode } from "./ScoreNode";
import { ASModal } from "./ASModal";
import { ASNode } from "./ASNode";

ASCSS.SheetNode = {
};

export class SheetNode extends LibraryNode {

    constructor (sheetFields: SheetClass, parentScore: ScoreNode)  {
        super({adoptable: false, canAdopt: false});
        this.SheetFields = sheetFields;
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
            ASModal.show("Sheet Settings");
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

/*
    protected fields: ISheetFields = {
        sheetId: undefined,
        parentScoreId: undefined,
        sequence: undefined,
        status: undefined,
        title: undefined,
        subtitle: undefined,
        activeKey: undefined,
        activeKeys: undefined,
        measureStart: undefined,
        measureEnd: undefined,
        selectedParts: undefined,
        selectedStaves: undefined,
        transposeBy: undefined,
        shot: undefined,
        done: undefined,
        loop: undefined,
    };
*/
    public get SheetFields(): SheetClass {
        return <SheetClass>this.fields;
    }

    public set SheetFields(sheetFields: SheetClass) {
        this.fields = sheetFields;
    }

    public get Id(): number {
        return this.SheetId;
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

    public get SheetId(): number {
        return this.SheetFields.SheetId;
    }

    public set SheetId(sheetId: number) {
        this.SheetFields.SheetId = sheetId;
    }

    public get ParentScoreId(): number {
        return this.SheetFields.ParentScoreId;
    }

    public set ParentScoreId(parentScoreId: number) {
        this.SheetFields.ParentScoreId = parentScoreId;
    }

    public get Sequence(): number {
        return this.SheetFields.Sequence;
    }

    public set Sequence(sequence: number) {
        this.SheetFields.Sequence = sequence;
    }

    public get Status(): string {
        return this.SheetFields.Status;
    }

    public set Status(status: string) {
        this.SheetFields.Status = status;
    }

    public get Title(): string {
        return this.SheetFields.Title;
    }

    public set Title(title: string) {
        this.SheetFields.Title = title;
    }

    public get Subtitle(): string {
        return this.SheetFields.Subtitle;
    }

    public set Subtitle(subtitle: string) {
        this.SheetFields.Subtitle = subtitle;
    }

    public get Author(): string {
        return this.ParentScore.Author;
    }

    public get MainKey(): number {
        return this.ParentScore.MainKey;
    }

    public get Measures(): number {
        return this.ParentScore.Measures;
    }

    public get Parts(): string {
        return this.ParentScore.Parts;
    }

    public get ActiveKey(): number {
        return this.SheetFields.ActiveKey;
    }

    public set ActiveKey(activeKey: number) {
        this.SheetFields.ActiveKey = activeKey;
    }

    public get PracticeKeys(): number[] {
        return this.SheetFields.PracticeKeys.split(",").map(Number);
    }

    public set PracticeKeys(activeKeys: TVariableMajorKeyNumberArray) {
        const activeKeyString: string = activeKeys.sort().join(",");
        if (this.SheetFields.PracticeKeys !== activeKeyString) {
            this.SheetFields.PracticeKeys = activeKeyString;
            this.FieldsChanged = true;
        }
    }

    public addActiveKey(activeKey: number): void {
        if (activeKey>=-7 && activeKey<=7){
            const activeKeys: TVariableMajorKeyNumberArray = this.PracticeKeys;
            if (activeKeys.indexOf(activeKey)===-1){
                activeKeys.push(activeKey);
                this.PracticeKeys = activeKeys.sort();
            }
        }
    }

    public removeActiveKey(activeKey: number): void {
        if (activeKey>=-7 && activeKey<=7){
            const activeKeys: TVariableMajorKeyNumberArray = this.PracticeKeys;
            if (activeKeys.indexOf(activeKey)>=0){
                delete activeKeys[activeKeys.indexOf(activeKey)];
                this.PracticeKeys = activeKeys.sort();
            }
        }
    }

    public hasActiveKey(activeKey: number): boolean {
        if (activeKey>=-7 && activeKey<=7){
            const activeKeys: TVariableMajorKeyNumberArray = this.PracticeKeys;
            return activeKeys.indexOf(activeKey) >= 0;
        }
        return false;
    }

    /*
    activeKeys: undefined,
    measureStart: undefined,
    measureEnd: undefined,
    selectedParts: undefined,
    selectedStaves: undefined,
    transposeBy: undefined,
    shot: undefined,
    done: undefined,
    loop: undefined,
*/
    public doSelected(): void{
        ;
        console.log(this.SheetId, "SELECTED!");
    }
}

customElements.define("sheet-node", SheetNode);
