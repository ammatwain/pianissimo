//https://www.myriad-online.com/resources/docs/melody/italiano/breaks.htm
/*
0  0 StartLine,      // linea |             = Indica la prima battuta del brano da suonare.
0  1 ForwardJump,    // linea |:            = Inizio di un gruppo di battute che vanno suonate più volte.
1  2 BackJumpLine,   // linea :|            = Fine di un gruppo di battute che vanno suonate più volte.
1  3 Ending,         // linea |             = Indica l'ultima battuta del brano da suonare.
1  4 DaCapo,         // Salto               = D.C. Salta all'inizio del brano.
1  5 DalSegno,       // Salto               = Salta al Segno
1  6 Fine,           // Azione Condizionata = Fine dell'esecuzione se all'ultima volta.
1  7 ToCoda,         // Salto/Condizionato  = Salta al coda se all'ultima volta.
1  8 DalSegnoAlFine, // Salto               = Salta al Segno e termina l'esecuzione al simbolo Fine successivo.
1  9 DaCapoAlFine,   // Salto               = Salta all'inizio del brano e termina l'esecuzione al simbolo Fine successivo.
1 10 DalSegnoAlCoda, // Salto               = Salta al Segno e prosegue l'esecuzione fino al simbolo Coda (o al salto ToCoda ).
1 11 DaCapoAlCoda,   // Salto               = Salta all'inizio del brano e prosegue l'esecuzione fino al simbolo Coda  (o al salto toCoda ).
1 12 Coda,           // Destinazione salto  = Destinazione di "Salta al Coda" (Da Coda, ToCoda)
0 13 Segno,          // Destinazione salto  = Destinazione di "Salta al Segno" (D.S.)
? 14 None,

i segni non devono essere consumati
[
    [  0, null, null ], StartLine,      segno
    [  1, null, null ], ForwardJump,    segno
    [  2,    1, null ], BackJumpLine,   ripetizione 
    [  3, null, null ], Ending,         segno
    [  4,    0, null ], DaCapo,         ripetizione
    [  5,   13, null ], DalSegno,       ripetizione
    [  6, null, null ], Fine,           segno, risoluzione se ripetizione = 2
    [  7,   12, null ], ToCoda,         salto, salto se ripetizione = 2
    [  8,   13,    6 ], DalSegnoAlFine, ripetizione e risoluzione
    [  9,    0,    6 ], DaCapoAlFine,   ripetizione e risoluzione
    [ 10,   13,   12 ], DalSegnoAlCoda, ripetizione e ricerca del punto di (1 salto al coda)  o (2 al coda)
    [ 11,    0,   12 ], DaCapoAlCoda,   ripetizione e ricerca del punto di (1 salto al coda)  o (2 al coda)
    [ 12, null, null ], Coda,           segno, risoluzione?
    [ 13, null, null ], Segno,          segno,
]
[

]

*/

import { MusicSheet, OpenSheetMusicDisplay, RepetitionInstruction, RepetitionInstructionEnum, SourceMeasure } from "opensheetmusicdisplay";

type TRepeatSet = [RepetitionInstruction[],RepetitionInstruction[]];
type TRepeatSetArray = TRepeatSet[];

class RepetitionSignFinder {
    private sign: RepetitionInstructionEnum;
    private measures: SourceMeasure[] = [];
    private measureIndex: number;
    constructor(
        sign: RepetitionInstructionEnum,
        measures: SourceMeasure[],
        measureIndex: number
    ) {
        this.sign = sign;
        this.measures = measures;
        this.measureIndex = this.validateMeasureIndex(measureIndex);
    }

    validateMeasureIndex(measure: number): number {
        if (measure < 0) {
            measure = 0;
        } else if (measure > (this.measures.length - 1) ) {
            measure = (this.measures.length - 1);
        }
        return measure;
    }

    signInMeasure(sign: RepetitionInstructionEnum, measure: number): number {
        measure = this.validateMeasureIndex(measure);
        let m: SourceMeasure = this.measures[measure];
        let result: number = m.FirstRepetitionInstructions.findIndex((r: RepetitionInstruction)=>{
            return r.type = sign;
        });
        if (result<0) {
            result = m.FirstRepetitionInstructions.findIndex((r: RepetitionInstruction)=>{
                return r.type = sign;
            });
        }
        return result;
    }

    findBackward(sign: RepetitionInstructionEnum, defaultStart: number = -1): number {
        let startMeasure = this.validateMeasureIndex(this.measureIndex);
        let result: number = defaultStart; 
        for (let i = startMeasure; i >=0; i--) {
            result = this.signInMeasure(sign, i);
            if (result>=0){
                break;
            }
        }
        return result;
    }

    findForward(sign: RepetitionInstructionEnum, defaultEnd: number = -1): number {
        let startMeasure = this.validateMeasureIndex(this.measureIndex);
        let result: number = defaultEnd; 
        for (let i = startMeasure; i < this.measures.length; i++) {
            result = this.signInMeasure(sign, i);
            if (result>=0){
                break;
            }
        }
        return result;
    }

    sequenceArray(start: number, end: number): number[] {
        const array: number[] = [];
        if (start>=0 && end<this.measures.length && start<=end && end>=start){
            for(let i: number = start; i<= end; i++){
                array.push(i);
            }
        }
        return array;
    }

    public get array(): number[]{
        let start: number;
        let end: number;
        let array: number[]; 
        switch(this.sign){
            case RepetitionInstructionEnum.StartLine : {
                array = []; 
                break;
            }
            case RepetitionInstructionEnum.ForwardJump : {
                array = []; 
                break;
            } 
            case RepetitionInstructionEnum.BackJumpLine : {
                start = this.findBackward(RepetitionInstructionEnum.ForwardJump, 0);
                end = this.measureIndex;
                array = this.sequenceArray(start,end); 
                break;
            }
            case RepetitionInstructionEnum.Ending : {
                array = []; 
                break;
            }
            case RepetitionInstructionEnum.DaCapo : {
                array = []; 
                break;
            }
            case RepetitionInstructionEnum.DalSegno : {
                array = []; 
                break;
            }
            case RepetitionInstructionEnum.Fine : {
                array = []; 
                break;
            }
            case RepetitionInstructionEnum.ToCoda : {
                array = []; 
                break;
            }
            case RepetitionInstructionEnum.DalSegnoAlFine : {
                array = []; 
                break;
            }
            case RepetitionInstructionEnum.DaCapoAlFine : {
                array = []; 
                break;
            }
            case RepetitionInstructionEnum.DalSegnoAlCoda : {
                array = []; 
                break;
            }
            case RepetitionInstructionEnum.DaCapoAlCoda : {
                array = []; 
                break;
            }
            case RepetitionInstructionEnum.Coda : {
                array = []; 
                break;
            }
            case RepetitionInstructionEnum.Segno : {
                array = []; 
                break;
            }
            default: {
                array = []; 
                break;
            }
        }
        return array;
    }
}

export class Repetition {
    private osmd: OpenSheetMusicDisplay; 
    private instructions: TRepeatSetArray;
    private repetitions: number[];
    private flow: number[];
    private signs: {[index: number]: number[]}[];
    private end: number;

    constructor(odmd: OpenSheetMusicDisplay) {
        this.osmd = odmd;
    }

    public fillRepeats(sheet: MusicSheet): void {
        this.instructions = [];
        this.repetitions  = [];
        this.flow  = [];
        this.signs = [
            { 0: [], 1: [], 12: [], 13: [] },
            { 3: [], 6: [] },
        ];
        let measure: number = 0;
        sheet.SourceMeasures.forEach((m: SourceMeasure, index: number)=>{
            m.FirstRepetitionInstructions.forEach((ri: RepetitionInstruction)=>{
                if(ri.alignment === 0 && Object.keys(this.signs[0]).includes(String(ri.type))) {
                    this.signs[0][ri.type].push(measure);
                }
            });
            m.LastRepetitionInstructions.forEach((ri: RepetitionInstruction)=>{
                if(ri.alignment === 1 && Object.keys(this.signs[1]).includes(String(ri.type))) {
                    if (Number(ri.type)===12) {
                        this.signs[0][12].push(measure+1);
                    } else {
                        this.signs[1][ri.type].push(measure);
                    }
                }
            });

            this.instructions.push([
                m.FirstRepetitionInstructions,
                m.LastRepetitionInstructions,
            ]);
            this.repetitions.push(1);
            measure++;
        });
        this.instructions.forEach((i: TRepeatSet)=>{
        });
    }

}