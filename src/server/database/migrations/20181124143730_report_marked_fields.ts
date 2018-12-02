import * as Knex from 'knex';

exports.up = async (knex: Knex) => {
	await knex.schema.alterTable('report', function (table: Knex.CreateTableBuilder) {
		table.timestamp('marked_interesting_dt_tm');
		table.integer('marked_interesting_user_id').unsigned();
		table.foreign('marked_interesting_user_id').references('id').inTable('user');
		table.timestamp('marked_validated_dt_tm');
		table.integer('marked_validated_user_id').unsigned();
		table.foreign('marked_validated_user_id').references('id').inTable('user');
	});
};

exports.down = async (knex: Knex) => {
	await knex.schema.alterTable('report', function (table: Knex.CreateTableBuilder) {
		table.dropColumn('marked_interesting_dt_tm');
		table.dropColumn('marked_interesting_user_id');
		table.dropColumn('marked_validated_dt_tm');
		table.dropColumn('marked_validated_user_id');
	});
};
