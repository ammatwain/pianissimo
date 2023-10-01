import { STR } from "@Global/STR";
import {OpenSheetMusicDisplay } from "opensheetmusicdisplay";

import { RepetitionInstruction, Note, ExtendedOpenSheetMusicDisplay } from "../Extends/ExtendedOpenMusicDisplayManager";
import { ExtendedTransposeCalculator } from "extended-transpose-calculator";
import { WebMidi, Input as MidiInput, NoteMessageEvent } from "../WebMidi";
import { SheetFlowCalculator } from "@Frontend/SheetFlow";
import { SheetNode } from "@Frontend/AS/SheetNode";
import { IExercise } from "@Common/Interfaces/IExercise";
import { IBranchObject, IDiaryObject } from "@Library/Common";
import { MusicScore } from "../AS/MusicScore";

//import { KeyboardInputEvent } from "electron";

export interface IMaestroParams {
    musicScore: MusicScore;
}

interface IMaestroData extends IMaestroParams{
    etc?: ExtendedTransposeCalculator;
    midiInputs?: MidiInput[];
    osmd?: ExtendedOpenSheetMusicDisplay;
    repeats: [RepetitionInstruction[],RepetitionInstruction[]][];
    flow: SheetFlowCalculator;
    midiNotes: boolean[];
    osmdNotes: number[];
    playMeasures: number[];
    playMeasureIndex: number;
    exercises: IExercise[];
    currentExercise: IExercise;
    currentKey: number;
    currentSheet: SheetNode;
    notesToPlay: number;
    playedNotes: number;
    errors: number;
    diary: IDiaryObject;
}

export class Maestro{
    private data: IMaestroData = {
        //tree: null,
        //branches: null,
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
        currentSheet: null,
    };

    constructor(musicScore: MusicScore){
        this.MusicScore = musicScore;
        WebMidi.enable().then(() => {
            this.MidiInputs = WebMidi.inputs;
            this.OSMD = new ExtendedOpenSheetMusicDisplay(musicScore.Canvas, {
                backend: "svg",
                drawTitle: true,
                drawSubtitle: true,
                disableCursor: false,
                followCursor: true,
            });
            this.ETC = new ExtendedTransposeCalculator(this.OSMD);
            this.OSMD.TransposeCalculator = this.ETC;
            console.log(this.MidiInputs);
            this.Flow = new SheetFlowCalculator(this.OSMD);
            this.setListeners();
            this.MusicScore.sleeperHide();
        });

        //this.Tree = params.tree;
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

    public get CurrentSheet(): SheetNode {
        return this.data.currentSheet || null;
    }

    public set CurrentSheet(currentSection: SheetNode) {
        this.data.currentSheet = currentSection;
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

    public get ETC(): ExtendedTransposeCalculator {
        return this.data.etc;
    }

    public set ETC(etc: ExtendedTransposeCalculator) {
        if (etc instanceof ExtendedTransposeCalculator) {
            this.data.etc = etc;
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

    public get MidiInputs(): MidiInput[] {
        return this.data.midiInputs;
    }

    public set MidiInputs(midiInputs: MidiInput[]) {
        this.data.midiInputs = midiInputs;
    }

    public get MidiNotes(): boolean[]{
        return this.data.midiNotes;
    }

    public set MidiNotes(midiNotes: boolean[]) {
        this.data.midiNotes = midiNotes;
    }

    public get MusicScore(): MusicScore{
        return this.data.musicScore;
    }

    public set MusicScore(musicScore: MusicScore){
        if (musicScore instanceof MusicScore){
            this.data.musicScore = musicScore;
        } else {
            throw new Error("Bad MusicScore");
        }
    }

    public get NotesToPlay(): number {
        return this.data.notesToPlay || 0;
    }

    public set NotesToPlay(notesToPlay: number) {
        this.data.notesToPlay = notesToPlay;
    }

    public get OSMD(): ExtendedOpenSheetMusicDisplay {
        return this.data.osmd;
    }

    public set OSMD(osmd: ExtendedOpenSheetMusicDisplay) {
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
/*
    public get Tree(): WTree{
        return this.data.tree;
    }

    public set Tree(tree: WTree){
        this.data.tree = tree;
    }
*/
    public fillOsmdNotes(): void {
        this.OSMD.cursor.NotesUnderCursor().forEach((osmdNote: Note)=>{
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

        this.OSMD.cursor.reset();
        //2
        //this.playerMeasureIndex = 0;
        this.OSMD.cursor.SkipInvisibleNotes = false;
        this.fillOsmdNotes();
        if(this.data.osmdNotes.length<1){
            this.next();
        }
    }

    public loadXmSheet(
        musicXml: string,
        sheetNode: SheetNode,
        beforeStart: () => void = null,
        afterEnd: () => void = null
    ): void {
        if (
            sheetNode instanceof SheetNode &&
            musicXml !== "" &&
            typeof musicXml === "string"
        ) {
/*
            if(beforeStart!==null && typeof beforeStart === "function"){
                beforeStart();
            }

            this.CurrentSheet = sheetNode;

            this.OSMD.load(musicXml).then(()=>{
                console.log(sheetNode);

                if (key === null) {
                    key = this.ETC.MainKey;
                }

                this.CurrentKey = key;
                this.ETC.Options.transposeToKey(key);

                if (!(this.CurrentSheet.ActiveKeys.includes(this.CurrentKey))) {
                    this.CurrentSheet.ActiveKeys.push(this.CurrentKey);
                }

                this.Diary.datetime = 0;
                this.Diary.duration = 0;
                this.Diary.id = sheetNode.Id;
                this.Diary.key = 0;
                this.Diary.bpm = 0;
                this.Diary.score = 0;

                this.PlayerMeasures = [];
                this.PlayerMeasureIndex = 0;

                if (this.CurrentSheet.IsFragment) {
                    this.OSMD.setOptions({
                        drawFromMeasureNumber: this.CurrentSheet.MeasureStart,
                        drawUpToMeasureNumber: this.CurrentSheet.MeasureEnd,
                        //defaultColorMusic: "#cccccc",
                   });
                }

                this.PlayerMeasures = this.Flow.calculatePlayerMeasures();

                this.OSMD.zoom = 1.0;
                //this.osmd.FollowCursor = true;
                const titleSplitted: string[] = sheetNode.Name.split(";");
                if(titleSplitted.length===2){
                    this.OSMD.Sheet.TitleString = titleSplitted[0];
                    this.OSMD.Sheet.SubtitleString = titleSplitted[1];

                } else {
                    this.OSMD.Sheet.TitleString = sheetNode.Name;
                }

                this.OSMD.updateGraphic();
                this.OSMD.render();
                this.reset();
                this.OSMD.cursor.show();

                if(afterEnd!==null && typeof afterEnd === "function"){
                    afterEnd();
                }
*/
//************************************************************************************************* */
                this.CurrentSheet = sheetNode;
                if(beforeStart!==null && typeof beforeStart === "function"){
                    beforeStart();
                }
                this.OSMD.load(musicXml).then(() => {
                    this.MusicScore.sleeperShow();
                    // trasposition

                    this.ETC.Options.transposeToKey(this.MusicScore.SheetClass.ActiveKey);
                    this.OSMD.HiddenParts = this.MusicScore.SheetClass.HiddenParts;
                    this.OSMD.MeasureStart = this.MusicScore.SheetClass.MeasureStart;
                    this.OSMD.MeasureEnd = this.MusicScore.SheetClass.MeasureEnd;

                    this.Diary.datetime = 0;
                    this.Diary.duration = 0;
                    this.Diary.id = this.CurrentSheet.Id;
                    this.Diary.key = 0;
                    this.Diary.bpm = 0;
                    this.Diary.score = 0;

                    this.PlayerMeasures = [];
                    this.PlayerMeasureIndex = 0;

                    this.PlayerMeasures = this.Flow.calculatePlayerMeasures(this.OSMD.MeasureStart, this.OSMD.MeasureEnd);

                    this.OSMD.setOptions({
                        measureNumberInterval: 1,
                        //drawFromMeasureNumber: this.SheetClass.MeasureStart,
                        //drawUpToMeasureNumber: this.SheetClass.MeasureEnd,
                        //defaultColorMusic: "#1f1f1f",
                    });
                    this.OSMD.zoom = 1.0;
                    // strings
                    if (this.MusicScore.ScoreMode){
                        this.OSMD.Sheet.TitleString = this.MusicScore.ScoreNode.Title;
                        this.OSMD.Sheet.SubtitleString = this.MusicScore.ScoreNode.Subtitle;
                    } else {
                        this.OSMD.Sheet.TitleString = `${this.MusicScore.ScoreNode.Title} - ${this.MusicScore.SheetNode.Title}`;
                        this.OSMD.Sheet.SubtitleString = `${this.MusicScore.ScoreNode.Subtitle} - ${this.MusicScore.SheetNode.Subtitle}`;
                    }
                    this.OSMD.Sheet.ComposerString = this.MusicScore.ScoreNode.Author;
                    this.OSMD.updateGraphic();
                    this.OSMD.render();
                    this.reset();
                    this.OSMD.cursor.show();
                    if(afterEnd!==null && typeof afterEnd === "function"){
                        afterEnd();
                    }
                    //sthis.maestro.OSMD.cursor.show();
                    this.MusicScore.sleeperHide();
                });
//            }
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
        this.OSMD.cursor.reset();
        while(!this.OSMD.cursor.iterator.EndReached) {
            this.OSMD.cursor.next();
        }
    }

    public next(): void {
        this.data.osmdNotes = [];
        this.clearMidiNotes();
        //let expectedMeasureIndex:number = this.playerMeasures[this.playerMeasureIndex];
        console.log("PRE-WHILE ","Current",this.OSMD.cursor.Iterator.CurrentMeasureIndex, "Expected",this.ExpectedMeasureIndex) ;
        while (
            this.ExpectedMeasureIndex>=0 &&
            this.data.osmdNotes.length<1
//            !this.osmd.cursor.Iterator.EndReached &&
        ) {
            this.OSMD.cursor.Iterator.moveToNextVisibleVoiceEntry(false);
            this.OSMD.cursor.update();

    //      expectedMeasureIndex = this.playerMeasures[this.playerMeasureIndex];
    //      console.log("IN-WHILE  ","Current",this.osmd.cursor.Iterator.CurrentMeasureIndex, "Expected",expectedMeasureIndex) ;

            if (
                this.ExpectedMeasureIndex>=0 &&
                this.OSMD.cursor.Iterator.CurrentMeasureIndex!==this.ExpectedMeasureIndex
            ) {
                // C'E' SALTO UN SALTO DI MISURA
                // AGGIORNIAMO
                this.PlayerMeasureIndex++;
                //expectedMeasureIndex = this.playerMeasures[this.playerMeasureIndex];

                console.log("Current",this.OSMD.cursor.Iterator.CurrentMeasureIndex, "Expected",this.ExpectedMeasureIndex) ;
                if (
                    //!(this.osmd.cursor.Iterator.EndReached) &&
                    this.ExpectedMeasureIndex>=0 &&
                    (this.OSMD.cursor.Iterator.CurrentMeasureIndex!==this.ExpectedMeasureIndex)
                ){
                    // SIAMO IN PRESENZA DI UNA RIPETIZIONE
                    this.OSMD.cursor.resetIterator();
                    this.OSMD.cursor.update();
                    console.log("playerMeasures",this.PlayerMeasures) ;
                    console.log("Current",this.OSMD.cursor.Iterator.CurrentMeasureIndex, "Expected",this.ExpectedMeasureIndex) ;
                    while (this.OSMD.cursor.Iterator.CurrentMeasureIndex < this.ExpectedMeasureIndex) {
                        this.OSMD.cursor.Iterator.moveToNextVisibleVoiceEntry(false);
                        console.log("backJumpOccurred2",this.OSMD.cursor.iterator.backJumpOccurred);
                        this.OSMD.cursor.update();
                        console.log("Current",this.OSMD.cursor.Iterator.CurrentMeasureIndex, "Expected",this.ExpectedMeasureIndex) ;
                    }
                }
            }

            this.OSMD.cursor.update();
            console.log(this.OSMD.cursor.Iterator.CurrentRepetition);
            if (this.PlayerMeasureIndex>=this.PlayerMeasures.length) {
                this.PlayerMeasureIndex = this.PlayerMeasures.length-1;
            }
            if(
                this.OSMD.cursor.Iterator.EndReached ||
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
                this.CurrentSheet.doneAdd(this.CurrentKey,this.PlayedDone);
                this.CurrentSheet.shotAdd(this.CurrentKey,this.PlayedShot);
                console.log("SUCCESS:", `${success.toFixed(2)}%` );

                this.Diary.duration = Date.now() - this.Diary.datetime;
                this.Diary.score = success;

                console.log(this.Diary);

//TODO
//                this.Tree.updateAllPercents();
/*
                window.electron.ipcRenderer.invoke(STR.requestSaveDiaryAndSection, {
                    diaryObject: diary,
                    sectionObject: section
                }).then((result: boolean)=>{
                    console.log(result);
                });
*/
                this.Diary.datetime = 0;
                this.Diary.duration = 0;
                this.Diary.score = 0;

                this.NotesToPlay = 0;
                this.PlayedNotes = 0;
                //1
                this.OSMD.cursor.reset();
                this.PlayerMeasureIndex = 0;
                //2
                //this.reset();
            }
            this.fillOsmdNotes();
        }
    }

    setListeners(): void {
        console.log(1);
        if (this.MidiInputs) {
            console.log(2);
            this.MidiInputs.forEach((input: MidiInput)=>{
                console.log(3);
                input.addListener("noteon",(e: NoteMessageEvent)=>{
                    //console.log(e.note.number, e.timestamp, e);
                    this.setMidiNoteOn(e.note.number);
                    if (this.Diary.datetime===0){
                        this.Diary.datetime = Date.now();
                    }
                    this.Data.playedNotes++;
                    if(this.allNotesUnderCursorArePlayed()){
                        this.next();
                    }
                }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

                input.addListener(<Symbol><unknown>STR.noteoff,(e: NoteMessageEvent)=>{
                    this.setMidiNoteOff(e.note.number);
                }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

                input.addListener(<Symbol><unknown>STR.pitchbend ,(e: NoteMessageEvent)=>{
                    console.log(e);
                    this.setMidiNoteOff(e.note.number);
                }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

            });

            document.addEventListener(
                STR.keydown,
                (event: KeyboardEvent) => {
                    console.log(event.key);
                    if ( event.key === STR.ArrowRight) {
                        if(this.allNotesUnderCursorArePlayedDebug()){
                            if (this.Diary.datetime===0){
                                this.Diary.datetime = Date.now();
                            }
                            this.next();
                        }
                    }
                },
                false,
            );

            document.addEventListener(
                STR.keydown,
                (event: KeyboardEvent) => {
                    if (event.key === STR.ArrowRight) {
                        //
                    }
                },
                false,
            );
        }
    }

}
