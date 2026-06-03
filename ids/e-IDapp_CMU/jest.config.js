module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/setup.js',
    '<rootDir>/__tests__/setup/jest.setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@credo-ts|@hyperledger|@reduxjs|react-redux|immer|uuid|react-native-.*|base64url)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@credo-ts/core/build/(.*)$': '<rootDir>/node_modules/@credo-ts/core/build/$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__tests__/mocks/fileMock.js',
    '@credo-ts/react-hooks': '<rootDir>/__tests__/mocks/credo-react-hooks.js',
    'react-native-encrypted-storage': '<rootDir>/__tests__/mocks/encrypted-storage.js',
    '@nozbe/watermelondb/Database': '<rootDir>/__tests__/mocks/watermelon-db.js',
    '@nozbe/watermelondb/DatabaseProvider':
      '<rootDir>/__tests__/mocks/watermelon-provider.js',
    '@nozbe/watermelondb/Schema/migrations':
      '<rootDir>/__tests__/mocks/watermelon-migrations.js',
    '@nozbe/watermelondb/Schema': '<rootDir>/__tests__/mocks/watermelon-schema.js',
    '@nozbe/watermelondb/adapters/sqlite':
      '<rootDir>/__tests__/mocks/watermelon-sqlite-adapter.js',
    '@nozbe/watermelondb/decorators':
      '<rootDir>/__tests__/mocks/watermelon-decorators.js',
    '@nozbe/watermelondb/hooks': '<rootDir>/__tests__/mocks/watermelon-hooks.js',
    '@nozbe/watermelondb': '<rootDir>/__tests__/mocks/watermelon-db.js',
    '../../utils/database': '<rootDir>/__tests__/mocks/database.js',
  },
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  collectCoverageFrom: ['src/screens/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  testTimeout: 10000,
  clearMocks: true,
  verbose: true,
};
