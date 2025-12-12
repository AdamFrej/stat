export type ChartType = 'bar' | 'line' | 'area' | 'scatter';

export interface DataPoint {
	[key: string]: string | number | Date | null;
}

export interface Variable {
	id: number | string;
	name: string;
}

export interface WorkspaceState {
	selectedVariable: Variable | null;
	chartType: ChartType;
	data: DataPoint[];
	loading: boolean;
	error: string | null;
}

// Types for API responses from Statistics Poland (GUS - Główny Urząd Statystyczny)
// We will refine these as we verify the API response structure

export interface GusSubject {
	id: string;
	name: string;
	hasVariables: boolean;
	children?: GusSubject[];
}

export interface GusVariable {
	id: number;
	subjectId: string;
	n1: string; // Name
	level: number;
	measureUnitId: number;
	measureUnitName: string;
}

export interface GusDataResponse {
	page: number;
	pageSize: number;
	totalRecords: number;
	results: GusDataResult[];
}

export interface GusDataResult {
	id: number;
	name: string;
	values: GusValue[];
}

export interface GusValue {
	year: string;
	val: number;
	attrId: number;
}
