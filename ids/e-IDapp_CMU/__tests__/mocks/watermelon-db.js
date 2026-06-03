/**
 * Mock for WatermelonDB
 * 
 * Provides mock implementation of WatermelonDB for testing
 */

const mockDatabase = {
    collections: {
        get: jest.fn(() => mockCollection),
    },
    write: jest.fn((callback) => Promise.resolve(callback())),
    read: jest.fn((callback) => Promise.resolve(callback())),
    unsafeResetDatabase: jest.fn(() => Promise.resolve()),
};

const mockModel = {
    observe: jest.fn(() => ({ subscribe: jest.fn() })),
    destroyPermanently: jest.fn(() => Promise.resolve()),
};

const mockQuery = {
    fetch: jest.fn(() => Promise.resolve([])),
    observe: jest.fn(() => ({ subscribe: jest.fn() })),
};

const mockCollection = {
    create: jest.fn(() => Promise.resolve(mockModel)),
    find: jest.fn(() => Promise.resolve(mockModel)),
    query: jest.fn(() => mockQuery),
};

class Model { }
const Database = jest.fn(() => mockDatabase);
const Q = {
    where: jest.fn(),
    and: jest.fn(),
    or: jest.fn(),
    on: jest.fn(),
    sortBy: jest.fn(),
};

const SQLiteAdapter = jest.fn();
const setGenerator = jest.fn();
const appSchema = jest.fn((schema) => schema);
const tableSchema = jest.fn((schema) => schema);

module.exports = {
    Database,
    Model,
    Q,
    SQLiteAdapter,
    setGenerator,
    appSchema,
    tableSchema,
    mockDatabase,
    mockModel,
    mockCollection,
};
