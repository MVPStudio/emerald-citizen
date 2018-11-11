import { testsClient } from './testsClient';
import { CreateReportRequest } from 'shared/ApiClient';
import { PersonCategory } from '../report/ReportDao';

describe('reporters', () => {

	it('should be able to create a report', async () => {
		const { data: user } = await testsClient.auth.login({ username: 'reporter', password: 'reporter' });

		const reportReq: CreateReportRequest = {
			user_id: user.id,
			date: testsClient.now(),
			location: 'location',
			room_number: 'room_number',
			details: 'some serious details...',
			people: [{
				name: 'name',
				age: '111',
				height: 'height',
				weight: 'weight',
				hair_color: 'hair_color',
				hair_length: 'hair_length',
				eye_color: 'eye_color',
				skin_color: 'skin_color',
				sex: 'sex',
				details: 'details',
				category: PersonCategory.suspicious_person
			}],
			vehicles: [{
				make: 'make',
				model: 'model',
				color: 'color',
				license_plate: 'license_plate'
			}]
		};

		const { data: report } = await testsClient.reports.create(reportReq);

		expect(report).toMatchObject(reportReq);
	});

});