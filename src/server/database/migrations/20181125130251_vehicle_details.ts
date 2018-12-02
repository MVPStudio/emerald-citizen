import * as Knex from 'knex';

exports.up = async (knex: Knex) => {
	await knex.schema.alterTable('vehicle', function (table: Knex.CreateTableBuilder) {
		table.text('details').nullable();
	});
};

exports.down = async (knex: Knex) => {
	await knex.schema.alterTable('vehicle', function (table: Knex.CreateTableBuilder) {
		table.dropColumn('details');
	});
};
