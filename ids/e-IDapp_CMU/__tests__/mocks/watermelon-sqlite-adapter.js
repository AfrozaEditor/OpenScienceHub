const SQLiteAdapter = jest.fn().mockImplementation((config) => ({
    ...config,
    schema: config?.schema,
    migrations: config?.migrations,
}));

module.exports = SQLiteAdapter;
module.exports.default = SQLiteAdapter;
