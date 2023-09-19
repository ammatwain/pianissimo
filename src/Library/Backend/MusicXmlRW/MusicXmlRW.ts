import fs from "fs";
import zlib from "zlib";
import { XmlDocument, XmlElement } from "xmldoc";

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
        return zlib.deflateRawSync(this.xmlStr);
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

    get Tempo(): any {
        let beats: number = 4;
        let beatType: number = 4;
        let beatUnit: string = "quarter";
        let perMinute: number = 120;

        const time: XmlElement = this.ScorePartWise.descendantWithPath("part.measure.attributes.time");
        const metronome: XmlElement = this.ScorePartWise.descendantWithPath("part.measure.direction.direction-type.metronome");

        if (time) {
            beats =  Number(time.childNamed("beats").val) || 4;
            beatType = Number(time.childNamed("beat-type").val) || 4;
        }

        if(metronome) {
            beatUnit = metronome.childNamed("beat-unit").val || "quarter";
            perMinute = Number(metronome.childNamed("per-minute").val) || 120 ;
        }

        return {
            beats: beats,
            beatType: beatType,
            beatUnit: beatUnit,
            perMinute: perMinute,
        };
    }

    get PartCount(): number {
        return this.PartList.length;
    }

    get PartList(): XmlElement[] {
        return this.ScorePartWise.childNamed("part-list").childrenNamed("score-part");
    }

    get Instruments(): {name: string, instrument: string}[] {
        const instruments: {name: string, instrument: string}[] = [];
        this.PartList.forEach((part: XmlElement)=>{
            let name: string;
            let instrument: string;
            try {
                name = part.childNamed("part-name").val || "Piano";
            } catch {
                name = "";
            }
            try {
                instrument = part.descendantWithPath("score-instrument.instrument-name").val || "";
            } catch {
                instrument = "";
            }
            if (name==="" || name.toLowerCase().includes("piano")) {
                name = "Piano";
                part.childNamed("part-name").fillText(name);
            }
            if (name==="Piano") {
                instrument = name;
                part.descendantWithPath("score-instrument.instrument-name").fillText(instrument);
            }
            instruments.push({
                name: name,
                instrument: instrument,
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
