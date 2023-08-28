import { RepetitionInstruction, ExtendedTransposeCalculator, Note, OpenSheetMusicDisplay, ColoringModes } from "opensheetmusicdisplay";
import { Input, NoteMessageEvent } from "../WebMidi";
import { SheetFlowCalculator } from "../SheetFlow";
import { BranchClass } from "../../";
import { IExercise } from "../../Common";

//import { KeyboardInputEvent } from "electron";

export interface IMaestroParams {
    osmd?: OpenSheetMusicDisplay;
    midiInputs?: Input[];
}

interface IMaestroData extends IMaestroParams{
    repeats: [RepetitionInstruction[],RepetitionInstruction[]][];
    flow: SheetFlowCalculator;
    midiNotes: boolean[];
    osmdNotes: number[];
    playMeasures: number[];
    playMeasureIndex: number;
    exercises: IExercise[];
    current: IExercise;
    notesToPlay: number;
    playedNotes: number;
    errors: number;
}

export class Maestro{
    private data: IMaestroData = {
        repeats : [],
        flow: null,
        midiNotes : [],
        osmdNotes : [],
        playMeasures : [],
        playMeasureIndex: 0,
        exercises: [],
        current: {},
        notesToPlay: 0,
        playedNotes: 0,
        errors: 0,
    };

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
    */
    constructor(params: IMaestroParams){
        this.data.osmd = params.osmd;
        this.data.flow = new SheetFlowCalculator(this.data.osmd);
        this.data.midiInputs = params.midiInputs;
        if (!(this.osmd.TransposeCalculator && (this.osmd.TransposeCalculator instanceof ExtendedTransposeCalculator))) {
            this.osmd.TransposeCalculator = new ExtendedTransposeCalculator(this.osmd);
         }
        this.sheetNotes = [];
        for (let i: number = 0 ; i < 128; i++){
            this.data.midiNotes.push(false);
        }
        this.clearMidiNotes();
    }

    public get OSMD(): OpenSheetMusicDisplay  {
      return this.osmd;
    };

    public allNotesUnderCursorArePlayedDebug(): boolean{
        this.clearMidiNotes();
        this.clearSheetNotes();
        return true;
    }

    public allNotesUnderCursorArePlayedFacile(): boolean{
      // ciclo 1
      // controlla se le note grafiche sono suonate.
      let ok: boolean=false;
      console.log("sheet",this.data.osmdNotes);
      console.log("midi",this.data.midiNotes);
      for(let i: number = 0 ; i < this.sheetNotes.length; i++) {
        if(this.getMidiNote(this.sheetNotes[i])) {ok = true;}
      }
      if (ok) {
        this.clearMidiNotes();
        this.clearSheetNotes();
      }
      return ok;
    }

    public allNotesUnderCursorArePlayedAdattato(): boolean{
        // ciclo 1
        // controlla se le note grafiche sono suonate.
        let ok: boolean=true;
        const midiNotes: number[] = [];
        for (let i: number = 0; i < 128 ; i++){
            if(this.data.midiNotes[i]) {
                midiNotes.push(i%12);
                this.data.playedNotes++;
            }
        }

        console.log("sheet", this.data.osmdNotes);
        console.log("midi" , midiNotes);
        for(let i: number = 0 ; i < this.sheetNotes.length; i++) {
            if (midiNotes.length>0) {
                const index: number = midiNotes.indexOf(this.sheetNotes[i] % 12 );
                if (index > -1) {
                    delete midiNotes[index];
                } else {
                    ok = false;
                    this.data.errors++;
                    break;
                }
            } else {
                ok = false;
                break;
            }
        }
        if (ok) {
            this.clearMidiNotes();
            this.clearSheetNotes();
        }
        return ok;
    }

    public allNotesUnderCursorArePlayedMedio(): boolean{
        // ciclo 1
        // controlla se le note grafiche sono suonate.
        let ok: boolean=true;
        const midiNotes: number[] = [];
        for (let i: number = 0; i < 128 ; i++ ){
            if(this.data.midiNotes[i]) {midiNotes.push(i);}
        }

//        console.log("sheet",this.data.osmdNotes);
//        console.log("midi",midiNotes);
        for(let i: number = 0 ; i < this.sheetNotes.length; i++) {
            if(!this.getMidiNote(this.sheetNotes[i])) {
                ok = false;
            }
        }
        if (ok) {
            this.clearMidiNotes();
            this.clearSheetNotes();
        }
        return ok;
    }

    public allNotesUnderCursorArePlayedDifficile(): boolean{
        // ciclo 1
        // controlla se le note grafiche sono suonate.
        let ok: boolean=true;
        console.log("sheet",this.data.osmdNotes);
        console.log("midi",this.data.midiNotes);
        for(let i: number = 0 ; i<this.sheetNotes.length; i++) {
            if(!this.getMidiNote(this.sheetNotes[i])) {ok = false;}
        }
        // ciclo 2
        // se il ciclo 1 è ok, controlla se ci sono stecche.
        //if (ok){
            for(let i: number = 0 ; i<this.data.midiNotes.length; i++) {
                if(this.data.midiNotes[i]===true){
                    if(!this.data.osmdNotes.includes(i)) {
                    this.setMidiNoteOff(i);
                    ok = false;
                    console.log("hai steccato!");
                    }
                };
            }
        //}
        if (ok) {
            this.clearMidiNotes();
            this.clearSheetNotes();
        }
        return ok;
    }

    public allNotesUnderCursorArePlayed(): boolean{
        return this.allNotesUnderCursorArePlayedMedio();
    }

    public test(): void {
        this.osmd.cursor.reset();
        while(!this.osmd.cursor.iterator.EndReached) {
            this.osmd.cursor.next();
        }
    }

    public next(): void {
        this.data.osmdNotes = [];
        this.clearMidiNotes();
        //let expectedMeasureIndex:number = this.playerMeasures[this.playerMeasureIndex];
        console.log("PRE-WHILE ","Current",this.osmd.cursor.Iterator.CurrentMeasureIndex, "Expected",this.expectedMeasureIndex) ;
        while (
            this.expectedMeasureIndex>=0 &&
            this.data.osmdNotes.length<1
//            !this.osmd.cursor.Iterator.EndReached &&
        ) {
            this.osmd.cursor.Iterator.moveToNextVisibleVoiceEntry(false);
            this.osmd.cursor.update();

    //      expectedMeasureIndex = this.playerMeasures[this.playerMeasureIndex];
    //      console.log("IN-WHILE  ","Current",this.osmd.cursor.Iterator.CurrentMeasureIndex, "Expected",expectedMeasureIndex) ;

            if (
                this.expectedMeasureIndex>=0 &&
                this.osmd.cursor.Iterator.CurrentMeasureIndex!==this.expectedMeasureIndex
            ) {
                // C'E' SALTO UN SALTO DI MISURA
                // AGGIORNIAMO
                this.playerMeasureIndex++;
                //expectedMeasureIndex = this.playerMeasures[this.playerMeasureIndex];

                console.log("Current",this.osmd.cursor.Iterator.CurrentMeasureIndex, "Expected",this.expectedMeasureIndex) ;
                if (
                    //!(this.osmd.cursor.Iterator.EndReached) &&
                    this.expectedMeasureIndex>=0 &&
                    (this.osmd.cursor.Iterator.CurrentMeasureIndex!==this.expectedMeasureIndex)
                ){
                    // SIAMO IN PRESENZA DI UNA RIPETIZIONE
                    this.osmd.cursor.resetIterator();
                    this.osmd.cursor.update();
                    console.log("playerMeasures",this.playerMeasures) ;
                    console.log("Current",this.osmd.cursor.Iterator.CurrentMeasureIndex, "Expected",this.expectedMeasureIndex) ;
                    while (this.osmd.cursor.Iterator.CurrentMeasureIndex < this.expectedMeasureIndex) {
                        this.osmd.cursor.Iterator.moveToNextVisibleVoiceEntry(false);
                        console.log("backJumpOccurred2",this.osmd.cursor.iterator.backJumpOccurred);
                        this.osmd.cursor.update();
                        console.log("Current",this.osmd.cursor.Iterator.CurrentMeasureIndex, "Expected",this.expectedMeasureIndex) ;
                    }
                }
            }

            this.osmd.cursor.update();
            console.log(this.osmd.cursor.Iterator.CurrentRepetition);
            if (this.playerMeasureIndex>=this.playerMeasures.length) {
                this.playerMeasureIndex = this.playerMeasures.length-1;
            }
            if(
                this.osmd.cursor.Iterator.EndReached ||
                this.expectedMeasureIndex<0
            ) {
                console.log("END REACHED");
                // QUI CALCOLEREMO SUCCESSI E FALLIMENTI
                console.log("NOTES TO PLAY", this.data.notesToPlay);
                console.log("PLAYED NOTES", this.data.playedNotes);

                const success: number = (this.data.notesToPlay / this.data.playedNotes ) * 100;
                console.log("SUCCESS:", `${success.toFixed(2)}%` );

                this.data.notesToPlay = 0;
                this.data.playedNotes = 0;
                //1
                this.osmd.cursor.reset();
                this.playerMeasureIndex = 0;
                //2
                //this.reset();
            }
            this.fillOsmdNotes();
        }
    }

    public reset(): void {
        this.data.notesToPlay = 0;
        this.data.playedNotes = 0;
        this.data.errors = 0;

        this.osmd.cursor.reset();
        //2
        //this.playerMeasureIndex = 0;
        this.osmd.cursor.SkipInvisibleNotes = false;
        this.fillOsmdNotes();
        if(this.data.osmdNotes.length<1){
            this.next();
        }
    }

    public loadSheet(
        exercise: IExercise = null,
        transposeValue: number = 0,
        beforeStart: () => void  = null,
        afterEnd: () => void = null
    ): void {
        if (exercise===null) {
            exercise = this.getRandomExercise();
        }
        if (exercise!==null){
            if(beforeStart!==null && typeof beforeStart === "function"){
                beforeStart();
            }
            this.osmd.load(`${exercise.path}/${exercise.sheet}`).then(()=>{
                this.osmd.TransposeCalculator.Options.transposeToHalftone(0);
                this.playerMeasures = [];
                this.playerMeasureIndex = 0;
                this.playerMeasures = this.flow.calculatePlayerMeasures();
                console.log(this.data.playMeasures);
                this.osmd.Sheet.Transpose = transposeValue;
                this.osmd.zoom = 1.0;
                //this.osmd.FollowCursor = true;
                this.osmd.Sheet.Title.text = exercise.caption;
                this.osmd.updateGraphic();
                this.osmd.render();
                this.reset();
                this.osmd.cursor.show();
                //this.test();
                console.log(this.data.repeats);
                if(afterEnd!==null && typeof afterEnd === "function"){
                    afterEnd();
                }
            });
        }
    }

    public loadXmSheet(
        xml: string,
        sheet: BranchClass,
        transposeValue: number = 0,
        beforeStart: () => void = null,
        afterEnd: () => void = null
    ): void {
        if (xml && typeof xml === "string"){
            if(beforeStart!==null && typeof beforeStart === "function"){
                beforeStart();
            }
            //console.log(xml);
            this.osmd.load(xml).then(()=>{
                this.osmd.TransposeCalculator.Options.transposeToHalftone(0);
                sheet.mainKey = this.osmd.TransposeCalculator.Options.MainKey;
                sheet.saveCustom();
                this.playerMeasures = [];
                this.playerMeasureIndex = 0;
                this.playerMeasures = this.flow.calculatePlayerMeasures();
                this.osmd.Sheet.Transpose = transposeValue;
                //console.log(sheet.branchObject);
                //console.log(this.data.playMeasures);
                // this.osmd.setOptions({
                //     drawFromMeasureNumber: 2,
                //     drawUpToMeasureNumber: 2,
                //     defaultColorMusic: "#cccccc",
                // });
                this.osmd.zoom = 1.0;
                //this.osmd.FollowCursor = true;
                const titleSplitted: string[] = sheet.name.split(";");
                if(titleSplitted.length===2){
                    this.osmd.Sheet.TitleString = titleSplitted[0];
                    this.osmd.Sheet.SubtitleString = titleSplitted[1];

                } else {
                    this.osmd.Sheet.TitleString = sheet.name;
                }
                this.osmd.updateGraphic();
                this.osmd.render();
                this.reset();
                this.osmd.cursor.show();
                //this.test();
                //console.log(this.data.repeats);
                if(afterEnd!==null && typeof afterEnd === "function"){
                    afterEnd();
                }
            });
        }
    }

    public setListeners(): void {
        if (this.midiInputs) {
            this.midiInputs.forEach((input: Input)=>{

                input.addListener("noteon",(e: NoteMessageEvent)=>{
                    //console.log(e.note.number, e.timestamp, e);
                    this.setMidiNoteOn(e.note.number);
                    this.data.playedNotes++;
                    if(this.allNotesUnderCursorArePlayed()){
                          this.next();
                    }
                }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

                input.addListener("noteoff",(e: NoteMessageEvent)=>{
                    this.setMidiNoteOff(e.note.number);
                }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

                input.addListener("pitchbend",(e: NoteMessageEvent)=>{
                    console.log(e);
                    this.setMidiNoteOff(e.note.number);
                }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

            });

            document.addEventListener(
                "keydown",
                (event: KeyboardEvent) => {
                    if (event.key==="ArrowRight") {
                        if(this.allNotesUnderCursorArePlayedDebug()){
                            this.next();
                        }
                    }
                },
                false,
            );

              document.addEventListener(
                "keyup",
                (event: KeyboardEvent) => {
                    if (event.key==="ArrowRight") {
                        //
                    }
                },
                false,
              );
        }
    }

    public get osmd(): OpenSheetMusicDisplay {
        return this.data.osmd;
    }

    public get flow(): SheetFlowCalculator {
        return this.data.flow;
    }

    public get midiInputs(): Input[] {
        return this.data.midiInputs;
    }

    public get playerMeasureIndex(): number{
        return this.data.playMeasureIndex || 0;
    }

    public set playerMeasureIndex(value: number){
        if (value>=this.playerMeasures.length) {value = 0;}
        this.data.playMeasureIndex = value;
    }

    public get playerMeasures(): number[]{
        return this.data.playMeasures;
    }

    public set playerMeasures(arrayOfvalues: number[]){
        this.data.playMeasures = arrayOfvalues;
    }

    public get expectedMeasureIndex(): number{
        return this.playerMeasures[this.playerMeasureIndex];
    }

    public get sheetNotes(): number[]{
        return this.data.osmdNotes;
    }

    public set sheetNotes(arrayOfvalues: number[]){
        this.data.osmdNotes = arrayOfvalues;
    }

    public get isPlaying(): boolean {
        return this.data.playedNotes>0;
    }

    public fillOsmdNotes(): void {
        //this.data.notesToPlay++;
        this.osmd.cursor.NotesUnderCursor().forEach((osmdNote: Note)=>{
            if (osmdNote.halfTone!==0) {
                if (!("tie" in osmdNote && osmdNote.NoteTie.Notes[0] !== osmdNote)){
                    this.data.osmdNotes.push(osmdNote.halfTone);
                    this.data.notesToPlay++;
                }
            }
        });
    }

    public get midiNotes(): boolean[]{
        return this.data.midiNotes;
    }

    public clearMidiNotes(): void{
        for (let i: number = 0 ; i < this.midiNotes.length ; i++){
            this.midiNotes[i]=false;
        }
    }

    public clearSheetNotes(): void{
        this.data.osmdNotes = [];
    }

    public getMidiNote(midiNoteValue: number): boolean{
        if (midiNoteValue>=0 && midiNoteValue<this.midiNotes.length) {
            return this.midiNotes[midiNoteValue];
        }
        return false;
    }

    public setMidiNote(midiNoteValue: number, value: boolean): void{
        midiNoteValue = midiNoteValue-12;
        if (midiNoteValue>=0 && midiNoteValue<this.midiNotes.length) {
            this.midiNotes[midiNoteValue]=value;
        }
    }

    public setMidiNoteOn(midiNoteValue: number): void{
        this.setMidiNote(midiNoteValue, true);
    }

    public setMidiNoteOff(midiNoteValue: number): void{
        this.setMidiNote(midiNoteValue, false);
    }

    public get exercises(): IExercise[] {
        return this.data.exercises || [];
    }

    public set exercises(exercises: IExercise[]) {
        console.log(exercises);
        this.data.exercises = exercises;
    }

    public get current(): IExercise {
        return this.data.current || {};
    }

    public set current( exercise: IExercise) {
        this.data.current = exercise;
    }

    public getRandomExercise(): IExercise {
        return this.exercises[ Math.floor( Math.random() * this.exercises.length) ];
    }
}
