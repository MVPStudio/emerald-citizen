import { createTestClient, loginAsAdmin } from './testsClient';
import { UserRole } from 'shared/ApiClient';

describe('admins', () => {

	it('should be able to create users and de-activate them', async () => {
		const client = createTestClient();

		await loginAsAdmin(client);

		const username = 'admin_create_reporter';
		const password = 'password';
		const { data: user } = await client.users.create({ username, password, role: UserRole.reporter });

		expect(user.id).toBeDefined();
		expect(user.username).toBe(username);
		expect(user.is_active).toBe(true);

		await client.auth.logout();
		await client.auth.login({ username, password });
		await client.auth.logout();
		await loginAsAdmin(client);

		const { data: updatedUser } = await client.users.update({ id: user.id, is_active: false });

		expect(updatedUser.is_active).toBe(false);

		await client.auth.logout();

		try {
			await client.auth.login({ username, password });
		} catch (e) {
			return;
		}

		throw new Error('Should have failed to login with inactive user.');
	});

});