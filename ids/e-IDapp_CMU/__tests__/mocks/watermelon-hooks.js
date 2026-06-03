const { mockDatabase } = require('./watermelon-db.js');

module.exports = {
    useDatabase: jest.fn(() => mockDatabase),
};
