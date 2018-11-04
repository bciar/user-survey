exports.DATABASE_URL = (process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       'mongodb://localhost:27017/test');
exports.TEST_DATABASE_URL = (process.env.TEST_DATABASE_URL ||
	'mongodb://localhost:27017/test-hirehumanly');

exports.PORT = process.env.PORT || 3799;
