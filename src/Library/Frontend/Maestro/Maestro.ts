import { STR } from "@Global/STR";

import { RepetitionInstruction, Note, ExtendedOSMD, GraphicalNote, GraphicalMeasure, Cursor } from "../Extends/ExtendedOSMD";
import { ExtendedTransposeCalculator } from "extended-transpose-calculator";
import { WebMidi, Input as MidiInput, NoteMessageEvent, InputEventMap } from "../WebMidi";
import { SheetFlowCalculator } from "@Frontend/SheetFlow";
import { SheetNode } from "@Frontend/AS/SheetNode";
import { IExercise } from "@Common/Interfaces/IExercise";
import { IDiaryObject } from "@Library/Common";
import { MusicScore } from "../AS/MusicScore";

//import { KeyboardInputEvent } from "electron";

export interface IMaestroParams {
    musicScore: MusicScore;
}

interface IMaestroData extends IMaestroParams{
    etc?: ExtendedTransposeCalculator;
    midiInputs?: MidiInput[];
    osmd?: ExtendedOSMD;
    repeats: [RepetitionInstruction[],RepetitionInstruction[]][];
    flow: SheetFlowCalculator;
    midiNotes: boolean[];
    drawNotes: number[];
    latestMeasureIndex: number;
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
        musicScore: null,
        etc: null,
        midiInputs: [],
        osmd : null,
        repeats : [],
        flow: null,
        midiNotes : [],
        drawNotes : [],
        latestMeasureIndex: -1,
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
            this.OSMD = new ExtendedOSMD(musicScore.Canvas, {
                backend: "svg",
                drawTitle: true,
                drawSubtitle: true,
                disableCursor: false,
                followCursor: true,
            });
            this.ETC = new ExtendedTransposeCalculator(this.OSMD);
            this.OSMD.TransposeCalculator = this.ETC;
            this.Flow = new SheetFlowCalculator(this.OSMD);
            this.setListeners();
            this.MusicScore.sleeperHide();
        });

        //this.Tree = params.tree;
        this.DrawNotes = [];

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

    public get CurrentMeasureIndex(): number {
        return this.Cursor.Iterator.CurrentMeasureIndex || 0;
    }

    public get CurrentSheet(): SheetNode {
        return this.data.currentSheet || null;
    }

    public set CurrentSheet(currentSection: SheetNode) {
        this.data.currentSheet = currentSection;
    }

    public get Cursor(): Cursor {
        return this.OSMD.cursor;
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

    public get Errors(): number {
        return this.data.errors;
    }

    public set Errors(errors: number) {
        this.data.errors = errors;
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
        if (this.PlayMeasureIndex>=0) {
            return this.PlayerMeasures[this.PlayMeasureIndex];
        } else {
            return -1;
        }
    }

    public get Flow(): SheetFlowCalculator {
        return this.data.flow;
    }

    public set Flow(flow: SheetFlowCalculator) {
        this.data.flow = flow;
    }

    public get IsPlayableSelection(): boolean {
        let ok: boolean = false;
        this.Cursor.reset();
        let notesToPlay: number = 0;
        while(this.CurrentMeasureIndex < this.MeasureStart) {
            this.Cursor.Iterator.moveToNextVisibleVoiceEntry(true);
        }
        while(this.CurrentMeasureIndex <= this.MeasureEnd) {
            if (this.CurrentMeasureIndex <= this.MeasureEnd) {
                notesToPlay += this.fillDrawNotes();
            }
            this.Cursor.Iterator.moveToNextVisibleVoiceEntry(true);
        }
        ok = notesToPlay>0;
        console.log("NOTE TO PLAY", notesToPlay);
        this.DrawNotes = [];
        return ok;
    }

    public get IsPlaying(): boolean {
        return this.PlayedNotes>0;
    }

    public get LatestMeasureIndex(): number {
        return this.data.latestMeasureIndex;
    }

    public set LatestMeasureIndex(latestMeasureIndex: number) {
        this.data.latestMeasureIndex = latestMeasureIndex;
    }

    public get MeasureStart(): number {
        return this.MusicScore.SheetClass.MeasureStart-1;
    }

    public get MeasureEnd(): number {
        return this.MusicScore.SheetClass.MeasureEnd-1;
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
        console.log("this.NotesToPlay",this.NotesToPlay);
    }

    public get NotesUnderCursor(): number [] {
        const notesUnderCursor: number[] = [];
        this.Cursor.GNotesUnderCursor().forEach((osmdNote: GraphicalNote)=>{
            const parentMeasure: GraphicalMeasure = osmdNote.parentVoiceEntry.parentStaffEntry.parentMeasure;
            const measureIndex: number = parentMeasure.parentSourceMeasure.measureListIndex;
            const staffIndex: number = parentMeasure.ParentStaff.idInMusicSheet;
            const halfTone: number = osmdNote.sourceNote.halfTone;
            const isNotRest: boolean = !osmdNote.sourceNote.isRest();
            if (!this.OSMD.measurePartStaveHidden(measureIndex, staffIndex)){
                if (halfTone && isNotRest) {
                    notesUnderCursor.push(halfTone);
                    this.NotesToPlay++;
                }
            }
        });
        return notesUnderCursor;
    }

    public get OSMD(): ExtendedOSMD {
        return this.data.osmd;
    }

    public set OSMD(osmd: ExtendedOSMD) {
        this.data.osmd = osmd;
    }

    public get DrawNotes(): number[]{
        return this.data.drawNotes;
    }

    public set DrawNotes(drawNotes: number[]){
        this.data.drawNotes = drawNotes;
    }

    public get PlayerMeasures(): number[]{
        return this.data.playMeasures;
    }

    public set PlayerMeasures(playMeasures: number[]){
        this.data.playMeasures = playMeasures;
    }

    public get PlayMeasureIndex(): number{
        return this.data.playMeasureIndex || 0;
    }

    public set PlayMeasureIndex(playMeasureIndex: number){
        if (playMeasureIndex >= this.PlayerMeasures.length) {
            playMeasureIndex = this.PlayerMeasures.length-1;
        } else if (playMeasureIndex<0) {
            playMeasureIndex = 0;
        }
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
        console.log(this.PlayedNotes);
    }

    public get PlayedShot(): number {
        return this.data.playedNotes || 0;
    }

    public set PlayedShot(playedShot: number) {
        this.data.playedNotes = playedShot;
    }

    // METHODS ******************************************************************************

    public allNotesUnderCursorArePlayed(playType: string | boolean = "medio"): boolean {
        switch(playType) {
            case "facile": {
                // ciclo 1
                // controlla se le note grafiche sono suonate.
                let ok: boolean=false;
                console.log(STR.sheet, this.DrawNotes);
                console.log("midi", this.MidiNotes);
                for(let i: number = 0 ; i < this.DrawNotes.length; i++) {
                    if(this.getMidiNote(this.DrawNotes[i])) {ok = true;}
                }
                if (ok) {
                    this.clearMidiNotes();
                    this.clearDrawNotes();
                }
                return ok;
            }
            case "adattato": {
                // ciclo 1
                // controlla se le note grafiche sono suonate.
                let ok: boolean=true;
                const midiNotes: number[] = [];
                for (let i: number = 0; i < 128 ; i++){
                    if(this.MidiNotes[i]) {
                        midiNotes.push(i%12);
                        this.PlayedNotes++;
                    }
                }

                console.log(STR.sheet, this.DrawNotes);
                console.log("midi" , midiNotes);
                for(let i: number = 0 ; i < this.DrawNotes.length; i++) {
                    if (midiNotes.length>0) {
                        const index: number = midiNotes.indexOf(this.DrawNotes[i] % 12 );
                        if (index > -1) {
                            delete midiNotes[index];
                        } else {
                            ok = false;
                            this.Errors++;
                            break;
                        }
                    } else {
                        ok = false;
                        break;
                    }
                }
                if (ok) {
                    this.clearMidiNotes();
                    this.clearDrawNotes();
                }
                return ok;
            }
            case "medio": {
                // ciclo 1
                // controlla se le note grafiche sono suonate.
                let ok: boolean=true;
                const midiNotes: number[] = [];
                for (let i: number = 0; i < 128 ; i++ ){
                    if(this.MidiNotes[i]) {
                        midiNotes.push(i);
                    }
                }

                for(let i: number = 0 ; i < this.DrawNotes.length; i++) {
                    if(!this.getMidiNote(this.DrawNotes[i])) {
                        ok = false;
                    }
                }
                if (ok) {
                    //this.clearMidiNotes();
                    this.clearDrawNotes();
                }
                return ok;
            }
            case "difficile" : {
                // ciclo 1
                // controlla se le note grafiche sono suonate.
                let ok: boolean=true;
                console.log(STR.sheet,this.DrawNotes);
                console.log("midi",this.MidiNotes);
                for(let i: number = 0 ; i<this.DrawNotes.length; i++) {
                    if(!this.getMidiNote(this.DrawNotes[i])) {ok = false;}
                }
                // ciclo 2
                // se il ciclo 1 è ok, controlla se ci sono stecche.
                //if (ok){
                    for(let i: number = 0 ; i<this.MidiNotes.length; i++) {
                        if(this.MidiNotes[i]===true){
                            if(!this.DrawNotes.includes(i)) {
                                this.setMidiNoteOff(i);
                                ok = false;
                                console.log("hai steccato!");
                            }
                        };
                    }
                //}
                if (ok) {
                    this.clearMidiNotes();
                    this.clearDrawNotes();
                }
                return ok;
            }
            case true :
            case false : {
                this.clearMidiNotes();
                this.clearDrawNotes();
                return Boolean(playType);
            }
            default: {
                return false;
            }
        }
    }

    public clearDrawNotes(): void{
        this.DrawNotes = [];
    }

    public clearMidiNotes(): void{
        for (let i: number = 0 ; i < this.MidiNotes.length ; i++){
            this.MidiNotes[i]=false;
        }
    }

    public fillDrawNotes(): number {
        this.DrawNotes = this.NotesUnderCursor;
        return this.DrawNotes.length;
    }

    public getRandomExercise(): IExercise {
        return this.Exercises[ Math.floor( Math.random() * this.Exercises.length) ];
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

    public setMidiNoteOff(midiNoteValue: number): void{
        this.setMidiNote(midiNoteValue, false);
    }

    public setMidiNoteOn(midiNoteValue: number): void{
        this.setMidiNote(midiNoteValue, true);
    }

    public loadXmlSheet(
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

                this.PlayerMeasures = this.Flow.calculatePlayerMeasures(this.OSMD.MeasureStart, this.OSMD.MeasureEnd);

                this.PlayMeasureIndex = 0;

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
                if (!this.IsPlayableSelection) {
                    alert("Non ci sono note da suonare nalla selezione");
                    return null;
                }
                this.Cursor.show();
                this.reset();
                if(afterEnd!==null && typeof afterEnd === "function"){
                    afterEnd();
                }
                this.MusicScore.sleeperHide();
            });
        }
    }

    public test(): void {
        this.Cursor.reset();
        while(!this.Cursor.iterator.EndReached) {
            this.Cursor.next();
        }
    }

    checkPlayability(): boolean{
        this.reset();
        return true;
    }

    public next(): void {
        //this.clearMidiNotes();
        this.clearDrawNotes();
        while (
            this.ExpectedMeasureIndex >= 0 && (
                this.CurrentMeasureIndex < this.ExpectedMeasureIndex ||
                this.DrawNotes.length === 0
            )
        ) {
            this.LatestMeasureIndex = this.CurrentMeasureIndex;
            this.Cursor.Iterator.moveToNextVisibleVoiceEntry(true);
            if (this.LatestMeasureIndex!==this.CurrentMeasureIndex){
                this.LatestMeasureIndex = this.CurrentMeasureIndex;
                this.PlayMeasureIndex++;
                if (this.ExpectedMeasureIndex>=0) {
                    if (this.CurrentMeasureIndex !== this.ExpectedMeasureIndex){
                        this.resetTo(this.ExpectedMeasureIndex);
                    }
                } else {
                    this.reset(true);
                }
            }
            this.fillDrawNotes();
        }
        this.Cursor.update();
        console.log("this.Cursor.NotesUnderCursor",this.Cursor.NotesUnderCursor());
        console.log("this.Cursor.GNotesUnderCursor",this.Cursor.GNotesUnderCursor());
    }

    public resetTo(newMeasureIndex: number): void {
        this.Cursor.reset();
        //this.Cursor.resetIterator();
        while (
            this.Cursor.Iterator.CurrentMeasureIndex < newMeasureIndex
        ) {
            this.Cursor.Iterator.moveToNextVisibleVoiceEntry(true);
        }
        this.Cursor.update();
    }

    public reset(calculate: boolean = false): void {
        if (calculate){
            if(
                this.Cursor.Iterator.EndReached ||
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
                //this.CurrentSheet.doneAdd(this.CurrentKey,this.PlayedDone);
                //this.CurrentSheet.shotAdd(this.CurrentKey,this.PlayedShot);
                console.log("SUCCESS:", `${success.toFixed(2)}%` );

                this.Diary.duration = Date.now() - this.Diary.datetime;
                this.Diary.score = success;

                console.log(this.Diary);

                this.Diary.datetime = 0;
                this.Diary.duration = 0;
                this.Diary.score = 0;

                this.NotesToPlay = 0;
                this.PlayedNotes = 0;
                this.Cursor.reset();
                //this.Cursor.reset();
                this.PlayMeasureIndex = 0; //this.OSMD.MeasureStart;
            }
        }
        this.NotesToPlay = 0;
        this.PlayedNotes = 0;
        this.Errors = 0;

        this.PlayMeasureIndex = 0;
        this.resetTo(this.ExpectedMeasureIndex);
        this.Cursor.SkipInvisibleNotes = false;
        this.fillDrawNotes();
        if(this.DrawNotes.length<1){
            this.next();
        }
    }

    public __next(): void {
        this.DrawNotes = [];
        this.clearMidiNotes();
        //
        const oldMeasureIndex: number = this.Cursor.Iterator.CurrentMeasureIndex;
        this.Cursor.Iterator.moveToNextVisibleVoiceEntry(true);
        const newMeasureIndex: number = this.Cursor.Iterator.CurrentMeasureIndex;
        if (newMeasureIndex !== oldMeasureIndex){
            // la battuta è cambiata,
            // ora dobbiame controllare se quella in cui ci troviamo adesso è quella
            // prevista dal "piano" di ripetizione delle battute
            // siccome l'indice di battuta è incrementato di uno
            // dobbiamo incrementre l'indice del "piano" di ripetizione di uno
            // e controllare se il valore contenuto nell'indice del piano
            // sia uguale all'indice di battuta attuale.
            // SE NON LO E',
            // allora bisogna spostarsi con in avanti o all'indietro fino a che
            // i due valori combaciano.
            //
            // OK INCREMENTIAMO L'INDICE DEL PIANO DI BATTUTA
            //this.moveToNext(newMeasureIndex);
        }
        this.fillDrawNotes();
        this.Cursor.update();
    }

    public _next(): void {
        this.DrawNotes = [];
        this.clearMidiNotes();
        //let expectedMeasureIndex:number = this.playerMeasures[this.playerMeasureIndex];
        console.log(
            "PRE-WHILE ",
            "Current", this.Cursor.Iterator.CurrentMeasureIndex,
            "Expected", this.ExpectedMeasureIndex,
            "CurrentIndexInRepetitionArray",this.PlayMeasureIndex
        ) ;
        if (this.PlayMeasureIndex === -1){
            this.PlayMeasureIndex = 0;
            //this.Cursor.resetIterator();
            while (this.Cursor.Iterator.CurrentMeasureIndex !== this.ExpectedMeasureIndex) {
                this.Cursor.Iterator.moveToNextVisibleVoiceEntry(false);
            };
        }
        while (
            this.ExpectedMeasureIndex>=0 &&
            this.DrawNotes.length<1
        ) {
            this.Cursor.Iterator.moveToNextVisibleVoiceEntry(false);
            this.Cursor.update();
            if (
                this.ExpectedMeasureIndex >= 0 &&
                this.Cursor.Iterator.CurrentMeasureIndex!==this.ExpectedMeasureIndex
            ) {
                console.log("PROCEDURE 2");
                // C'E' SALTO UN SALTO DI MISURA
                // QUANDO C'E' UN SALTO DI MISURA IL CONTATORE DEL PLAYER VIENE COMUNQUE INCREMENTATO
                //if (this.CurrentIndexInRepetitionArray !== 0) {
                    this.PlayMeasureIndex++;
                //}
                console.log("Current",this.Cursor.Iterator.CurrentMeasureIndex, "Expected",this.ExpectedMeasureIndex) ;
                if (
                    this.ExpectedMeasureIndex>=0 &&
                    (this.Cursor.Iterator.CurrentMeasureIndex!==this.ExpectedMeasureIndex)
                ){
                    console.log("NEXT", 3);
                    // SIAMO IN PRESENZA DI UNA RIPETIZIONE
                    this.Cursor.resetIterator();
                    this.Cursor.update();
//                    console.log("playerMeasures",this.PlayerMeasures) ;
                    console.log("Current",this.Cursor.Iterator.CurrentMeasureIndex, "Expected",this.ExpectedMeasureIndex) ;
                    while (this.Cursor.Iterator.CurrentMeasureIndex < this.ExpectedMeasureIndex) {
                        this.Cursor.Iterator.moveToNextVisibleVoiceEntry(false);
//                        console.log("backJumpOccurred2",this.Cursor.iterator.backJumpOccurred);
                        this.Cursor.update();
                        console.log(
                            "IN-WHILE",
                            "Current",this.Cursor.Iterator.CurrentMeasureIndex,
                            "Expected",this.ExpectedMeasureIndex,
                            "CurrentIndexInRepetitionArray",this.PlayMeasureIndex
                        ) ;
                    }
                }
            }

            this.Cursor.update();
            if (this.PlayMeasureIndex>=this.PlayerMeasures.length) {
                this.PlayMeasureIndex = this.PlayerMeasures.length-1;
            }
            if(
                this.Cursor.Iterator.EndReached ||
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

                this.Diary.datetime = 0;
                this.Diary.duration = 0;
                this.Diary.score = 0;

                this.NotesToPlay = 0;
                this.PlayedNotes = 0;
                this.reset();
                //this.Cursor.reset();
                this.PlayMeasureIndex = 0; //this.OSMD.MeasureStart;

            }
            this.fillDrawNotes();
        }
    }

    setListeners(): void {
        if (this.MidiInputs) {
            this.MidiInputs.forEach((input: MidiInput)=>{
                input.addListener("noteon",(e: NoteMessageEvent)=>{
                    this.setMidiNoteOn(e.note.number);
                    if (this.Diary.datetime===0){
                        this.Diary.datetime = Date.now();
                    }
                    this.PlayedNotes++;
                    if(this.allNotesUnderCursorArePlayed()){
                        this.next();
                    }
                }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

                input.addListener(<keyof InputEventMap>STR.noteoff,(e: NoteMessageEvent)=>{
                    this.setMidiNoteOff(e.note.number);
                }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

                input.addListener(<keyof InputEventMap>STR.pitchbend ,(e: NoteMessageEvent)=>{
                    console.log(e);
                    //this.setMidiNoteOff(e.note.number);
                }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

            });

            document.addEventListener(
                STR.keydown,
                (event: KeyboardEvent) => {
                    if ( event.key === STR.ArrowRight) {
                        this.PlayedNotes += this.DrawNotes.length + (Math.floor(Math.random() * 2));
                        if(this.allNotesUnderCursorArePlayed(true)){
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
