import { configureStore, createSlice } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import credoReducer from './slices/credoSlice';
import backupReducer from './slices/backupSlice';

const createBridgeSlice = <T extends object>(name: string, initialState: T) =>
  createSlice({
    name,
    initialState,
    reducers: {},
  });

const agentSlice = createBridgeSlice('agent', { agent: null as any });
const connectionsSlice = createBridgeSlice('connections', { connections: [] as any[] });
const credentialsSlice = createBridgeSlice('credentials', { credentials: [] as any[] });
const proofsSlice = createBridgeSlice('proofs', { proofs: [] as any[] });
const mediationSlice = createBridgeSlice('mediation', { mediation: [] as any[] });

export const store = configureStore({
  reducer: {
    user: userReducer,
    credo: credoReducer, // Custom slice for app-specific state
    backup: backupReducer, // Backup and restore state
    // Local compatibility slices for older selectors. Runtime data is managed
    // through the app-specific credo slice and direct Credo service calls.
    agent: agentSlice.reducer,
    connections: connectionsSlice.reducer,
    credentials: credentialsSlice.reducer,
    proofs: proofsSlice.reducer,
    mediation: mediationSlice.reducer,
  },
  // this is here to avoid encoding any big unserializable data in the state which will cause memory issues due to the size of the state
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'credo/fetchCredentials/fulfilled',
          'credo/fetchConnections/fulfilled',
          // Credo store actions that may contain non-serializable data
          'agent/setAgent',
          'connections/addConnection',
          'credentials/addCredential',
          'proofs/addProof',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'payload.0._tags',
          'payload.0.metadata',
          'payload.0.createdAt',
          'payload.0.updatedAt',
          'payload._tags',
          'payload.metadata',
          'payload.createdAt',
          'payload.updatedAt',
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'credo.credentials.0._tags',
          'credo.credentials.0.metadata',
          'agent.agent', // Agent instance is not serializable
          'connections.*._tags',
          'connections.*.metadata',
          'credentials.*._tags',
          'credentials.*.metadata',
          'proofs.*._tags',
          'proofs.*.metadata',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
