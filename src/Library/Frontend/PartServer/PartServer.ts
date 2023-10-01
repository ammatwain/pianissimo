import { THiddenPart, TPartStave } from "@Library/Common/DataObjects";
import { Instrument, MusicSheet, Staff } from "../Extends/ExtendedOpenMusicDisplayManager"

type TSheetPart = {partIndex: number, relativeStaveIndex: number};
export class PartServer {
    private sheet: MusicSheet;
    private partStaves: TPartStave[];
    private hiddenParts: THiddenPart;
    private sheetParts: TSheetPart[];
    constructor (sheet: MusicSheet, partStaces: TPartStave[], hiddenParts: THiddenPart) {
        this.sheet = sheet;
        this.partStaves = this.partStaves;
        this.hiddenParts = hiddenParts;
        this.sheetParts = this.setSheetParts();
    }

    private setSheetParts(): TSheetPart[] {
        const array: any[] = [];
        let partIndex: number = -1;
        this.sheet.Parts.forEach((part: Instrument) => {
            partIndex++;
            let staveRelativeIndex: number = -1;
            part.Staves.forEach((stave: Staff) => {
                staveRelativeIndex++;
                array.push({
                    partIndex: partIndex,
                    relativeStaveIndex: staveRelativeIndex,
                });
            });
        });
        return array;
    }

    public getAbsoluteStaveIndex(partIndex: number, relativeStaveIndex: number): number {
        return this.sheetParts.findIndex((part: TSheetPart) => {
            return part.partIndex === partIndex && part.relativeStaveIndex === relativeStaveIndex;
        });
    }

    public getSheetPart(absoluteStaveIndex: number): TSheetPart {
        return this.sheetParts[absoluteStaveIndex];
    }
}
