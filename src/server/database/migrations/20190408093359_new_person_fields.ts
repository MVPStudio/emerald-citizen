import * as Knex from 'knex';

exports.up = async (knex: Knex) => {
	await knex.schema.alterTable('person', function (table: Knex.CreateTableBuilder) {
		table.boolean('has_tatoos').notNullable().defaultTo(false);
		table.boolean('has_piercings').notNullable().defaultTo(false);
	});
};

exports.down = async (knex: Knex) => {
	await knex.schema.alterTable('person', function (table: Knex.CreateTableBuilder) {
		table.dropColumn('has_tatoos');
		table.dropColumn('has_piercings');
	});
};
