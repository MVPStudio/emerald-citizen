import { testsClient } from './testsClient';
import { CreateReportRequest } from 'shared/ApiClient';
import { PersonCategory } from '../report/ReportDao';

describe('analysts', () => {

	it('should be able to view all reports', async () => {
		await testsClient.users.login({ username: 'admin', password: 'admin' });
		const reportReq: CreateReportRequest = {
			user_id: 1,
			date: testsClient.now(),
			location: 'location',
			room_number: 'room_number',
			details: 'some serious details...',
			people: [{
				name: 'name',
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
		await testsClient.reports.create(reportReq);
		await testsClient.reports.create(reportReq);

		await testsClient.users.login({ username: 'analyst', password: 'analyst' });

		const { data: reports } = await testsClient.reports.find();
		await Promise.all(reports.map(report => testsClient.reports.findById(report.id)));
	});

});