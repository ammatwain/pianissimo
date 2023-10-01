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

    public calculatePlayerMeasures(measureStart: number, measureEnd: number): number[] {
        const sheet: MusicSheet = this.data.osmd.Sheet;
        const playMeasures: number[] = [];
        const playMeasureIndex: number = -1;
        const temporaryPlayMeasures: number[] = [];
        let latestPlayMeasureIndex: number = -1;
        console.log(measureStart,0);
        console.log(measureEnd,sheet.SourceMeasures.length-1);

        if (measureStart===0 && measureEnd===sheet.SourceMeasures.length-1){
            sheet.SourceMeasures.forEach((m: SourceMeasure, currentPlayMeasureIndex: number)=>{
                if(latestPlayMeasureIndex < currentPlayMeasureIndex) {
                    temporaryPlayMeasures.push(currentPlayMeasureIndex);
                    // le istruzioni di salto sono a fine misura, vanno scodate
                    const lri: RepetitionInstruction[] = m.LastRepetitionInstructions;
                    for(let i: number = lri.length-1; i >= 0 ; i--) {
                        const ri: RepetitionInstruction = lri[i];
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
        } else {
            for (let i: number = measureStart ; i <= measureEnd; i++) {
                playMeasures.push(i);
            }
            playMeasures.push(-1);
        }
        console.log(playMeasures);
        return playMeasures;
    }

}
