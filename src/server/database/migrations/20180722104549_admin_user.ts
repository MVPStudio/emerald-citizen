import * as Knex from 'knex';
import { UserRole, UserDao } from '../../user/UserDao';
import { UserService } from '../../user/UserService';

exports.up = async (knex: Knex) => {
	const userDao = new UserDao(knex);
	const userService = new UserService(userDao);

	await userService.create({ username: 'admin', password: 'admin', role: UserRole.admin });
	await userService.create({ username: 'reporter', password: 'reporter', role: UserRole.reporter });
	await userService.create({ username: 'analyst', password: 'analyst', role: UserRole.analyst });
};

exports.down = async (knex: Knex) => {
	const userDao = new UserDao(knex);

	const admin = await userDao.findByUsername('admin');

	if (admin != null) {
		await userDao.deleteById(admin.id);
	}

	const reporter = await userDao.findByUsername('reporter');

	if (reporter != null) {
		await userDao.deleteById(reporter.id);
	}

	const analyst = await userDao.findByUsername('analyst');

	if (analyst != null) {
		await userDao.deleteById(analyst.id);
	}
};
