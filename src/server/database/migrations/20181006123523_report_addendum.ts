import * as Knex from 'knex';

exports.up = async (knex: Knex) => {
	await knex.schema.createTable('report_addendum', function (table: Knex.CreateTableBuilder) {
		table.increments();
		table.integer('report_id').unsigned().notNullable();
		table.string('text').notNullable();
		table.timestamp('created_at ').defaultTo(knex.fn.now());
		table.timestamp('updated').defaultTo(knex.fn.now());
	});
};

exports.down = async (knex: Knex) => {
	await knex.schema.dropTable('report_addendum');
};
