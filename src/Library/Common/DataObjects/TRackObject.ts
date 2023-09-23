export type TDBRackObject = {
	rackId: number;
	parentRackId: number;
	sequence: number;
	status: string;
	title: string;
};

export type TRackObject = {
	rackId: number;
	parentRackId: number;
	sequence: number;
	status: string[];
	title: string;
};
