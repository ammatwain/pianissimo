import { STR } from "@Global/STR";
import { App } from "@Frontend/App";
import { IBranchObject } from "@Library/Common/Interfaces/IBranchObject";
import { BranchClass } from "@Frontend/BranchClass";
import { WTree } from "@Frontend/WTree";
import { Maestro } from "@Frontend/Maestro";
import { Input, NoteMessageEvent } from "@Frontend/WebMidi";

export function FrontendListeners( app: App): void {
    appFrontendListeners(app);
    maestroFrontendListeners(app.Maestro);
    window.electron.ipcRenderer.sendMessage(STR.requestSheetList, {});
}

function appFrontendListeners(app: App): void {

    window.electron.ipcRenderer.on( STR.responseSheetList, (sheetLibrary: IBranchObject[]) => {
        if (app.Tree && app.Tree instanceof WTree){
            app.Tree.initialize(sheetLibrary);
        }
    });

    window.electron.ipcRenderer.on(STR.responseSheetForSection, (ids: {sheetId: number, sectionId: number, xml: string }) => {
        const branch: BranchClass = app.Tree.getBranchById(ids.sectionId);
        if (branch.Type === STR.section && ids.xml!==null) {
            app.Tree.fillPropertyEditor(ids.sectionId);
            app.Maestro.loadXmSheet(ids.xml, branch);
        }
    });

    app.Data.test.addEventListener("click",()=>{
//        window.electron.ipcRenderer.invoke("request-dir-listing","../Letture/Letture").then((result: any)=>{
//                console.log("DIR-LISTING", result);
//        });
    });
}

function maestroFrontendListeners(maestro: Maestro): void {
    if (maestro.MidiInputs) {
        maestro.MidiInputs.forEach((input: Input)=>{

            input.addListener("noteon",(e: NoteMessageEvent)=>{
                //console.log(e.note.number, e.timestamp, e);
                maestro.setMidiNoteOn(e.note.number);
                if (maestro.Diary.datetime===0){
                    maestro.Diary.datetime = Date.now();
                }
                maestro.Data.playedNotes++;
                if(maestro.allNotesUnderCursorArePlayed()){
                      maestro.next();
                }
            }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

            input.addListener(<Symbol><unknown>STR.noteoff,(e: NoteMessageEvent)=>{
                maestro.setMidiNoteOff(e.note.number);
            }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

            input.addListener(<Symbol><unknown>STR.pitchbend ,(e: NoteMessageEvent)=>{
                console.log(e);
                maestro.setMidiNoteOff(e.note.number);
            }, {channels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]});

        });

        document.addEventListener(
            STR.keydown,
            (event: KeyboardEvent) => {
                if ( event.key === STR.ArrowRight) {
                    if(maestro.allNotesUnderCursorArePlayedDebug()){
                        if (maestro.Diary.datetime===0){
                            maestro.Diary.datetime = Date.now();
                        }
                        maestro.next();
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