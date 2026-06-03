import { areObjectsEqual } from '@credo-ts/core/build/utils/objectEquality.mjs';
import { indyDidFromPublicKeyBase58 } from '@credo-ts/core/build/utils/did.mjs';
import timestamp from '@credo-ts/core/build/utils/timestamp.mjs';
import { getProtocolScheme } from '@credo-ts/core/build/utils/uri.mjs';
import { uuid } from '@credo-ts/core/build/utils/uuid.mjs';

export { AgentConfig } from '@credo-ts/core/build/agent/AgentConfig.mjs';
export { AgentContext } from '@credo-ts/core/build/agent/context/AgentContext.mjs';
export { BaseRecord } from '@credo-ts/core/build/storage/BaseRecord.mjs';
export { CacheModuleConfig } from '@credo-ts/core/build/modules/cache/CacheModuleConfig.mjs';
export { CredoError } from '@credo-ts/core/build/error/CredoError.mjs';
export { DateTransformer } from '@credo-ts/core/build/utils/transformers.mjs';
export { DidCommV1Service } from '@credo-ts/core/build/modules/dids/domain/service/DidCommV1Service.mjs';
export { LegacyDidCommV2Service as DidCommV2Service } from '@credo-ts/core/build/modules/dids/domain/service/LegacyDidCommV2Service.mjs';
export { DidDocument } from '@credo-ts/core/build/modules/dids/domain/DidDocument.mjs';
export { DidDocumentBuilder } from '@credo-ts/core/build/modules/dids/domain/DidDocumentBuilder.mjs';
export { DidDocumentRole } from '@credo-ts/core/build/modules/dids/domain/DidDocumentRole.mjs';
export { DidDocumentService } from '@credo-ts/core/build/modules/dids/domain/service/DidDocumentService.mjs';
export { DidKey } from '@credo-ts/core/build/modules/dids/methods/key/DidKey.mjs';
export { DidRecord } from '@credo-ts/core/build/modules/dids/repository/DidRecord.mjs';
export { DidRecordMetadataKeys } from '@credo-ts/core/build/modules/dids/repository/didRecordMetadataTypes.mjs';
export { DidRepository } from '@credo-ts/core/build/modules/dids/repository/DidRepository.mjs';
export { DidResolverService } from '@credo-ts/core/build/modules/dids/services/DidResolverService.mjs';
export { DidsApi } from '@credo-ts/core/build/modules/dids/DidsApi.mjs';
export { EventEmitter } from '@credo-ts/core/build/agent/EventEmitter.mjs';
export { Hasher } from '@credo-ts/core/build/crypto/hashes/Hasher.mjs';
export { IndyAgentService } from '@credo-ts/core/build/modules/dids/domain/service/IndyAgentService.mjs';
export { InjectionSymbols } from '@credo-ts/core/build/constants.mjs';
export { IsStringOrInstance, IsUri } from '@credo-ts/core/build/utils/validators.mjs';
export { JsonEncoder } from '@credo-ts/core/build/utils/JsonEncoder.mjs';
export { JsonTransformer } from '@credo-ts/core/build/utils/JsonTransformer.mjs';
export { JwsService } from '@credo-ts/core/build/crypto/JwsService.mjs';
export { JwtPayload } from '@credo-ts/core/build/crypto/jose/jwt/JwtPayload.mjs';
export { kms_exports as Kms } from '@credo-ts/core/build/modules/kms/index.mjs';
export { MessageValidator } from '@credo-ts/core/build/utils/MessageValidator.mjs';
export { Metadata } from '@credo-ts/core/build/storage/Metadata.mjs';
export { DidCommV2Service as NewDidCommV2Service, DidCommV2ServiceEndpoint as NewDidCommV2ServiceEndpoint } from '@credo-ts/core/build/modules/dids/domain/service/DidCommV2Service.mjs';
export { PeerDidNumAlgo, getAlternativeDidsForPeerDid, getNumAlgoFromPeerDid, isValidPeerDid } from '@credo-ts/core/build/modules/dids/methods/peer/didPeer.mjs';
export { RecordDuplicateError } from '@credo-ts/core/build/error/RecordDuplicateError.mjs';
export { RecordNotFoundError } from '@credo-ts/core/build/error/RecordNotFoundError.mjs';
export { Repository } from '@credo-ts/core/build/storage/Repository.mjs';
export { ServiceTransformer } from '@credo-ts/core/build/modules/dids/domain/service/ServiceTransformer.mjs';
export { StorageVersionRecord } from '@credo-ts/core/build/storage/migration/repository/StorageVersionRecord.mjs';
export { TypedArrayEncoder } from '@credo-ts/core/build/utils/TypedArrayEncoder.mjs';
export { convertPublicKeyToX25519 } from '@credo-ts/core/build/modules/dids/domain/key-type/ed25519.mjs';
export { createPeerDidDocumentFromServices } from '@credo-ts/core/build/modules/dids/methods/peer/createPeerDidDocumentFromServices.mjs';
export { deepEquality } from '@credo-ts/core/build/utils/deepEquality.mjs';
export { didDocumentJsonToNumAlgo1Did } from '@credo-ts/core/build/modules/dids/methods/peer/peerDidNumAlgo1.mjs';
export { didDocumentToNumAlgo2Did } from '@credo-ts/core/build/modules/dids/methods/peer/peerDidNumAlgo2.mjs';
export { didKeyToEd25519PublicJwk, didKeyToVerkey, isDidKey, verkeyToDidKey, verkeyToPublicJwk } from '@credo-ts/core/build/modules/dids/helpers.mjs';
export { filterContextCorrelationId } from '@credo-ts/core/build/agent/Events.mjs';
export { findMatchingEd25519Key } from '@credo-ts/core/build/modules/dids/findMatchingEd25519Key.mjs';
export { findVerificationMethodByKeyType } from '@credo-ts/core/build/modules/dids/domain/DidDocument.mjs';
export { getApiForModuleByName } from '@credo-ts/core/build/plugins/utils.mjs';
export { getDirFromFilePath } from '@credo-ts/core/build/utils/path.mjs';
export { getEd25519VerificationKey2018 } from '@credo-ts/core/build/modules/dids/domain/verificationMethod/Ed25519VerificationKey2018.mjs';
export { getPublicJwkFromVerificationMethod } from '@credo-ts/core/build/modules/dids/domain/key-type/keyDidMapping.mjs';
export { inject, injectable } from '@credo-ts/core/build/plugins/index.mjs';
export { isDid } from '@credo-ts/core/build/utils/did.mjs';
export { isJsonObject } from '@credo-ts/core/build/types.mjs';
export { parseDid, tryParseDid } from '@credo-ts/core/build/modules/dids/domain/parse.mjs';
export {
  ANONCREDS_DATA_INTEGRITY_CRYPTOSUITE,
  AnonCredsDataIntegrityServiceSymbol,
  ClaimFormat,
  DID_V1_CONTEXT_URL,
  DifPresentationExchangeService,
  DifPresentationExchangeSubmissionLocation,
  SignatureSuiteRegistry,
  W3cCredential,
  W3cCredentialRecord,
  W3cCredentialRepository,
  W3cCredentialService,
  W3cCredentialSubject,
  W3cJsonLdCredentialService,
  W3cJsonLdVerifiableCredential,
  W3cJsonLdVerifiablePresentation,
  W3cJwtVerifiablePresentation,
  X509ModuleConfig,
  extractX509CertificatesFromJwt,
} from './defaultModules.mjs';

export const utils = {
  areObjectsEqual,
  getProtocolScheme,
  indyDidFromPublicKeyBase58,
  timestamp,
  uuid,
};
