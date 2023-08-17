import  { Store, StoreOptions } from "../Store";
import  { IEntry, IBookEntry, ISheetEntry, ISectionEntry, SheetFlowCalculator } from "../../";
import  OS from "os";
import  PATH from "path";
import  FS from "fs";


export class Letture extends Store {

    constructor (dbFileName: string, dbOptions: StoreOptions = { verbose: console.warn}) {
        super(dbFileName, dbOptions);

        this.Db.exec(""
            + "CREATE TABLE IF NOT EXISTS books ("
            +     " \"bookid\" NUMBER PRIMARY KEY,"
            +     " \"order\" REAL DEFAULT 0,"
            +     " \"checked\" NUMBER NOT NULL DEFAULT FALSE ,"
            +     " \"path\" TEXT NOT NULL UNIQUE,"
            +     " \"custom\" TEXT DEFAULT '{}'"
            + " );"
        );

        this.Db.exec(""
            + "CREATE TABLE IF NOT EXISTS sheets ("
            +     " \"sheetid\" NUMBER NOT NULL PRIMARY KEY,"
            +     " \"bookid\" NUMBER NOT NULL,"
            +     " \"order\" REAL NOT NULL DEFAULT 0.0 ,"
            +     " \"checked\" NUMBER NOT NULL DEFAULT FALSE ,"
            +     " \"name\" TEXT DEFAULT '',"
            +     " \"key\" NUMBER DEFAULT NULL,"
            +     " \"keys\" TEXT DEFAULT '[]',"
            +     " \"shot\" TEXT DEFAULT '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]',"
            +     " \"done\" TEXT DEFAULT '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]',"
            +     " \"custom\" TEXT DEFAULT '{}',"
            +     " \"sheet\" BLOB DEFAULT NULL"
            + " );"
        );

        this.Db.exec(""
            + "CREATE TABLE IF NOT EXISTS sections ("
            +     " \"sectionid\" NUMBER NOT NULL PRIMARY KEY,"
            +     " \"sheetid\" NUMBER NOT NULL,"
            +     " \"order\" REAL NOT NULL DEFAULT 0.0 ,"
//            +     " \"checked\" NUMBER NOT NULL DEFAULT FALSE ,"
            +     " \"name\" TEXT DEFAULT '',"
            +     " \"key\" NUMBER DEFAULT NULL,"
            +     " \"keys\" TEXT DEFAULT '[]',"
            +     " \"shot\" TEXT DEFAULT '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]',"
            +     " \"done\" TEXT DEFAULT '[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]',"
            +     " \"hands\" TEXT NOT NULL DEFAULT 'both',"
            +     " \"bpm\" NUMBER  DEFAULT NULL,"
            +     " \"custom\" TEXT DEFAULT '{}',"
            +     " \"measures\" TEXT DEFAULT '[]'"
            + " );"
        );

        this.Db.exec(""
        + "DROP VIEW IF EXISTS view_books; "
        + "CREATE VIEW IF NOT EXISTS view_books AS"
            + " SELECT"
            + " \"bookid\","
            + " \"order\" as bookorder,"
            + " \"path\","
            + " \"custom\""
            + " FROM"
            + " books;"
        );

        this.Db.exec(""
            + "CREATE VIEW IF NOT EXISTS view_sheets AS"
            + " SELECT"
            + " books.path AS \"path\","
            + " books.\"order\" AS bookorder,"
            + " sheets.\"sheetid\" AS \"sheetid\","
            + " sheets.\"bookid\" AS \"bookid\","
            + " sheets.\"order\" AS \"order\","
            + " sheets.\"name\" AS \"name\","
//            + " sheets.\"checked\" AS \"checked\","
            + " sheets.\"key\" AS \"key\","
            + " sheets.\"keys\" AS \"keys\","
            + " sheets.\"shot\" AS \"shot\","
            + " sheets.\"done\" AS \"done\","
            + " sheets.\"custom\" AS \"custom\""
            + " FROM"
            + " books LEFT JOIN sheets"
            + " ON books.bookid = sheets.bookid"
            + " WHERE sheetid IS NOT NULL"
            + " ORDER BY path, sheets.\"order\";"
        );
        this.Db.exec(
`
CREATE VIEW IF NOT EXISTS view_sections AS
SELECT
    view_sheets.path,
    view_sheets."bookorder" as "bookorder",
    view_sheets."order" as "sheetorder",
    sections."order" AS "order",
    view_sheets.bookid,
    sections."sheetid" AS "sheetid",
    sections."sectionid" AS "sectionid",
    sections."name" AS "name",
    sections."checked" AS "checked",
    sections."key" AS "key",
    sections."keys" AS "keys",
    sections."shot" AS "shot",
    sections."done" AS "done",
    sections."hands" AS "hands",
    sections."bpm" AS "bpm",
    sections."custom" AS "custom",
    sections."measures" AS "mesures"
FROM view_sheets LEFT JOIN sections ON view_sheets.sheetid = sections.sheetid
WHERE sectionid IS NOT NULL
ORDER BY bookorder,sheetorder,"order";`
        );
    }
    
    registerSheetTable() {
        this.Db.table('HOME', {
            columns: ['filename', 'data'],
            rows: function* () {
                for (const filename of FS.readdirSync(PATH.resolve(OS.homedir(),"./pianissimo")) {
                    const data = FS.readFileSync(filename);
                    yield { filename, data };
                }
            },
        });
    }

    rootBookEntry(): IBookEntry{
        const dbBookResult: IBookEntry[] = <IBookEntry[]>this.prepare(`SELECT * FROM "books" ORDER BY "order";`).all();
        const dbSheetResult: ISheetEntry[] = <ISheetEntry[]>this.prepare("SELECT * FROM view_sheets;").all();
        const dbSectionResult: ISectionEntry[] = <ISheetEntry[]>this.prepare("SELECT * FROM view_sections;").all();
        const levels: IEntry[][] = [
            [{
                id:"0",
                type:"book",
                bookid:0,
                path:"",
                name:"",
                order:0.0,
                checked:false,
                custom:{},
                children:[],
                parent: null,
            }],
            [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
        ]; // max 16 levels
        dbBookResult.forEach((book: IBookEntry) => {
            book.type = "book";
            book.checked = false;
            book.children = [];
            book.custom = JSON.parse(<string>book.custom) || {};
            const booksArray: string[] = book.path.split("/") || [];
            book.name = booksArray[booksArray.length-1];
            if (booksArray.length>0 && booksArray.length<16){
                levels[booksArray.length].push(book);
            }
        });

        dbSheetResult.forEach((sheet: ISheetEntry) => {
            sheet.type = "sheet";
            sheet.checked = false;
            sheet.children = [];

            if (typeof sheet.keys === "string") {
                sheet.keys = JSON.parse(sheet.keys) || [];
            }
            
            if (typeof sheet.shot === "string") {
                sheet.shot = JSON.parse(sheet.shot) || [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];
            }

            if (typeof sheet.done === "string") {
                sheet.done = JSON.parse(sheet.done) || [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];
            }

            if (typeof sheet.custom === "string") {
                sheet.custom = JSON.parse(<string>sheet.custom) || {};
            }

            const booksArray: string[] = sheet.path.split("/") || [];
            if (booksArray.length>0 && booksArray.length<16){
                levels[booksArray.length+1].push(sheet);
            }
        });

        dbSectionResult.forEach((section: ISectionEntry) => {
            section.type = "section";

            if (typeof section.keys === "string") {
                section.keys = JSON.parse(section.keys) || [];
            }
            
            if (typeof section.shot === "string") {
                section.shot = JSON.parse(section.shot) || [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];
            }

            if (typeof section.done === "string") {
                section.done = JSON.parse(section.done) || [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];
            }

            if (typeof section.custom === "string") {
                section.custom = JSON.parse(<string>section.custom) || {};
            }

            if (typeof section.measures === "string") {
                section.measures = JSON.parse(<string>section.measures) || [];
            }

            const booksArray: string[] = section.path.split("/") || [];
            if (booksArray.length>0 && booksArray.length<16){
                levels[booksArray.length+2].push(section);
            }
        });

        for(let i: number = 1; i < levels.length; i++) {
            const parentLevel: IEntry[] = levels[i-1];
            const level: IEntry[] = levels[i];
            if (level.length>0) {
                level.forEach((entry: IBookEntry) => {
                    //if ( entry.type !== "section" ){
                        let parent: IEntry = <IEntry>parentLevel.find((parentBook: IBookEntry)=>{
                            return (
                                (
                                    entry.type === "section" &&
                                    parentBook.type === "sheet" &&
                                    parentBook.sheetid === entry.sheetid &&
                                    entry.path.startsWith(`${parentBook.path}/`)
                                    //entry.path === parentBook.path
                                )
                                ||
                                (
                                    entry.type === "sheet" &&
                                    parentBook.type === "book" &&
                                    entry.path === parentBook.path
                                )
                                ||
                                (
                                    entry.type === "book" &&
                                    parentBook.type === "book" &&
                                    entry.path.startsWith(`${parentBook.path}/`)
                                )
                            );
                        }) || null;
                        if (!parent && parentLevel.length===1) {
                            parent = <IEntry>parentLevel[0] || null;
                        }
                        if (parent) {
                            if (entry.type === "book") {
                                entry.id = `${parent.id}-${entry.bookid}`;
                            } else if (entry.type === "sheet") {
                                entry.id = `${parent.id}-${entry.sheetid}`;
                                entry.path += `/${entry.name}`;
                            } else if (entry.type === "section") {
                                entry.id = `${parent.id}-${entry.sectionid}`;
                                entry.path += `/${parent.path}`;
                            }
                            parent.children.push(entry);
                        }
                        //delete book.parent;
                    //}
                });
            } else {
                break;
            }
        }
        return <IBookEntry>levels[0][0];
    }

}
