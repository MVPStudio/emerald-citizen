import { createTestClient, loginAsReporter } from './testsClient';
import { CreateReportRequest, PersonSex, PersonCategory, HairLength } from 'shared/ApiClient';

describe('reporters', () => {

	it('should be able to create a report', async () => {
		const client = createTestClient();

		const { data: user } = await loginAsReporter(client);

		const reportReq: CreateReportRequest = {
			user_id: user.id,
			date: client.now(),
			location: 'location',
			room_number: 'room_number',
			details: 'some serious details...',
			people: [{
				name: 'name',
				age: '111',
				height: 'height',
				weight: 'weight',
				hair_color: 'hair_color',
				hair_length: HairLength.bald,
				eye_color: 'eye_color',
				skin_color: 'skin_color',
				sex: PersonSex.male,
				has_piercings: true,
				has_tatoos: true,
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

		const { data: report } = await client.reports.create(reportReq);

		expect(report).toMatchObject(reportReq);
	});

});