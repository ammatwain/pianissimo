import { STR } from "@Global/STR";

export const SqlQuery: {[index: string]: string} = {

CreateTableLibrary: `CREATE TABLE IF NOT EXISTS "${STR.library}" (
    "${STR.id}" INTEGER PRIMARY KEY,
    "${STR.parentid}" INTEGER DEFAULT 0,
    "${STR.sequence}" REAL DEFAULT 0,
    "${STR.type}" TEXT NOT NULL ,
    "${STR.name}" TEXT NOT NULL ,
    "${STR.custom}" TEXT DEFAULT '{}',
    "${STR.data}" BLOB DEFAULT NULL
);`,

CreateTableDiary: `CREATE TABLE IF NOT EXISTS "${STR.diary}" (
	"${STR.datetime}" INTEGER,
	"${STR.duration}" INTEGER NOT NULL,
	"${STR.id}"	INTEGER NOT NULL,
	"${STR.key}" INTEGER NOT NULL DEFAULT 0,
	"${STR.bpm}" IINTEGER NOT NULL DEFAULT 0,
	"${STR.score}" INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("${STR.datetime}")
);`,

SelectTableLibrary: `SELECT
    "${STR.id}",
    "${STR.parentid}",
    "${STR.sequence}",
    "${STR.type}",
    "${STR.name}",
    "${STR.custom}"
FROM
    "${STR.library}"
WHERE
    "${STR.type}"='${STR.book}'
OR
    "${STR.type}"='${STR.sheet}'
OR
    "${STR.type}"='${STR.section}'
ORDER BY
    "${STR.parentid}",
    "${STR.sequence}"
;`,

};

