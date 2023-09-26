import { IBranchType } from "@Interfaces/IBranchType";

export interface IBranchObject {
    //COMMON, BOOK
    id?: number;
    parentid?: number;
    sequence?: number;
    type?: IBranchType;
    title?: string;
    // SHEET
    subtitle?: string;
    mainkey?: number;
    measurecount?: number;
    instrument?: number;
    score?: Buffer;
    // SECTION
    measurestart?: number;
    measureend?: number;
    activekey?: number;
    keys?: string;
    hands?: string;
    shot?: string;
    fail?: string;
    bpmratio?: number;
    // OLD
    name?: string;
    custom?: any;
    data?: Buffer;
    //

    $path?: string;
    $children?: IBranchObject[];
}

/*
CREATE TABLE "books" (
	"bookId"	INTEGER NOT NULL,
	"parentBookId"	INTEGER NOT NULL,
	"sequence"	INTEGER NOT NULL,
	"title"	INTEGER NOT NULL,
	PRIMARY KEY("bookId")
);

CREATE TABLE "scores" (
	"scoreId"	INTEGER NOT NULL,
	"bookId"	NUMERIC NOT NULL,
	"sequence"	INTEGER NOT NULL,
	"title"	TEXT NOT NULL,
	"subtitle"	TEXT DEFAULT null,
	"author"	TEXT DEFAULT null,
	"mainKey"	INTEGER DEFAULT null,
	"measures"	INTEGER DEFAULT null,
	"parts"	TEXT DEFAULT null,
	PRIMARY KEY("scoreId")
);

CREATE TABLE "sheets" (
	"sheetId"	INTEGER NOT NULL,
	"scoreId"	INTEGER NOT NULL,
	"sequence"	INTEGER NOT NULL,
	"title"	TEXT NOT NULL,
	"subtitle"	TEXT DEFAULT null,
	"activeKey"	INTEGER DEFAULT null,
	"activeKeys"	TEXT DEFAULT null,
	"measureStart"	INTEGER DEFAULT null,
	"measureEnd"	INTEGER DEFAULT null,
	"hiddenParts"	TEXT DEFAULT null,
	"selectedStaves"	TEXT DEFAULT null,
	"transposeBy"	TEXT DEFAULT null,
	"shot"	TEXT NOT NULL DEFAULT '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0',
	"done"	TEXT NOT NULL DEFAULT '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0',
	"loop"	TEXT NOT NULL DEFAULT '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0',
	PRIMARY KEY("sheetId")
);

CREATE TABLE "zippedScoreFiles" (
	"scoreId"	INTEGER NOT NULL,
	"zippedScoreFile"	BLOB NOT NULL,
	PRIMARY KEY("scoreId")
);

*/
