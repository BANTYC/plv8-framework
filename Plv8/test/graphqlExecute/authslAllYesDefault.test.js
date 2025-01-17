const sqlite = require('sqlite-sync');
const appRoot = require('app-root-path');
const testHelper = require(appRoot + '/helpers/testHelper.js');
const top = require(appRoot + "/helpers/top.js");
const auth = require(appRoot + "/api/accessLevels.js");

test('Single graphql query test', () =>
{
    const dbPath = appRoot + testHelper.getSqliteFileName(__filename);
    top.dbPath = dbPath;

    const setup = require(__dirname + '/authCommonSetup.js');
    const authLevels = { '$default': auth.accessLevels.ANY_READ };

    console.log(setup.setAuthSql(authLevels));

    sqlite.connect(dbPath);
    sqlite.run(setup.createSql());
    sqlite.run(setup.setAuthSql(authLevels));
    sqlite.close();

    const result = testHelper.runSqlite('graphqlExecute', __filename);
    console.log(result.data.company_type);

    sqlite.connect(dbPath);

    let items = sqlite.run(`SELECT * FROM account;`);
    expect(items.length).toBe(2);

    sqlite.run(setup.dropSql());
    sqlite.close();
});
