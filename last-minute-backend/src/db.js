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

async function getMigrationTableColumns() {
  const schemaResult = await sqlRequest().query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'MIGRATION_DATA'
    `);

    return schemaResult.recordset ? schemaResult.recordset.map(row => row.COLUMN_NAME) : [];
}

async function backfillOldMigrationData(lastMigrationName, migrationsDirectoryPath) {
  const allMigrations = getLocalMigrations(migrationsDirectoryPath);
  const lastIndex = allMigrations.indexOf(lastMigrationName);

  if (lastIndex !== -1) {
    const previouslyRunMigrations = allMigrations.slice(0, lastIndex + 1);

    for (const mig of previouslyRunMigrations) {
      await sqlRequest()
        .input('migrationName', mig)
        .query(`INSERT INTO MIGRATION_DATA (MIGRATION_NAME) VALUES (@migrationName)`);
    }
  }
}

async function ensureMigrationTableStructure(columns, migrationsDirectoryPath) {
  if (columns.includes('LAST_MIGRATION_NAME')) {
      console.log('MIGRATION_DATA table is updating to the new version...');

      const lastRunResult = await sqlRequest().query(`SELECT LAST_MIGRATION_NAME FROM MIGRATION_DATA`);
      const lastMigrationName = lastRunResult.recordset[0]?.LAST_MIGRATION_NAME || null;

      await sqlRequest().query(`
        DELETE FROM MIGRATION_DATA;
        ALTER TABLE MIGRATION_DATA ADD MIGRATION_NAME VARCHAR(255) NOT NULL PRIMARY KEY;
        ALTER TABLE MIGRATION_DATA ADD RUN_DATE DATETIME NOT NULL DEFAULT GETDATE();
        ALTER TABLE MIGRATION_DATA DROP COLUMN LAST_MIGRATION_NAME;
        ALTER TABLE MIGRATION_DATA DROP COLUMN LAST_RUN;
        `);

      if (lastMigrationName) {
        await backfillOldMigrationData(lastMigrationName, migrationsDirectoryPath);
      }

      console.log('Structure migration of table  "MIGRATION_DATA" has successfully completed!');
    }

  else if (columns.length === 0) {
      await sqlRequest().query(`
      CREATE TABLE MIGRATION_DATA (
        MIGRATION_NAME VARCHAR(255) NOT NULL PRIMARY KEY,
        RUN_DATE DATETIME NOT NULL DEFAULT GETDATE()
      )
    `);
  }
}

async function getExecutedMigrations() {
  const dbResult = await sqlRequest().query(`
    IF OBJECT_ID('MIGRATION_DATA') IS NOT NULL
    BEGIN
      SELECT MIGRATION_NAME FROM MIGRATION_DATA
    END
  `);

  return dbResult.recordset ? dbResult.recordset.map(row => row.MIGRATION_NAME) : [];
}

function getLocalMigrations(migrationsDirectoryPath) {
  return fs.readdirSync(migrationsDirectoryPath).filter(file => file.endsWith('.sql')).sort();
}

async function executeNewMigrations(migrationsToRun, migrationsDirectoryPath) {
  for (const migration of migrationsToRun) {
    console.log(`Running migration: ${migration}`);
    const script = fs.readFileSync(path.join(migrationsDirectoryPath, migration), 'utf-8');

    await sqlRequest().query(script);

    await sqlRequest()
      .input('migrationName', migration)
      .query(`INSERT INTO MIGRATION_DATA (MIGRATION_NAME) VALUES (@migrationName)`);

    console.log(`Migration ${migration} has been applied successfully.`);
  }
}


async function runMigrations() {
  const migrationsDirectoryPath = path.resolve(__dirname, '../database-scripts/migrations');

  const columns = await getMigrationTableColumns();
  await ensureMigrationTableStructure(columns, migrationsDirectoryPath);
  
  const executedMigrations = await getExecutedMigrations();
  const allMigrations = getLocalMigrations(migrationsDirectoryPath);

  const migrationsToRun = allMigrations.filter(migration => !executedMigrations.includes(migration)).sort();

  if (migrationsToRun.length === 0) {
    console.log('No new migrations to run. Database is up to date.');
    return;
  }

  await executeNewMigrations(migrationsToRun, migrationsDirectoryPath);
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