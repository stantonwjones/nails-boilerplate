import { type DbConfig } from '@projectinvicta/nails';

let DB_ADDRESS = process.env.NAILS_SQLITE_DB_FILE;
if (!DB_ADDRESS) DB_ADDRESS = 'sqlite://' + import.meta.dirname + '/development.db';

const db: DbConfig = {
  /** Sequelize Connector */
  address: process.env.NAILS_RELEASE_STAGE == 'test'
    ? 'sqlite::memory:'
    : DB_ADDRESS,
};

export default db;
