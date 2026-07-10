const sql = require('mssql');
const fs = require('fs');
const path = require('path');
let connectionPool = null;
function sqlRequest() {
  const req = new sql.Request(connectionPool);
  req.on('error', (err) => {
    throw err;
  });
  return req;
}

async function runMigrations() {
  const { LAST_RUN, LAST_MIGRATION_NAME } = (await sqlRequest().query(`
    if OBJECT_ID('MIGRATION_DATA') is not null
      select * from MIGRATION_DATA
    ELSE
      SELECT NULL AS LAST_RUN, NULL AS LAST_MIGRATION_NAME
    `)).recordset[0];



  const migrationsDirectoryPath = path.resolve(__dirname, '../database-scripts/migrations');
  const migrations = fs.readdirSync(migrationsDirectoryPath);

  const migrationsToRun = getMigrationstoRun(migrations, LAST_RUN, LAST_MIGRATION_NAME);


  for (const migration of migrationsToRun) {
    const script = fs.readFileSync(path.join(migrationsDirectoryPath, migration), 'utf-8');
    await sqlRequest().query(script);
  }

  await sqlRequest()
      .input('date', new Date().toISOString())
      .input('migrationName', migrationsToRun.length > 0 ? migrations[migrations.length - 1] : LAST_MIGRATION_NAME)
      .query(`
      UPDATE MIGRATION_DATA SET LAST_RUN = @date, LAST_MIGRATION_NAME = @migrationName
    `)
}

function getMigrationstoRun(migrations, lastRun, lastMigrationName) {
  if (lastRun == null || lastMigrationName == null) return migrations;
  migrations.sort();
  const lastMigrationRun = migrations.findIndex(m => m === lastMigrationName);
  return migrations.slice(lastMigrationRun);
}

async function connectToDatabase(config) {

  console.log('Trying to connect to database...');
  try {
    connectionPool = await new sql.ConnectionPool(config).connect();
    console.log('Connected to database');

  } catch (err) {
    console.error('Connection to database failed');
    console.error(err);
    throw err;
  }
}

module.exports = {
  connectToDatabase,
  runMigrations,
  sqlRequest
}