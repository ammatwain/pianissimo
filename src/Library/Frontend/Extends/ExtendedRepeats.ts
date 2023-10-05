import { MusicSheet, ExtendedOSMD, RepetitionInstruction, SourceMeasure } from "./ExtendedOSMD";
import { ExtendedRepetitions } from "./ExtendedRepetitions";

interface IShetFlowCalculatorData {
    osmd?: ExtendedOSMD;
}

export class ExtendedRepeats {

    private sheet: MusicSheet;

    constructor(sheet: MusicSheet) {
        if(sheet instanceof MusicSheet) {
            this.sheet = sheet;
        }
    }

    public get Sheet(): MusicSheet {
        return this.sheet;
    }

    public calculatePlayerMeasures(): number[] {
        const playMeasures: number[] = [];
        const playMeasureIndex: number = -1;
        const temporaryPlayMeasures: number[] = [];
        let latestPlayMeasureIndex: number = -1;

        this.Sheet.SourceMeasures.forEach((m: SourceMeasure, currentPlayMeasureIndex: number)=>{
            if(latestPlayMeasureIndex < currentPlayMeasureIndex) {
                temporaryPlayMeasures.push(currentPlayMeasureIndex);
                // le istruzioni di salto sono a fine misura, vanno scodate
                const lri: RepetitionInstruction[] = m.LastRepetitionInstructions;
                for(let i: number = lri.length-1; i >= 0 ; i--) {
                    const ri: RepetitionInstruction = lri[i];
                    const repetitions: ExtendedRepetitions = new ExtendedRepetitions(ri.type, this.Sheet.SourceMeasures, currentPlayMeasureIndex);
                    const array: number[] = repetitions.array;
                    array.forEach((n: number)=>{
                        temporaryPlayMeasures.push(n);
                    });

                }
                latestPlayMeasureIndex = temporaryPlayMeasures[temporaryPlayMeasures.length-1];
            }
        });

        for(let i: number = 0 ; i < temporaryPlayMeasures.length; i++) {
            if (temporaryPlayMeasures[i] === -1) {
                break;
            }
            playMeasures.push(temporaryPlayMeasures[i]);
        }
        playMeasures.push(-1);

        return playMeasures;
    }

}
