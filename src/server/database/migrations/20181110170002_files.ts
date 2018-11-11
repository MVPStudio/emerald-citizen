import * as Knex from 'knex';

exports.up = async (knex: Knex) => {
	await knex.schema.alterTable('report_addendum', function (table: Knex.CreateTableBuilder) {
		table.foreign('report_id').references('id').inTable('report');
	});

	await knex.schema.createTable('report_file', function (table: Knex.CreateTableBuilder) {
		table.increments();
		table.integer('report_id').unsigned().notNullable();
		table.foreign('report_id').references('id').inTable('report');
		table.string('filename').notNullable();
		table.timestamp('created_at ').defaultTo(knex.fn.now());
		table.timestamp('updated').defaultTo(knex.fn.now());
	});
};

exports.down = async (knex: Knex) => {
	await knex.schema.dropTable('report_file');
};
