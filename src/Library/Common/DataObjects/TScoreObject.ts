import {TMajorKey} from "./TFieldTypes";

export type TScoreObject = {
    scoreId: number;
	parentRackId: number;
	sequence: number;
	status: string;
	title: string;
	subtitle: string;
	author: string;
	mainKey: TMajorKey;
	measures: number;
	parts: string;
};
