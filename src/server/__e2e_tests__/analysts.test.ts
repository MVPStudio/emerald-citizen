import { createTestClient, loginAsAdmin, loginAsAnalyst } from './testsClient';
import { CreateReportRequest, PersonSex } from 'shared/ApiClient';
import { PersonCategory } from '../report/ReportDao';

describe('analysts', () => {

	it('should be able to view all reports', async () => {
		const client = createTestClient();

		await loginAsAdmin(client);
		const reportReq: CreateReportRequest = {
			user_id: 1,
			date: client.now(),
			location: 'location',
			room_number: 'room_number',
			details: 'some serious details...',
			people: [{
				name: 'name',
				age: '112',
				height: 'height',
				weight: 'weight',
				hair_color: 'hair_color',
				hair_length: 'hair_length',
				eye_color: 'eye_color',
				skin_color: 'skin_color',
				sex: PersonSex.male,
				details: 'details',
				category: PersonCategory.suspicious_person
			}],
			vehicles: [{
				make: 'make',
				model: 'model',
				color: 'color',
				license_plate: 'license_plate',
				details: 'details'
			}]
		};
		await client.reports.create(reportReq);
		await client.reports.create(reportReq);
		await client.auth.logout();

		await loginAsAnalyst(client);

		const { data: reports } = await client.reports.findSortedPage();

		await Promise.all(reports.map(report => client.reports.findById(report.id)));
	});

});