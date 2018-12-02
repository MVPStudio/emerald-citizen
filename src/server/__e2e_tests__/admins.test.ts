import { testsClient } from './testsClient';
import { UserRole } from 'shared/ApiClient';

describe('admins', () => {

	it('should be able to create users and de-activate them', async () => {
		await testsClient.auth.login({ username: 'admin', password: 'admin' });

		const username = 'admin_create_reporter';
		const password = 'password';
		const { data: user } = await testsClient.users.create({ username, password, role: UserRole.reporter });

		expect(user.id).toBeDefined();
		expect(user.username).toBe(username);
		expect(user.is_active).toBe(true);

		await testsClient.auth.login({ username, password });

		const { data: updatedUser } = await testsClient.users.update({ id: user.id, is_active: false });

		expect(updatedUser.is_active).toBe(false);

		try {
			await testsClient.auth.login({ username, password });
		} catch (e) {
			return;
		}

		throw new Error('Should have failed to login with inactive user.');
	});

});