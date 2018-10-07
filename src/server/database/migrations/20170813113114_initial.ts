import * as Knex from 'knex';
import { CreateTableBuilder } from 'knex';

exports.up = async (knex: Knex) => {
	await knex.schema.createTable('user', function (table: CreateTableBuilder) {
		table.increments();
		table.string('username').unique().notNullable();
		table.string('password').notNullable();
		table.string('role').notNullable();
		table.boolean('is_active').notNullable().defaultTo(true);
		table.timestamp('created_at ').defaultTo(knex.fn.now());
		table.timestamp('updated').defaultTo(knex.fn.now());
	});

	await knex.schema.createTable('report', function (table: CreateTableBuilder) {
		table.increments();
		table.integer('user_id').unsigned().notNullable();
		table.foreign('user_id').references('id').inTable('user');
		table.dateTime('date').notNullable();
		table.text('details').nullable();
		table.string('location').nullable();
		table.string('room_number').nullable();
		table.float('geo_latitude').nullable();
		table.float('geo_longitude').nullable();
		table.timestamp('created_at ').defaultTo(knex.fn.now());
		table.timestamp('updated').defaultTo(knex.fn.now());
	});

	await knex.schema.createTable('person', function (table: CreateTableBuilder) {
		table.increments();
		table.integer('report_id').unsigned().notNullable();
		table.foreign('report_id').references('id').inTable('report');
		table.string('name').nullable();
		table.string('age').nullable();
		table.string('height').nullable();
		table.string('weight').nullable();
		table.string('hair_color').nullable();
		table.string('hair_length').nullable();
		table.string('eye_color').nullable();
		table.string('skin_color').nullable();
		table.string('sex').nullable();
		table.text('details').nullable();
		table.enum('category', ['suspicious_person', 'victim', 'buyer']).nullable();
		table.timestamp('created_at ').defaultTo(knex.fn.now());
		table.timestamp('updated').defaultTo(knex.fn.now());
	})

	await knex.schema.createTable('vehicle', function (table: CreateTableBuilder) {
		table.increments();
		table.integer('report_id').unsigned().notNullable();
		table.foreign('report_id').references('id').inTable('report');
		table.string('make').nullable();
		table.string('model').nullable();
		table.string('color').nullable();
		table.string('license_plate').nullable();
		table.timestamp('created_at ').defaultTo(knex.fn.now());
		table.timestamp('updated').defaultTo(knex.fn.now());
	})
};

exports.down = async (knex: Knex) => {
	await knex.schema.dropTable('vehicle');
	await knex.schema.dropTable('person');
	await knex.schema.dropTable('report');
	await knex.schema.dropTable('user');
};
