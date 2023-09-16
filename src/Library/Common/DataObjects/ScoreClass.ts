import { TScoreObject } from "./TScoreObject";
import { LibraryClass } from "./LibraryClass";
import { TMajorKey } from "./TFieldTypes";

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
        mainKey: undefined,
        measures: undefined,
        parts: undefined,
    };
*/
    declare protected fields: TScoreObject;

    public set Fields(fields: TScoreObject) {
        super.Fields = fields;
    }

    public get ScoreFields(): TScoreObject {
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
        return this.ScoreFields.scoreId;
    }

    public set ScoreId(scoreId: number) {
        if (this.ScoreFields.scoreId !== scoreId) {
            this.ScoreFields.scoreId = scoreId;
            this.FieldsChanged = true;
        }
    }

    public get ParentRackId(): number {
        return this.ScoreFields.parentRackId;
    }

    public set ParentRackId(parentRackId: number) {
        if (this.ScoreFields.parentRackId !== parentRackId) {
            this.ScoreFields.parentRackId = parentRackId;
            this.FieldsChanged = true;
        }
    }

    public get Sequence(): number {
        return this.ScoreFields.sequence;
    }

    public set Sequence(sequence: number) {
        if (this.ScoreFields.sequence !== sequence) {
            this.ScoreFields.sequence = sequence;
            this.FieldsChanged = true;
        }
    }

    public get Status(): string {
        return this.ScoreFields.status;
    }

    public set Status(status: string) {
        if (this.ScoreFields.status !== status) {
            this.ScoreFields.status = status;
            this.FieldsChanged = true;
        }
    }

    public get Title(): string {
        return this.ScoreFields.title;
    }

    public set Title(title: string) {
        if (this.ScoreFields.title !== title) {
            this.ScoreFields.title = title;
            this.FieldsChanged = true;
        }
    }

    public get Subtitle(): string {
        return this.ScoreFields.subtitle;
    }

    public set Subtitle(subtitle: string) {
        if (this.ScoreFields.subtitle !== subtitle) {
            this.ScoreFields.subtitle = subtitle;
            this.FieldsChanged = true;
        }
    }

    public get Author(): string {
        return this.ScoreFields.author;
    }

    public set Author(author: string) {
        if (this.ScoreFields.author !== author) {
            this.ScoreFields.author = author;
            this.FieldsChanged = true;
        }
    }

    public get MainKey(): TMajorKey {
        return this.ScoreFields.mainKey;
    }

    public set MainKey(mainKey: TMajorKey) {
        if (
            this.ScoreFields.mainKey !== mainKey &&
            mainKey >= -7 &&
            mainKey <= 7
        ) {
            this.ScoreFields.mainKey = <TMajorKey>Math.floor(mainKey);
            this.FieldsChanged = true;
        }
    }

    public get Measures(): number {
        return this.ScoreFields.measures;
    }

    public set Measures(measures: number) {
        if (this.ScoreFields.measures !== measures) {
            this.ScoreFields.measures = measures;
            this.FieldsChanged = true;
        }
    }

    public get Parts(): string {
        return this.ScoreFields.parts;
    }

    public set Parts(parts: string) {
        if (this.ScoreFields.parts !== parts) {
            this.ScoreFields.parts = parts;
            this.FieldsChanged = true;
        }
    }

}
