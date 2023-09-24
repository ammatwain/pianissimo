import { TPartInstrument } from "./TScoreObject";

export type TDBSheetObject = {
    sheetId: number;
	parentScoreId: number;
	sequence: number;
	status: string;
	title: string;
	subtitle: string;
	practiceKeys: string;
	activeKey: number;
	measureStart: number;
	measureEnd: number;
	selectedParts: string;
	transposeSettings: string;
	shot: string;
	done: string;
	loop: string;
};

export type TTransposeSettings = {
	type: string;
	octave: number;
	transposeKeySignatures: boolean;
	removeKeySignatures: boolean;
};

export type TSheetObject = {
    sheetId: number;
	parentScoreId: number;
	sequence: number;
	status: string[];
	title: string;
	subtitle: string;
	practiceKeys: number[];
	activeKey: number;
	measureStart: number;
	measureEnd: number;
	selectedParts: TPartInstrument[];
	transposeSettings: TTransposeSettings;
	shot: number[];
	done: number[];
	loop: number[];
};
