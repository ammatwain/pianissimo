//https://www.myriad-online.com/resources/docs/melody/italiano/breaks.htm
/*
0  0 StartLine,      // linea |:            = Inizio di un gruppo di battute che vanno suonate più volte.
0  1 ForwardJump,    // ??                 = Inizio di un gruppo di battute che vanno suonate più volte.
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

import { RepetitionInstruction, RepetitionInstructionEnum, SourceMeasure } from "opensheetmusicdisplay";

export class Repetitions {
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

    signInFirst(sign: RepetitionInstructionEnum, measure: number): number {
        measure = this.validateMeasureIndex(measure);
        const m: SourceMeasure = this.measures[measure];
        let result: number = measure;
        //console.log(m.FirstRepetitionInstructions);
        const index: number = m.FirstRepetitionInstructions.findIndex((r: RepetitionInstruction)=>{
            return r.type === sign;
        });
        if (index<0){
            result = -1;
        }
        return result;
    }

    signInLast(sign: RepetitionInstructionEnum, measure: number): number {
        measure = this.validateMeasureIndex(measure);
        const m: SourceMeasure = this.measures[measure];
        let result: number = measure;
        //console.log(m.LastRepetitionInstructions);
        const index: number = m.LastRepetitionInstructions.findIndex((r: RepetitionInstruction)=>{
            return r.type === sign;
        });
        if (index<0){
            result = -1;
        }
        return result;
    }

    signInBoth(sign: RepetitionInstructionEnum, measure: number): number {
        let result: number = this.signInFirst(sign, measure);
        if (result<0) {
            result = this.signInLast(sign, measure);
        }
        return result;
    }

    findInFirstBackward(sign: RepetitionInstructionEnum, defaultValue: number = -1, startMeasure: number = this.measureIndex ): number {
        startMeasure = this.validateMeasureIndex(startMeasure);
        let result: number = defaultValue;
        for (let i: number = startMeasure; i >=0; i--) {
            result = this.signInFirst(sign, i);
            if (result>=0){
                break;
            }
        }
        if (result<0) {
            result = defaultValue;
        }
        return result;
    }

    findInFirstForward(sign: RepetitionInstructionEnum, defaultValue: number = -1, startMeasure: number = this.measureIndex): number {
        startMeasure = this.validateMeasureIndex(startMeasure);
        let result: number = defaultValue;
        for (let i: number = startMeasure; i < this.measures.length; i++) {
            result = this.signInFirst(sign, i);
            if (result>=0){
                break;
            }
        }
        if (result<0) {
            result = defaultValue;
        }
        return result;
    }

    findInLastBackward(sign: RepetitionInstructionEnum, defaultValue: number = -1, startMeasure: number = this.measureIndex ): number {
        startMeasure = this.validateMeasureIndex(startMeasure);
        let result: number = defaultValue;
        for (let i: number = startMeasure; i >=0; i--) {
            result = this.signInLast(sign, i);
            if (result>=0){
                break;
            }
        }
        if (result<0) {
            result = defaultValue;
        }
        return result;
    }

    findInLastForward(sign: RepetitionInstructionEnum, defaultValue: number = -1, startMeasure: number = this.measureIndex): number {
        startMeasure = this.validateMeasureIndex(startMeasure);
        let result: number = defaultValue;
        for (let i: number = startMeasure; i < this.measures.length; i++) {
            result = this.signInLast(sign, i);
            if (result>=0){
                break;
            }
        }
        if (result<0) {
            result = defaultValue;
        }
        return result;
    }

    findBackward(sign: RepetitionInstructionEnum, defaultValue: number = -1, startMeasure: number = this.measureIndex ): number {
        startMeasure = this.validateMeasureIndex(startMeasure);
        let result: number = defaultValue;
        for (let i: number = startMeasure; i >=0; i--) {
            result = this.signInBoth(sign, i);
            if (result>=0){
                break;
            }
        }
        if (result<0) {
            result = defaultValue;
        }
        return result;
    }

    findForward(sign: RepetitionInstructionEnum, defaultValue: number = -1, startMeasure: number = this.measureIndex): number {
        startMeasure = this.validateMeasureIndex(startMeasure);
        let result: number = defaultValue;
        for (let i: number = startMeasure; i < this.measures.length; i++) {
            result = this.signInBoth(sign, i);
            if (result>=0){
                break;
            }
        }
        if (result<0) {
            result = defaultValue;
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
/*
    findStartEndings(startMeasure: number, endMeasure: number): number {
        for(let i: number = startMeasure; i <= endMeasure ; ++ ){

        }
    }
*/
    existsInitialEndingIndexInMeasure(index: 1 | 2 | 3, measureIndex: number): boolean{
        const measure: SourceMeasure = this.measures[this.validateMeasureIndex(measureIndex)];
        const repeatInstruction: RepetitionInstruction = measure.FirstRepetitionInstructions.find((ri: RepetitionInstruction)=>{
            return ri.type === RepetitionInstructionEnum.Ending;
        });
        if (repeatInstruction) {
            return repeatInstruction.endingIndices.includes(index) || false;
        }
        return false;
    }

    existsFinalEndingIndexInMeasure(index: 1 | 2 | 3, measureIndex: number): boolean{
        const measure: SourceMeasure = this.measures[this.validateMeasureIndex(measureIndex)];
        const repeatInstruction: RepetitionInstruction = measure.LastRepetitionInstructions.find((ri: RepetitionInstruction)=>{
            return ri.type === RepetitionInstructionEnum.Ending;
        });
        if (repeatInstruction) {
            return repeatInstruction.endingIndices.includes(index) || false;
        }
        return false;
    }

    findInitialEndingIndex(index: 1 | 2 | 3 , startMeasure: number, endMeasure: number): number {
        for(let i: number = startMeasure; i<=endMeasure; i++){
            if (this.existsInitialEndingIndexInMeasure(index,i)){
                return i;
            }
        }
        return -1;
    }

    findFinalEndingIndex(index: 1 | 2 | 3 , startMeasure: number, endMeasure: number): number {
        for(let i: number = startMeasure; i<=endMeasure; i++){
            if (this.existsFinalEndingIndexInMeasure(index,i)){
                return i;
            }
        }
        return -1;
    }

    public get array(): number[]{
        let start: number;
        let end: number;
        let array: number[] = [];
        switch(this.sign){
            case RepetitionInstructionEnum.BackJumpLine : {
                let finalEnding1: number;
                start = this.findBackward(RepetitionInstructionEnum.StartLine, 0);
                end = this.measureIndex;
                const initialEnding1: number = this.findInitialEndingIndex(1, start, this.measureIndex);
                if (initialEnding1 > start && initialEnding1 <= this.measureIndex) {
                    finalEnding1 = this.findFinalEndingIndex(1, start, this.measureIndex);
                    if (finalEnding1 >= initialEnding1 && finalEnding1 === this.measureIndex) {
                        end = initialEnding1-1;
                    }
                }
                array = this.sequenceArray(start,end);
                break;
            }
            case RepetitionInstructionEnum.DaCapo : {
                start = 0;
                end = this.measureIndex;
                array = this.sequenceArray(start,end);
                break;
            }
            case RepetitionInstructionEnum.DalSegno : {
                start = this.findBackward(RepetitionInstructionEnum.Segno, -1);
                end = this.measureIndex;
                array = this.sequenceArray(start,end);
                break;
            }
            case RepetitionInstructionEnum.DalSegnoAlFine : {
                start = this.findBackward(RepetitionInstructionEnum.Segno, -1);
                if (start < 0) {
                    start = this.findForward(RepetitionInstructionEnum.Segno, -1);
                }
                end = this.findForward(RepetitionInstructionEnum.Fine, -1);
                if (end < 0) {
                    end = this.findBackward(RepetitionInstructionEnum.Fine, -1);
                }
                array = this.sequenceArray(start,end);
                if (array.length>0){
                    array.push(-1);
                }
                break;
            }
            case RepetitionInstructionEnum.DaCapoAlFine : {
                start = 0;
                end = this.findForward(RepetitionInstructionEnum.Fine, -1, start);
                array = this.sequenceArray(start,end);
                if (array.length>0){
                    array.push(-1);
                }
                break;
            }
            case RepetitionInstructionEnum.DalSegnoAlCoda : {
                let tmp1: number[] = [];
                let tmp2: number[] = [];
                let max: number = Math.max(0, this.measureIndex);
                array = [];
                start = 0;
                start = this.findBackward(RepetitionInstructionEnum.Segno, -1);
                if (start < 0) {
                    start = this.findForward(RepetitionInstructionEnum.Segno, -1);
                }
                if (start>=0) {
                    max = Math.max(max, start);
                    end = this.findForward(RepetitionInstructionEnum.ToCoda, -1, start);
                    if (end < 0) {
                        end = this.findBackward(RepetitionInstructionEnum.ToCoda, -1, start);
                    }
                    if (end>=0){
                        max = Math.max(max, end);
                        tmp1 = this.sequenceArray(start,end);
                        if(tmp1.length>0){
                            start = this.findForward(RepetitionInstructionEnum.Coda, -1, end);
                            if (start < 0) {
                                start = this.findBackward(RepetitionInstructionEnum.Coda, -1, end);
                            }
                            if (start>=0){
                                end = Math.max(max, start);
                                tmp2 = this.sequenceArray(start,end);
                                tmp1.forEach((n: number)=>{
                                    array.push(n);
                                });
                                tmp2.forEach((n: number)=>{
                                    array.push(n);
                                });
                            }
                        }
                    }
                }
                break;
            }
            case RepetitionInstructionEnum.DaCapoAlCoda : {
                let tmp1: number[] = [];
                let tmp2: number[] = [];
                let max: number = Math.max(0, this.measureIndex);
                array = [];
                start = 0;
                end = this.findForward(RepetitionInstructionEnum.ToCoda, -1, start);
                if (end>=0){
                    max = Math.max(max, end);
                    tmp1 = this.sequenceArray(start,end);
                    if(tmp1.length>0){
                        start = this.findForward(RepetitionInstructionEnum.Coda, -1);
                        if (start < 0) {
                            start = this.findBackward(RepetitionInstructionEnum.Coda, -1);
                        }
                        if (start>=0){
                            end = Math.max(max, start);
                            tmp2 = this.sequenceArray(start,end);
                            tmp1.forEach((n: number)=>{
                                array.push(n);
                            });
                            tmp2.forEach((n: number)=>{
                                array.push(n);
                            });
                        }
                    }
                }
                break;
            }
            default: {
                break;
            }
        }
        return array;
    }
}
