export type TDBScoreObject = {
    scoreId: number;
	parentRackId: number;
	sequence: number;
	status: string;
	title: string;
	subtitle: string;
	author: string;
	measures: number;
	parts: string;
	mainKey: number;
	mainTempo: string;
};

export type TPartStave = {
	part: string;
	instrument: string;
	staves: boolean[];
};

export type TTempo = {
	beats: number;
	beatType: number;
	beatUnit: number;
	perMinute: number;
};


export type TScoreObject = {
    scoreId: number;
	parentRackId: number;
	sequence: number;
	status: string[];
	title: string;
	subtitle: string;
	author: string;
	measures: number;
	parts: TPartStave[];
	mainKey: number;
	mainTempo: TTempo;
};
