export type TSheetObject = {
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
	selectedStaves: string;
	transposeBy: string;
	shot: string;
	done: string;
	loop: string;
};
