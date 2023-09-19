export type TSheetObject = {
    sheetId: number;
	parentScoreId: number;
	sequence: number;
	status: string;
	title: string;
	subtitle: string;
	activeKey: number;
	activeKeys: string;
	measureStart: number;
	measureEnd: number;
	selectedParts: string;
	selectedStaves: string;
	transposeBy: string;
	shot: string;
	done: string;
	loop: string;
};
