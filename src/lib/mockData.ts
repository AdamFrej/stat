import type { GusDataResponse, GusSubject, GusVariable } from './types';

export const mockSubjects: GusSubject[] = [
	{
		id: 'P1',
		name: 'Population',
		hasVariables: true,
		children: []
	},
	{
		id: 'P2',
		name: 'Economy',
		hasVariables: true,
		children: []
	},
	{
		id: 'P3',
		name: 'Environment',
		hasVariables: true,
		children: []
	},
	{
		id: 'P4',
		name: 'Labour Market',
		hasVariables: true,
		children: []
	}
];

export const mockVariables: GusVariable[] = [
	{
		id: 101,
		subjectId: 'P1',
		n1: 'Total Population',
		level: 0,
		measureUnitId: 1,
		measureUnitName: 'person'
	},
	{
		id: 102,
		subjectId: 'P1',
		n1: 'Population Density',
		level: 0,
		measureUnitId: 2,
		measureUnitName: 'persons/km2'
	},
	{
		id: 201,
		subjectId: 'P2',
		n1: 'GDP per capita',
		level: 0,
		measureUnitId: 3,
		measureUnitName: 'PLN'
	}
];

export const mockData: GusDataResponse = {
	page: 0,
	pageSize: 100,
	totalRecords: 10,
	results: [
		{
			id: 101,
			name: 'Total Population',
			values: [
				{ year: '2015', val: 38005614, attrId: 1 },
				{ year: '2016', val: 37967209, attrId: 1 },
				{ year: '2017', val: 38433558, attrId: 1 },
				{ year: '2018', val: 38411148, attrId: 1 },
				{ year: '2019', val: 38382576, attrId: 1 },
				{ year: '2020', val: 38265013, attrId: 1 },
				{ year: '2021', val: 38080411, attrId: 1 },
				{ year: '2022', val: 37907704, attrId: 1 },
				{ year: '2023', val: 37677000, attrId: 1 }
			]
		}
	]
};
