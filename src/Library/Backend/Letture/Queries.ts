export const SqlQuery: {[index: string]: string} = {

CreateTableLibrary: `CREATE TABLE IF NOT EXISTS "library" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "parentid" NUMBER DEFAULT 0,
    "sequence" REAL DEFAULT 0,
    "type" TEXT NOT NULL ,
    "name" TEXT NOT NULL ,
    "custom" TEXT DEFAULT '{}',
    "data" BLOB DEFAULT NULL
);`,

SelectTableLibrary: "SELECT \"id\", \"parentid\", \"sequence\", \"type\", \"name\", \"custom\" FROM \"library\";",

};

