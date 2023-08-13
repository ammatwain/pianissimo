export interface IInfoFile {
    caption?: string;
    type?: 'book' | 'sheet';
    practice?: boolean;
    sheet?: 'sheet.mxl' | null;
    keys?: boolean[];
    shot?: number[];
    done?: number[];
    fail?: number[];
    percent?: number;
    info?: string;
}
