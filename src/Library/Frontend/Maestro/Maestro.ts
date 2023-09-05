import { STR } from "@Global/STR";
import { RepetitionInstruction, Note, OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { Input } from "@Frontend/WebMidi";
import { SheetFlowCalculator } from "@Frontend/SheetFlow";
import { BranchClass } from "@Frontend/BranchClass";
import { IExercise } from "@Common/Interfaces/IExercise";
import { IBranchObject, IDiaryObject } from "@Library/Common";
import { ExtendedTransposeCalculator } from "extended-transpose-calculator";
import { WTree } from "@Frontend/WTree";
import { WBranches, WBranch } from "@Frontend/WBranch";

//import { KeyboardInputEvent } from "electron";

export interface IMaestroParams {
    etc: ExtendedTransposeCalculator;
    midiInputs: Input[];
    tree?: WTree;
    branches: WBranches;
}

interface IMaestroData extends IMaestroParams{
    osmd?: OpenSheetMusicDisplay;
    repeats: [RepetitionInstruction[],RepetitionInstruction[]][];
    flow: SheetFlowCalculator;
    midiNotes: boolean[];
    osmdNotes: number[];
    playMeasures: number[];
    playMeasureIndex: number;
    exercises: IExercise[];
    currentExercise: IExercise;
    currentKey: number;
    currentSection: BranchClass;
    notesToPlay: number;
    playedNotes: number;
    errors: number;
    diary: IDiaryObject;
}

export class Maestro{
    private data: IMaestroData = {
        tree: null,
        branches: null,
        etc: null,
        midiInputs: [],
        osmd : null,
        repeats : [],
        flow: null,
        midiNotes : [],
        osmdNotes : [],
        playMeasures : [],
        playMeasureIndex: 0,
        exercises: [],
        currentExercise: {},
        currentKey: 0,
        notesToPlay: 0,
        playedNotes: 0,
        errors: 0,
        diary: {
            datetime: 0,
            duration: 0,
            id: 0,
            key: 0,
            bpm: 0,
            score: 0,
        },
        currentSection: null,
    };

    constructor(params: IMaestroParams){
        this.Etc = params.etc;
        this.MidiInputs = params.midiInputs;
        this.Tree = params.tree;
        this.Flow = new SheetFlowCalculator(this.Osmd);
        this.SheetNotes = [];

        for (let i: number = 0 ; i < 128; i++){
            this.MidiNotes.push(false);
        }

        this.clearMidiNotes();
    }

    public get CurrentExercise(): IExercise {
        return this.data.currentExercise || {};
    }

    public set CurrentExercise( exercise: IExercise) {
        this.data.currentExercise = exercise;
    }

    public get CurrentKey(): number {
        return this.data.currentKey || 0;
    }

    public set CurrentKey( currentKey: number) {
        this.data.currentKey = currentKey;
    }

    public get CurrentSection(): BranchClass {
        return this.data.currentSection || null;
    }

    public set CurrentSection(currentSection: BranchClass) {
        this.data.currentSection = currentSection;
    }

    public get Data(): IMaestroData  {
        return this.data;
    }

    public get Diary(): IDiaryObject {
        return this.data.diary;
    }

    public set Diary(diary: IDiaryObject) {
        this.data.diary = diary;
    }

    public get Etc(): ExtendedTransposeCalculator {
        return this.data.etc;
    }

    public set Etc(etc: ExtendedTransposeCalculator) {
        if (etc instanceof ExtendedTransposeCalculator) {
            this.data.etc = etc;
            this.data.osmd = this.Etc.Options.OSMD;
        }
    }

    public get Exercises(): IExercise[] {
        return this.data.exercises || [];
    }

    public set Exercises(exercises: IExercise[]) {
        this.data.exercises = exercises;
    }

    public get ExpectedMeasureIndex(): number{
        return this.PlayerMeasures[this.PlayerMeasureIndex];
    }

    public get Flow(): SheetFlowCalculator {
        return this.data.flow;
    }

    public set Flow(flow: SheetFlowCalculator) {
        this.data.flow = flow;
    }

    public get IsPlaying(): boolean {
        return this.PlayedNotes>0;
    }

    public get MidiInputs(): Input[] {
        return this.data.midiInputs;
    }

    public set MidiInputs(midiInputs: Input[]) {
        this.data.midiInputs = midiInputs;
    }

    public get MidiNotes(): boolean[]{
        return this.data.midiNotes;
    }

    public set MidiNotes(midiNotes: boolean[]) {
        this.data.midiNotes = midiNotes;
    }

    public get NotesToPlay(): number {
        return this.data.notesToPlay || 0;
    }

    public set NotesToPlay(notesToPlay: number) {
        this.data.notesToPlay = notesToPlay;
    }

    public get Osmd(): OpenSheetMusicDisplay {
        return this.data.osmd;
    }

    public set Osmd(osmd: OpenSheetMusicDisplay) {
        this.data.osmd = osmd;
    }

    public get OsmdNotes(): number[]{
        return this.data.osmdNotes;
    }

    public set OsmdNotes(osmdNotes: number[]){
        this.data.osmdNotes = osmdNotes;
    }

    public get PlayerMeasures(): number[]{
        return this.data.playMeasures;
    }

    public set PlayerMeasures(playMeasures: number[]){
        this.data.playMeasures = playMeasures;
    }

    public get PlayerMeasureIndex(): number{
        return this.data.playMeasureIndex || 0;
    }

    public set PlayerMeasureIndex(playMeasureIndex: number){
        if (playMeasureIndex >= this.PlayerMeasures.length) {playMeasureIndex = 0;}
        this.data.playMeasureIndex = playMeasureIndex;
    }

    public get PlayedDone(): number {
        return this.data.notesToPlay || 0;
    }

    public set PlayedDone(playedDone: number) {
        this.data.notesToPlay = playedDone;
    }

    public get PlayedNotes(): number {
        return this.data.playedNotes || 0;
    }

    public set PlayedNotes(playedNotes: number) {
        this.data.playedNotes = playedNotes;
    }

    public get PlayedShot(): number {
        return this.data.playedNotes || 0;
    }

    public set PlayedShot(playedShot: number) {
        this.data.playedNotes = playedShot;
    }

    public get SheetNotes(): number[]{
        return this.data.osmdNotes;
    }

    public set SheetNotes(osmdNotes: number[]){
        this.data.osmdNotes = osmdNotes;
    }

    public get Tree(): WTree{
        return this.data.tree;
    }

    public set Tree(tree: WTree){
        this.data.tree = tree;
    }

    public fillOsmdNotes(): void {
        this.Osmd.cursor.NotesUnderCursor().forEach((osmdNote: Note)=>{
            if (osmdNote.halfTone!==0) {
                if (!("tie" in osmdNote && osmdNote.NoteTie.Notes[0] !== osmdNote)){
                    this.data.osmdNotes.push(osmdNote.halfTone);
                    this.NotesToPlay++;
                }
            }
        });
    }

    public getRandomExercise(): IExercise {
        return this.Exercises[ Math.floor( Math.random() * this.Exercises.length) ];
    }

    public setMidiNoteOn(midiNoteValue: number): void{
        this.setMidiNote(midiNoteValue, true);
    }

    public setMidiNoteOff(midiNoteValue: number): void{
        this.setMidiNote(midiNoteValue, false);
    }

    public clearMidiNotes(): void{
        for (let i: number = 0 ; i < this.MidiNotes.length ; i++){
            this.MidiNotes[i]=false;
        }
    }

    public clearSheetNotes(): void{
        this.data.osmdNotes = [];
    }

    public getMidiNote(midiNoteValue: number): boolean{
        if (midiNoteValue>=0 && midiNoteValue<this.MidiNotes.length) {
            return this.MidiNotes[midiNoteValue];
        }
        return false;
    }

    public setMidiNote(midiNoteValue: number, value: boolean): void{
        midiNoteValue = midiNoteValue-12;
        if (midiNoteValue>=0 && midiNoteValue<this.MidiNotes.length) {
            this.MidiNotes[midiNoteValue]=value;
        }
    }
    public reset(): void {
        this.NotesToPlay = 0;
        this.PlayedNotes = 0;
        this.data.errors = 0;

        this.Osmd.cursor.reset();
        //2
        //this.playerMeasureIndex = 0;
        this.Osmd.cursor.SkipInvisibleNotes = false;
        this.fillOsmdNotes();
        if(this.data.osmdNotes.length<1){
            this.next();
        }
    }

    public loadXmSheet(
        xml: string,
        section: BranchClass,
        key: number = null,
        beforeStart: () => void = null,
        afterEnd: () => void = null
    ): void {
        if (
            section instanceof BranchClass &&
            section.Type === STR.section &&
            xml !== "" &&
            typeof xml === "string"
        ) {
            if(beforeStart!==null && typeof beforeStart === "function"){
                beforeStart();
            }

            this.CurrentSection = section;

            this.Osmd.load(xml).then(()=>{
                console.log(section);

                if (key === null) {
                    key = this.Etc.MainKey;
                }

                this.CurrentKey = key;
                this.Etc.Options.transposeToKey(key);

                if (!(this.CurrentSection.ActiveKeys.includes(this.CurrentKey))) {
                    this.CurrentSection.ActiveKeys.push(this.CurrentKey);
                }

                this.Diary.datetime = 0;
                this.Diary.duration = 0;
                this.Diary.id = section.Id;
                this.Diary.key = 0;
                this.Diary.bpm = 0;
                this.Diary.score = 0;

                this.PlayerMeasures = [];
                this.PlayerMeasureIndex = 0;

                if (this.CurrentSection.IsFragment) {
                    this.Osmd.setOptions({
                        drawFromMeasureNumber: this.CurrentSection.MeasureStart,
                        drawUpToMeasureNumber: this.CurrentSection.MeasureEnd,
                        //defaultColorMusic: "#cccccc",
                   });
                }

                this.PlayerMeasures = this.Flow.calculatePlayerMeasures();

                this.Osmd.zoom = 1.0;
                //this.osmd.FollowCursor = true;
                const titleSplitted: string[] = section.Name.split(";");
                if(titleSplitted.length===2){
                    this.Osmd.Sheet.TitleString = titleSplitted[0];
                    this.Osmd.Sheet.SubtitleString = titleSplitted[1];

                } else {
                    this.Osmd.Sheet.TitleString = section.Name;
                }

                this.Osmd.updateGraphic();
                this.Osmd.render();
                this.reset();
                this.Osmd.cursor.show();

                if(afterEnd!==null && typeof afterEnd === "function"){
                    afterEnd();
                }
            });
        }
    }

    public allNotesUnderCursorArePlayedDebug(): boolean{
        this.clearMidiNotes();
        this.clearSheetNotes();
        return true;
    }

    public allNotesUnderCursorArePlayedFacile(): boolean{
      // ciclo 1
      // controlla se le note grafiche sono suonate.
      let ok: boolean=false;
      console.log(STR.sheet,this.data.osmdNotes);
      console.log("midi",this.data.midiNotes);
      for(let i: number = 0 ; i < this.SheetNotes.length; i++) {
        if(this.getMidiNote(this.SheetNotes[i])) {ok = true;}
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
                this.PlayedNotes++;
            }
        }

        console.log(STR.sheet, this.data.osmdNotes);
        console.log("midi" , midiNotes);
        for(let i: number = 0 ; i < this.SheetNotes.length; i++) {
            if (midiNotes.length>0) {
                const index: number = midiNotes.indexOf(this.SheetNotes[i] % 12 );
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

        for(let i: number = 0 ; i < this.SheetNotes.length; i++) {
            if(!this.getMidiNote(this.SheetNotes[i])) {
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
        console.log(STR.sheet,this.data.osmdNotes);
        console.log("midi",this.data.midiNotes);
        for(let i: number = 0 ; i<this.SheetNotes.length; i++) {
            if(!this.getMidiNote(this.SheetNotes[i])) {ok = false;}
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
        this.Osmd.cursor.reset();
        while(!this.Osmd.cursor.iterator.EndReached) {
            this.Osmd.cursor.next();
        }
    }

    public next(): void {
        this.data.osmdNotes = [];
        this.clearMidiNotes();
        //let expectedMeasureIndex:number = this.playerMeasures[this.playerMeasureIndex];
        console.log("PRE-WHILE ","Current",this.Osmd.cursor.Iterator.CurrentMeasureIndex, "Expected",this.ExpectedMeasureIndex) ;
        while (
            this.ExpectedMeasureIndex>=0 &&
            this.data.osmdNotes.length<1
//            !this.osmd.cursor.Iterator.EndReached &&
        ) {
            this.Osmd.cursor.Iterator.moveToNextVisibleVoiceEntry(false);
            this.Osmd.cursor.update();

    //      expectedMeasureIndex = this.playerMeasures[this.playerMeasureIndex];
    //      console.log("IN-WHILE  ","Current",this.osmd.cursor.Iterator.CurrentMeasureIndex, "Expected",expectedMeasureIndex) ;

            if (
                this.ExpectedMeasureIndex>=0 &&
                this.Osmd.cursor.Iterator.CurrentMeasureIndex!==this.ExpectedMeasureIndex
            ) {
                // C'E' SALTO UN SALTO DI MISURA
                // AGGIORNIAMO
                this.PlayerMeasureIndex++;
                //expectedMeasureIndex = this.playerMeasures[this.playerMeasureIndex];

                console.log("Current",this.Osmd.cursor.Iterator.CurrentMeasureIndex, "Expected",this.ExpectedMeasureIndex) ;
                if (
                    //!(this.osmd.cursor.Iterator.EndReached) &&
                    this.ExpectedMeasureIndex>=0 &&
                    (this.Osmd.cursor.Iterator.CurrentMeasureIndex!==this.ExpectedMeasureIndex)
                ){
                    // SIAMO IN PRESENZA DI UNA RIPETIZIONE
                    this.Osmd.cursor.resetIterator();
                    this.Osmd.cursor.update();
                    console.log("playerMeasures",this.PlayerMeasures) ;
                    console.log("Current",this.Osmd.cursor.Iterator.CurrentMeasureIndex, "Expected",this.ExpectedMeasureIndex) ;
                    while (this.Osmd.cursor.Iterator.CurrentMeasureIndex < this.ExpectedMeasureIndex) {
                        this.Osmd.cursor.Iterator.moveToNextVisibleVoiceEntry(false);
                        console.log("backJumpOccurred2",this.Osmd.cursor.iterator.backJumpOccurred);
                        this.Osmd.cursor.update();
                        console.log("Current",this.Osmd.cursor.Iterator.CurrentMeasureIndex, "Expected",this.ExpectedMeasureIndex) ;
                    }
                }
            }

            this.Osmd.cursor.update();
            console.log(this.Osmd.cursor.Iterator.CurrentRepetition);
            if (this.PlayerMeasureIndex>=this.PlayerMeasures.length) {
                this.PlayerMeasureIndex = this.PlayerMeasures.length-1;
            }
            if(
                this.Osmd.cursor.Iterator.EndReached ||
                this.ExpectedMeasureIndex<0
            ) {
                console.log("END REACHED");
                // QUI CALCOLEREMO SUCCESSI E FALLIMENTI
                console.log("NOTES TO PLAY", this.NotesToPlay);
                console.log("PLAYED NOTES", this.PlayedNotes);

                let success: number = 0;
                if (this.PlayedDone && this.PlayedShot) {
                    success = ((this.PlayedDone / this.PlayedShot ) * 100) || 0;
                }

                this.CurrentSection.Done[0][this.CurrentKey+7] += this.PlayedDone;
                this.CurrentSection.Done[1][this.CurrentKey+7] += this.PlayedDone;
                this.CurrentSection.Shot[0][this.CurrentKey+7] += (this.PlayedDone * 1.1) ;// this.PlayedShot;
                this.CurrentSection.Shot[1][this.CurrentKey+7] += (this.PlayedDone * 1.1) ;// this.PlayedShot;

                console.log("SUCCESS:", `${success.toFixed(2)}%` );

                this.Diary.duration = Date.now() - this.Diary.datetime;
                this.Diary.score = success;

                console.log(this.Diary);

                const diary: IDiaryObject = Object.assign({}, this.Diary);
                const section: IBranchObject = Object.assign({}, this.CurrentSection.BranchObject);

                this.Tree.updateAllPercents();

                window.electron.ipcRenderer.invoke(STR.requestSaveDiaryAndSection, {
                    diaryObject: diary,
                    sectionObject: section
                }).then((result: boolean)=>{
                    console.log(result);
                });

                this.Diary.datetime = 0;
                this.Diary.duration = 0;
                this.Diary.score = 0;

                this.NotesToPlay = 0;
                this.PlayedNotes = 0;
                //1
                this.Osmd.cursor.reset();
                this.PlayerMeasureIndex = 0;
                //2
                //this.reset();
            }
            this.fillOsmdNotes();
        }
    }
}
