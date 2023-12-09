const neo4jConfig = {
    'uri': 'neo4j+s://5a640153.databases.neo4j.io',
    'user': 'neo4j',
    "password": "WUg3N-BxHRi-ijGrGwowgnpdT0zLJqWwYvZcdulPSuc",
}
const neo4j = require('neo4j-driver');
const driver = neo4j.driver(neo4jConfig.uri, neo4j.auth.basic(neo4jConfig.user, neo4jConfig.password));

exports.getSession = function (context) {
    if (context.neo4jSession) {
      return context.neo4jSession;
    } else {
      context.neo4jSession = driver.session();
      return context.neo4jSession;
    }
};