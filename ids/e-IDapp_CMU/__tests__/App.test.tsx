/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('../src/store', () => ({ store: {} }));
jest.mock('../src/navigation/AppNavigator', () => () => null);
jest.mock('../src/features/agent', () => ({
  AgentProvider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('../src/db/DatabaseProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('../src/utils/permissions', () => ({
  requestCameraPermission: jest.fn(() => Promise.resolve(true)),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
