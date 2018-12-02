import * as Knex from 'knex';

/* tslint:disable max-line-length */
exports.up = async (knex: Knex) => {
	await knex.schema.raw('CREATE EXTENSION pg_trgm');
	await knex.schema.raw('CREATE EXTENSION btree_gist');
};

exports.down = async (knex: Knex) => {
	await knex.schema.raw('DROP EXTENSION pg_trgm');
	await knex.schema.raw('DROP EXTENSION btree_gist');
};
