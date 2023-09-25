import { TPartStave, TScoreObject } from "./TScoreObject";
import { LibraryClass } from "./LibraryClass";

export class ScoreClass extends LibraryClass {
/*
    protected fields: IScoreFields = {
        scoreId: undefined,
        parentRackId: undefined,
        sequence: undefined,
        status: undefined,
        title: undefined,
        subtitle: undefined,
        author: undefined,
        measures: undefined,
        parts: undefined,
        mainKey: undefined,
        tempot: undefined,
    };
*/
    public get ScoreObject(): TScoreObject {
        return <TScoreObject>this.fields;
    }

    public get Id(): number {
        return this.ScoreId;
    }

    public get ParentId(): number {
        return this.ParentRackId;
    }

    protected set ParentId(parentId: number) {
        this.ParentRackId = parentId;
    }

    public get ScoreId(): number {
        return this.ScoreObject.scoreId;
    }

    public set ScoreId(scoreId: number) {
        if (this.ScoreObject.scoreId !== scoreId) {
            this.ScoreObject.scoreId = scoreId;
            this.FieldsChanged = true;
        }
    }

    public get ParentRackId(): number {
        return Number(this.ScoreObject.parentRackId);
    }

    public set ParentRackId(parentRackId: number) {
        if (this.ScoreObject.parentRackId !== parentRackId) {
            this.ScoreObject.parentRackId = parentRackId;
            this.FieldsChanged = true;
            if (this.updateField("parentRackId",parentRackId)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    public get Sequence(): number {
        return this.ScoreObject.sequence;
    }

    public set Sequence(sequence: number) {
        if (this.ScoreObject.sequence !== sequence) {
            this.ScoreObject.sequence = sequence;
            this.FieldsChanged = true;
            if (this.updateField("sequence",sequence)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    public get Status(): string[] {
        return this.ScoreObject.status;
    }

    public set Status(status: string[]) {
        if (JSON.stringify(this.ScoreObject.status) !== JSON.stringify(status)) {
            this.ScoreObject.status = status;
            this.FieldsChanged = true;
        }
    }

    public get Title(): string {
        return this.ScoreObject.title;
    }

    public set Title(title: string) {
        if (this.ScoreObject.title !== title) {
            this.ScoreObject.title = title;
            this.FieldsChanged = true;
            if (this.updateField("title",title)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    public get Subtitle(): string {
        return this.ScoreObject.subtitle;
    }

    public set Subtitle(subtitle: string) {
        if (this.ScoreObject.subtitle !== subtitle) {
            this.ScoreObject.subtitle = subtitle;
            this.FieldsChanged = true;
            if (this.updateField("subtitle",subtitle)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    public get Author(): string {
        return this.ScoreObject.author;
    }

    public set Author(author: string) {
        if (this.ScoreObject.author !== author) {
            this.ScoreObject.author = author;
            this.FieldsChanged = true;
            if (this.updateField("author",author)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    public get MainKey(): number {
        return this.ScoreObject.mainKey || 0;
    }

    public set MainKey(mainKey: number) {
        if (
            this.ScoreObject.mainKey !== mainKey &&
            mainKey >= -7 &&
            mainKey <= 7
        ) {
            this.ScoreObject.mainKey = Math.floor(mainKey);
            this.FieldsChanged = true;
        }
    }

    public get Measures(): number {
        return this.ScoreObject.measures;
    }

    public set Measures(measures: number) {
        if (this.ScoreObject.measures !== measures) {
            this.ScoreObject.measures = measures;
            this.FieldsChanged = true;
        }
    }

    public get Parts(): TPartStave[] {
        return this.ScoreObject.parts;
    }

    public set Parts(parts: TPartStave[]) {
        if (JSON.stringify(this.ScoreObject.parts) !== JSON.stringify(parts)) {
            this.ScoreObject.parts = parts;
            this.FieldsChanged = true;
            if (this.updateField("parts",parts)) {
                console.log(this.constructor.name, "update success");
            } else {
                console.log(this.constructor.name, "update fail");
            }
        }
    }

    protected updateField(field: string, value: any): boolean {
        return this.$updateDb({
            table:"scores",
            pkey:"scoreId",
            id:this.ScoreId,
            field: field,
            value: value,
        }) !== null;
    }

}

