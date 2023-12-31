import { STR } from "@Global/STR";
import { Maestro } from "@Frontend/Maestro";
import { Input, NoteMessageEvent } from "@Frontend/WebMidi";

/*
function appFrontendListeners(app: App): void {

    window.electron.ipcRenderer.on( STR.responseSheetList, (sheetLibrary: IBranchObject[]) => {
        if (app.Tree && app.Tree instanceof WTree){
            app.Tree.initialize(sheetLibrary);
            fillNodes(sheetLibrary, app.AsNode, "Libreria di Pianissimo");
        }
    });

    window.electron.ipcRenderer.on(STR.responseSheetForSection, (ids: {sheetId: number, sectionId: number, xml: string }) => {
        const branch: BranchClass = app.Tree.getBranchById(ids.sectionId);
        if (branch.Type === STR.section && ids.xml!==null) {
            app.Tree.fillPropertyEditor(ids.sectionId);
            app.Maestro.loadXmlSheet(ids.xml, branch);
        }
    });

    app.Data.test.addEventListener("click",()=>{
        window.electron.ipcRenderer.invoke("request-library-index").then((result: any)=>{
                console.log("RESPONSE-LIBRARY-INDEX", result);
        });
    });
}
*/
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
                    if(maestro.allNotesUnderCursorArePlayed(true)){
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

let $WtreeDragged: HTMLLIElement = null;

function isDropAllowew(event: DragEvent, dragLi: HTMLLIElement, dropLi: HTMLElement): boolean{
    let ok: boolean = false;
    if (dragLi !== null && dropLi instanceof HTMLElement && dragLi !== dropLi) {
        const dstLi: HTMLLIElement = <HTMLLIElement>dropLi.closest("LI");
        if (dstLi && dstLi.classList.contains("branch")) {
            const srcLi: HTMLLIElement = $WtreeDragged;
            const srcUl: HTMLUListElement = <HTMLUListElement>srcLi.closest("UL");
            const dstUl: HTMLUListElement = <HTMLUListElement>dstLi.closest("UL");
            if (srcUl===dstUl) { // sequence change
                console.log("sequence change");
                ok = true;
            } else { //traferimento su altro livello che NON può esser livello figlio
                if (srcUl && dstUl && srcUl.id && dstUl.id && !(srcUl.querySelector(`ul#${dstUl.id}`))) {
                    console.log("DROP", dstLi);
                    ok = true;
                } else {
                    ok = false;
                    event.dataTransfer.dropEffect = "none";
                }
            }
            //event.preventDefault();
        }
    }
    return ok;
}

function documentFrontendListeners(): void{
    document.addEventListener("dragstart", (event: DragEvent) => {
        // store a ref. on the dragged elem
        if (event.target instanceof HTMLLIElement) {
            if (event.target.tagName==="LI" && event.target.classList.contains("branch")) {
                $WtreeDragged = <HTMLLIElement>event.target;
                console.log("DRAGSTART", event.target);
            } else {
                this.$WtreeDragged = null;
            }
        }
    });

    document.addEventListener("dragover", (event: DragEvent) => {
        // store a ref. on the dragged elem
        //console.log("DRAGOVER", event.target);
        if (event.target instanceof HTMLElement && isDropAllowew(event, $WtreeDragged, event.target)) {
            event.dataTransfer.effectAllowed = "copy";
            event.dataTransfer.dropEffect = "copy";
            event.preventDefault();
        } else {
            event.dataTransfer.effectAllowed = "none";
            event.dataTransfer.dropEffect = "none";
        }
    });

    document.addEventListener("drop", (event: DragEvent) => {
        // store a ref. on the dragged elem
        if (event.target instanceof HTMLElement && isDropAllowew(event, $WtreeDragged, event.target)) {
            event.dataTransfer.effectAllowed = "copy";
            event.dataTransfer.dropEffect = "copy";
            event.preventDefault();
        } else {
            event.dataTransfer.effectAllowed = "none";
            event.dataTransfer.dropEffect = "none";
        }
    });
}
