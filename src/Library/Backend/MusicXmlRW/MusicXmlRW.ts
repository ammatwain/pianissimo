import fs from "fs";
import zlib from "zlib";
import { XmlDocument, XmlElement } from "xmldoc";
import { TPartStave, TTempo } from "@Library/Common/DataObjects";

export type PianissimoID =  {
    app?: string;
    user?: string;
    id?: number;
};

export class MusicXmlRW {
    private filename: string;
    private xmlStr: string;
    private xmlDom: XmlDocument;

    public get Zipped(): Buffer {
        return MusicXmlRW.zip(this.xmlStr);
    }

    public get XmlStr(): string {
        let data: string = "";
        data += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        data += "<!DOCTYPE score-partwise PUBLIC \"-//Recordare//DTD MusicXML 4.0 Partwise//EN\" \"http://www.musicxml.org/dtds/partwise.dtd\">";
        data += this.xmlDom.toStringWithIndent("",{compressed: true});
        return data;
    };

    constructor (xml: string = null){
        if (xml) {
            this.setData(xml);
        }
    }

    public setData(xml: string): void {
        this.xmlStr = xml;
        this.xmlDom = new XmlDocument(this.xmlStr);
    }

    public setZippedData(zip: Buffer): void {
        this.xmlStr = MusicXmlRW.unzip(zip);
        this.xmlDom = new XmlDocument(this.xmlStr);
    }

    public static unzip(zippedData: Buffer): string {
        return zlib.inflateRawSync(zippedData).toString("utf-8");
    }

    public static zip(unzippedData: string): Buffer {
        return zlib.deflateRawSync(unzippedData);
    }

    loadXml(filename: string): void {
        if (fs.existsSync(filename)) {
            this.filename = filename;
            const xml: string = fs.readFileSync(this.filename).toString("utf-8").trim();
            this.setData(xml);
            this.xmlDom.attr.version = "4.0";
        }
    }

    saveXml(filename: string = null): void {
        if (!filename) {
            filename = this.filename;
        }
        fs.writeFileSync(filename, this.XmlStr);
    }

    public query(tag: string): XmlElement {
        return this.xmlDom.childNamed(tag);
    }

    public queryAll(tag: string): XmlElement[] {
        return this.xmlDom.childrenNamed(tag);
    }

    public get ScorePartWise(): XmlElement {
        if (this.xmlDom && this.xmlDom.name === "score-partwise") {
            return this.xmlDom;
        }
        return undefined;
    }

    public get Miscellaneous(): XmlElement {
        if (this.Identification) {
            if (!this.Identification.childNamed("miscellaneous")) {
                this.Identification._addChild(new XmlElement( {name: "miscellaneous", attributes : {} }));
            }
        }
        return this.Identification.childNamed("miscellaneous");
    }

    public get Title(): string {
        try {
            return this.ScorePartWise.descendantWithPath("work.work-title").val;
        } catch {
            return "";
        }
    }

    public get Subtitle(): string {
        try {
            return this.ScorePartWise.descendantWithPath("movement-title").val;
        } catch {
            return "";
        }
    }

    public get Author(): string {
        try {
            return this.ScorePartWise.descendantWithPath("identification.creator@composer").val;
        } catch {
            return "";
        }
    }

    public get Pianissimo(): PianissimoID {
        let source: PianissimoID;
        if (this.Source) {
            try {
                source = <PianissimoID>JSON.parse(this.Source.val);
            } catch {
                source = null;
            }
        }
        if((
            source &&
            typeof source === "object" &&
            "app" in source && source.app==="pianissimo" &&
            "user" in source &&
            "id" in source
        )) {
            return source;
        } else {
            return null;
        }
    }

    public set Pianissimo(value: PianissimoID) {
        if (this.Source) {
            this.Source.fillText(JSON.stringify(value));
        }
    }

    public get Identification(): XmlElement {
        if (this.ScorePartWise) {
            return this.ScorePartWise.childNamed("identification");
        }
        return undefined;
    }

    get MeasureCount(): number {
        if (this.Part.length) {
            return this.Part[0].childrenNamed("measure").length;
        } else {
            return 0;
        }
    }

    get MainKey(): number {
        let mainKey: number = 0;
        try {
            mainKey = Number(this.ScorePartWise.descendantWithPath("part.measure.attributes.key.fifths").val);
        } catch {
            mainKey = 0;
        }
        return mainKey || 0;
    }

    public convertBeatUnit(beatUnit: string): number{
        const beatUnits: any= {
            "1024th":1/1024,
            "512th":1/512,
            "256th":1/256,
            "128th":1/128,
            "64th":1/64,
            "32nd":1/32,
            "16th":1/16,
            "eighth":1/8,
            "quarter":1/4,
            "half":1/2,
            "whole":1,
            "breve":2,
            "long":4,
            "maxima":8
        };
        if (beatUnit in beatUnits) {
            return beatUnits[beatUnit];
        } else {
            return 1/4;
        }
    }

    get Tempo(): TTempo {
        let beats: number = 4;
        let beatType: number = 4;
        let beatUnit: number = 1/4;
        let perMinute: number = 120;

        const time: XmlElement = this.ScorePartWise.descendantWithPath("part.measure.attributes.time");
        const metronome: XmlElement = this.ScorePartWise.descendantWithPath("part.measure.direction.direction-type.metronome");

        if (time) {
            beats =  Number(time.childNamed("beats").val) || 4;
            beatType = Number(time.childNamed("beat-type").val) || 4;
        }

        if(metronome) {
            beatUnit = this.convertBeatUnit(metronome.childNamed("beat-unit").val || "quarter");
            perMinute = Number(metronome.childNamed("per-minute").val) || 120 ;
        }

        return {
            beats: beats,
            beatType: beatType,
            beatUnit: beatUnit,
            perMinute: perMinute,
        };
    }

    get ScorePartCount(): number {
        return this.ScorePartList.length;
    }

    get ScorePartList(): XmlElement[] {
        return this.ScorePartWise.childNamed("part-list").childrenNamed("score-part");
    }

    get PartList(): XmlElement[] {
        return this.ScorePartWise.childrenNamed("part");
    }

    get Instruments(): TPartStave[] {
        const instruments: TPartStave[] = [];
        let absoluteStaveIndex: number = -1;
        this.ScorePartList.forEach((scorePart: XmlElement)=>{
            const id: string = scorePart.attr.id;
            let partName: string;
            let instrument: string;
            let numerOfStaves: number = 1;
            const staves: number[] = [];
            try {
                partName = scorePart.childNamed("part-name").val || "Piano";
            } catch {
                partName = "";
            }
            try {
                instrument = scorePart.descendantWithPath("score-instrument.instrument-name").val || "";
            } catch {
                instrument = "";
            }
            if (partName==="" || partName.toLowerCase().includes("piano")) {
                partName = "Piano";
                scorePart.childNamed("part-name").fillText(partName);
            }
            if (partName==="Piano") {
                instrument = partName;
                scorePart.descendantWithPath("score-instrument.instrument-name").fillText(instrument);
            }

            try {
                const part: XmlElement =  this.PartList.find((aPart: XmlElement) => {
                    return aPart.attr.id === id;
                });

                if (part) {
                    const xmlStaves: XmlElement = part.descendantWithPath("measure.attributes.staves");
                    if (xmlStaves) {
                        numerOfStaves = Number(xmlStaves.val) || 1;
                    }
                }
            } catch {
                numerOfStaves = 1;
            }

            for (let i: number = 0; i < numerOfStaves ; i++) {
                absoluteStaveIndex++;
                staves.push(absoluteStaveIndex);
            }
            instruments.push({
                part: partName,
                instrument: instrument,
                staves: staves,
            });
        });
        return instruments;
    }

    get Part(): XmlElement[] {
        return this.ScorePartWise.childrenNamed("part");
    }

    public get Source(): XmlElement {
        if (this.Identification) {
            if (!this.Identification.childNamed("source")) {
                this.Identification._addChild(new XmlElement( {name: "source", attributes : {} }));
            }
        }
        return this.Identification.childNamed("source");
    }

}
