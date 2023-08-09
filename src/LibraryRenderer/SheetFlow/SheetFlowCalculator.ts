import { MusicSheet, OpenSheetMusicDisplay, RepetitionInstruction, SourceMeasure } from "opensheetmusicdisplay";
import { Repetitions } from "./Repetitions";

interface IShetFlowCalculatorData {
    osmd?: OpenSheetMusicDisplay;
}

export class SheetFlowCalculator {
    private data: IShetFlowCalculatorData = {};

    constructor(osmd: OpenSheetMusicDisplay) {
        if(osmd instanceof OpenSheetMusicDisplay) {
            this.data.osmd = osmd;
        }
    }

    public calculatePlayerMeasures(): number[] {
        const sheet: MusicSheet = this.data.osmd.Sheet;
        let playMeasures : number[] = [];
        let playMeasureIndex: number = -1;
        const temporaryPlayMeasures: number[] = [];
        let latestPlayMeasureIndex: number = -1;
    
        sheet.SourceMeasures.forEach((m: SourceMeasure, currentPlayMeasureIndex: number)=>{
            if(latestPlayMeasureIndex < currentPlayMeasureIndex) {
                temporaryPlayMeasures.push(currentPlayMeasureIndex);
                // le istruzioni di salto sono a fine misura, vanno scodate
                const lri: RepetitionInstruction[] = m.LastRepetitionInstructions;
                for(let i: number = lri.length-1; i >= 0 ; i--) {
                    let ri: RepetitionInstruction = lri[i];
                    const repetitions: Repetitions = new Repetitions(ri.type, sheet.SourceMeasures, currentPlayMeasureIndex);
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