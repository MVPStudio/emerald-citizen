import * as Knex from 'knex';

exports.up = async (knex: Knex) => {
	await knex.schema.alterTable('report', function (table: Knex.CreateTableBuilder) {
		table.boolean('marked_interesting').notNullable().defaultTo(false);
		table.boolean('marked_validated').notNullable().defaultTo(false);
	});
};

exports.down = async (knex: Knex) => {
	await knex.schema.alterTable('report', function (table: Knex.CreateTableBuilder) {
		table.dropColumn('marked_interesting');
		table.dropColumn('marked_validated');
	});
};
