import { THiddenPart } from "@Library/Common/DataObjects";
import {
    OpenSheetMusicDisplay,
    GraphicalLine,
    GraphicalMeasure,
    GraphicalMusicPage,
    GraphicalStaffEntry,
    GraphicalSlur,
    GraphicalTie,
    GraphicalVoiceEntry,
    MusicSystem,
    StaffLine,
    VexFlowGraphicalNote,
    VexFlowMusicSheetDrawer
} from "opensheetmusicdisplay";
export * from "opensheetmusicdisplay";
export class ExtendedOpenSheetMusicDisplay extends OpenSheetMusicDisplay {

    private measureStart: number = 0;
    private measureEnd: number = 0;
    private activeColor: string = "#000000";
    private passiveColor: string = "#999999";
    private hiddenParts: THiddenPart = {};

    public get ActiveColor(): string {
        return this.activeColor;
    }

    public get HiddenParts(): THiddenPart {
        return this.hiddenParts || {};
    }

    public set HiddenParts(hiddenParts: THiddenPart) {
        this.hiddenParts = hiddenParts;
    }

    public get MeasureStart(): number {
        return this.measureStart;
    }

    public set MeasureStart(measureStart: number) {
        this.measureStart = measureStart - 1;
    }

    public get MeasureEnd(): number {
        return this.measureEnd;
    }

    public set MeasureEnd(measureEnd: number) {
        this.measureEnd = measureEnd - 1;
    }

    public get HasDisableds(): boolean {
        return (
            this.GraphicSheet &&
            !(this.measureStart===0 && (this.measureEnd === this.GraphicSheet.MeasureList.length - 1)) ||
            Object.keys(this.hiddenParts).length > 0
        );
    }

    public get PassiveColor(): string {
        return this.passiveColor;
    }

    public getStaveIndex(part: number, stave: number): number {
        let index: number = -1;
        for (let p: number = 0 ; p<this.Sheet.Parts.length; p++){
            for (let s: number = 0 ; s<this.Sheet.Parts[p].Staves.length; s++){
                index++;
                if (p===part && s===stave){
                    return index;
                }
            }
        }
        return index;
    }

    public getPartStaveFromIndex(searchedIndex: number): {part: number, stave: number} {
        let index: number = -1;
        for (let p: number = 0 ; p<this.Sheet.Parts.length; p++){
            for (let s: number = 0 ; s<this.Sheet.Parts[p].Staves.length; s++){
                index++;
                if (index === searchedIndex){
                    return {
                        part: p,
                        stave: s,
                    };
                }
            }
        }
        return null;
    }

    render(): void {
        if (this.HasDisableds){
            this.setOptions({
                defaultColorMusic: this.PassiveColor,
            });
        } else {
            this.setOptions({
                defaultColorMusic: this.ActiveColor,
            });
        }

        super.render();

        if (this.HasDisableds){
            this.colorizeNotes();
        }

        this.cursor.CursorOptions.type = 1;
        this.cursor.update();
    }

    measurePartStaveHidden(measure: number, staveIndex: number): boolean {
        //const partStave:  {part: number, stave: number} = this.getPartStaveFromIndex(staveIndex);
        //const partString: string = String(partStave.part);
        let hiddenPart: boolean = false;
        let hiddenMeasure: boolean;
        if  (
            measure >= this.MeasureStart &&
            measure <= this.MeasureEnd
        ) {
            hiddenMeasure = false;
        } else {
            hiddenMeasure = true;
        }

        if (
            //partString in this.HiddenParts &&
            Array.isArray(this.hiddenParts) &&
            this.hiddenParts.includes(staveIndex)
        ) {
            hiddenPart = true;
        }

        return hiddenPart || hiddenMeasure ;
    }

    colorizeNotes(): void {
        let color: string = this.passiveColor;
        this.GraphicSheet.MusicPages.forEach((musicPage: GraphicalMusicPage) => {
            musicPage.MusicSystems.forEach((musicSystem: MusicSystem) => {
                musicSystem.StaffLines.forEach((staffLine: StaffLine, staffIndex: number) => {
                    staffLine.GraphicalSlurs.forEach((graphicaSlur: GraphicalSlur) => {
                        const measureIndex: number = graphicaSlur.slur.StartNote.SourceMeasure.measureListIndex;
                        if (graphicaSlur.SVGElement instanceof SVGGElement) {
                            const path: SVGPathElement = graphicaSlur.SVGElement.querySelector("path");
                            if (path) {
                                color = this.measurePartStaveHidden(measureIndex,staffIndex )?this.passiveColor:this.ActiveColor;
                                path.style.fill = color;
                            }
                        }
                    });
//                    staffLine.Measures.forEach( (measure: GraphicalMeasure) => {
//                        console.log(measure);
//                    });
//                    staffLine.StaffLines.forEach( (line: GraphicalLine) => {
//                        console.log(line);
//                    });
                });
            });
        });
        //console.log(this.GraphicSheet.MusicPages[0].MusicSystems[0].StaffLines[1].GraphicalSlurs[0]);

        for (let m: number = 0; m < this.GraphicSheet.MeasureList.length; m++) {
            for (let s: number = 0; s < this.GraphicSheet.MeasureList[m].length; s++) {
                color = this.measurePartStaveHidden(m,s)?this.passiveColor:this.ActiveColor;
                for (let se: number = 0; se < this.GraphicSheet.MeasureList[m][s].staffEntries.length; se++) {
                    const seObj: GraphicalStaffEntry = this.GraphicSheet.MeasureList[m][s].staffEntries[se];
                    seObj.GraphicalInstructions.forEach((gi: any) => {
//                        console.log("GraphicalInstructions", gi);
                    });
                    seObj.GraphicalTies.forEach((tie: GraphicalTie) => {
//                        console.log(tie.SVGElement);
                        tie.SVGElement.querySelector("path").style.fill = color;
                    });
                    seObj.  GraphicalInstructions.forEach((gi: any) => {
//                        console.log("GraphicalInstructions", gi);
                    });

                    for (let gve: number = 0; gve < this.GraphicSheet.MeasureList[m][s].staffEntries[se].graphicalVoiceEntries.length; gve++) {

                        const gveObj: GraphicalVoiceEntry= seObj.graphicalVoiceEntries[gve];
                        for (
                            let note: number = 0;
                            note < this.GraphicSheet.MeasureList[m][s].staffEntries[se].graphicalVoiceEntries[gve].notes.length;
                            note++)
                        {
                            const graphicalNote: VexFlowGraphicalNote = <VexFlowGraphicalNote>gveObj.notes[note];

//                            graphicalNote.sourceNote.NoteheadColor = "red";
                            graphicalNote.getBeamSVGs().forEach((feBeam: HTMLElement) => {
                                feBeam.querySelector("path").style.fill = color;
                            });
                            const stem: HTMLElement = graphicalNote.getStemSVG();
                            if (stem !== null) {
                                stem.style.fill = color;
                                stem.style.stroke = color;
                                const path: SVGPathElement = <SVGPathElement>stem.querySelector("path");
                                if (path){
                                    path.style.fill = color;
                                    path.style.stroke = color;
                                }
                            };

                            const svg: any = (<any>graphicalNote).getSVGGElement();
                            if (svg && "children" in svg){
                                svg.style.fill = color;
                                svg.style.stroke = color;
                                for (let a: number = 0; a<svg.children.length; a++){
//                                    console.log(`a:${a}`);
                                    svg.children[a].style.fill = color;
                                    svg.children[a].style.stroke = color;
                                    if ("children" in svg.children[a]){
                                        for (let b: number = 0; b<svg.children[a].children.length; b++){
//                                            console.log(`a:${a}, b:${b}`);
                                            svg.children[a].children[b].style.fill = color;
                                            svg.children[a].children[b].style.stroke = color;
                                            if ("children" in svg.children[a].children[b]){
                                                for (let c: number = 0; c<svg.children[a].children[b].children.length; c++){
//                                                    console.log(`a:${a}, b:${b}, c:${c}`);
                                                    svg.children[a].children[b].children[c].style.fill = color;
                                                    svg.children[a].children[b].children[c].style.stroke = color;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
