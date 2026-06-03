const optionalValue = 'unsupported-optional-credo-module';

function unsupportedOptionalModule(name) {
  throw new Error(`${name} is not bundled in this mobile build. Enable the optional Credo W3C/SD-JWT/mDoc module before using it.`);
}

class OptionalCredoApi {
  constructor(options = {}) {
    Object.assign(this, options);
  }
}

class OptionalCredoRecord extends OptionalCredoApi {
  static fromCredential() {
    unsupportedOptionalModule(this.name);
  }
}

class OptionalCredoModule {
  constructor(api) {
    this.api = api;
  }

  register(dependencyManager) {
    if (this.api && !dependencyManager.isRegistered(this.api)) {
      dependencyManager.registerContextScoped(this.api);
    }
  }
}

export class W3cCredentialsApi extends OptionalCredoApi {}
export class W3cV2CredentialsApi extends OptionalCredoApi {}
export class MdocApi extends OptionalCredoApi {}
export class SdJwtVcApi extends OptionalCredoApi {}
export class X509Api extends OptionalCredoApi {}
export class DcqlService extends OptionalCredoApi {}
export class DifPresentationExchangeService extends OptionalCredoApi {}
export class MdocService extends OptionalCredoApi {}
export class SdJwtVcService extends OptionalCredoApi {}
export class W3cCredentialService extends OptionalCredoApi {}
export class W3cV2CredentialService extends OptionalCredoApi {}
export class W3cJsonLdCredentialService extends OptionalCredoApi {}
export class W3cJwtCredentialService extends OptionalCredoApi {}
export class W3cV2JwtCredentialService extends OptionalCredoApi {}
export class W3cV2SdJwtCredentialService extends OptionalCredoApi {}
export class X509Service extends OptionalCredoApi {}

export class W3cCredentialsModule extends OptionalCredoModule {
  constructor() {
    super(W3cCredentialsApi);
  }

  register(dependencyManager) {
    super.register(dependencyManager);

    if (!dependencyManager.isRegistered(W3cV2CredentialsApi)) {
      dependencyManager.registerContextScoped(W3cV2CredentialsApi);
    }
  }
}

export class MdocModule extends OptionalCredoModule {
  constructor() {
    super(MdocApi);
  }
}

export class SdJwtVcModule extends OptionalCredoModule {
  constructor() {
    super(SdJwtVcApi);
  }
}

export class X509Module extends OptionalCredoModule {
  constructor() {
    super(X509Api);
  }
}

export class DcqlModule extends OptionalCredoModule {
  constructor() {
    super(undefined);
  }
}

export class DifPresentationExchangeModule extends OptionalCredoModule {
  constructor() {
    super(undefined);
  }
}

export class CertificateSigningRequest extends OptionalCredoApi {}
export class CredentialIssuancePurpose extends OptionalCredoApi {}
export class DataIntegrityProof extends OptionalCredoApi {}
export class DateOnly extends OptionalCredoApi {}
export class DcqlError extends Error {}
export class DifPresentationExchangeError extends Error {}
export class Ed25519Signature2018 extends OptionalCredoApi {}
export class Ed25519Signature2020 extends OptionalCredoApi {}
export class JwsLinkedDataSignature extends OptionalCredoApi {}
export class LdKeyPair extends OptionalCredoApi {}
export class Mdoc extends OptionalCredoApi {}
export class MdocDeviceResponse extends OptionalCredoApi {}
export class MdocError extends Error {}
export class MdocRecord extends OptionalCredoRecord {}
export class MdocRepository extends OptionalCredoApi {}
export class SdJwtVcError extends Error {}
export class SdJwtVcRecord extends OptionalCredoRecord {}
export class SdJwtVcRepository extends OptionalCredoApi {}
export class SignatureSuiteRegistry extends OptionalCredoApi {}
export class W3cCredential extends OptionalCredoApi {}
export class W3cCredentialRecord extends OptionalCredoRecord {}
export class W3cCredentialRepository extends OptionalCredoApi {}
export class W3cCredentialSchema extends OptionalCredoApi {}
export class W3cCredentialStatus extends OptionalCredoApi {}
export class W3cCredentialSubject extends OptionalCredoApi {}
export class W3cCredentialSubjectTransformer extends OptionalCredoApi {}
export class W3cCredentialsModuleConfig extends OptionalCredoApi {}
export class W3cIssuer extends OptionalCredoApi {}
export class W3cIssuerTransformer extends OptionalCredoApi {}
export class W3cJsonLdVerifiableCredential extends OptionalCredoApi {}
export class W3cJsonLdVerifiablePresentation extends OptionalCredoApi {}
export class W3cJwtVerifiableCredential extends OptionalCredoApi {}
export class W3cJwtVerifiablePresentation extends OptionalCredoApi {}
export class W3cPresentation extends OptionalCredoApi {}
export class W3cV2Credential extends OptionalCredoApi {}
export class W3cV2CredentialRecord extends OptionalCredoRecord {}
export class W3cV2CredentialRepository extends OptionalCredoApi {}
export class W3cV2CredentialSchema extends OptionalCredoApi {}
export class W3cV2CredentialStatus extends OptionalCredoApi {}
export class W3cV2CredentialSubject extends OptionalCredoApi {}
export class W3cV2CredentialsModule extends OptionalCredoModule {
  constructor() {
    super(W3cV2CredentialsApi);
  }
}
export class W3cV2EnvelopedVerifiableCredential extends OptionalCredoApi {}
export class W3cV2EnvelopedVerifiableCredentialTransformer extends OptionalCredoApi {}
export class W3cV2EnvelopedVerifiablePresentation extends OptionalCredoApi {}
export class W3cV2Evidence extends OptionalCredoApi {}
export class W3cV2Issuer extends OptionalCredoApi {}
export class W3cV2IssuerTransformer extends OptionalCredoApi {}
export class W3cV2JwtVerifiableCredential extends OptionalCredoApi {}
export class W3cV2JwtVerifiablePresentation extends OptionalCredoApi {}
export class W3cV2LocalizedValue extends OptionalCredoApi {}
export class W3cV2LocalizedValueTransformer extends OptionalCredoApi {}
export class W3cV2Presentation extends OptionalCredoApi {}
export class W3cV2RefreshService extends OptionalCredoApi {}
export class W3cV2SdJwtVerifiableCredential extends OptionalCredoApi {}
export class W3cV2SdJwtVerifiablePresentation extends OptionalCredoApi {}
export class W3cV2TermsOfUse extends OptionalCredoApi {}
export class W3cV2VerifiableCredentialTransformer extends OptionalCredoApi {}
export class W3cVerifiableCredentialTransformer extends OptionalCredoApi {}
export class X509Certificate extends OptionalCredoApi {}
export class X509Error extends Error {}
export class X509ModuleConfig extends OptionalCredoApi {}

export const ANONCREDS_DATA_INTEGRITY_CRYPTOSUITE = optionalValue;
export const AnonCredsDataIntegrityServiceSymbol = Symbol.for('AnonCredsDataIntegrityService');
export const CREDENTIALS_CONTEXT_V1_URL = optionalValue;
export const CREDENTIALS_CONTEXT_V2_URL = optionalValue;
export const CREDENTIALS_ISSUER_URL = optionalValue;
export const DID_V1_CONTEXT_URL = optionalValue;
export const ENVELOPED_VERIFIABLE_CREDENTIAL_TYPE = optionalValue;
export const ENVELOPED_VERIFIABLE_PRESENTATION_TYPE = optionalValue;
export const EXPANDED_TYPE_CREDENTIALS_CONTEXT_V1_VC_TYPE = optionalValue;
export const SECURITY_CONTEXT_SECP256k1_URL = optionalValue;
export const SECURITY_CONTEXT_URL = optionalValue;
export const SECURITY_CONTEXT_V1_URL = optionalValue;
export const SECURITY_CONTEXT_V2_URL = optionalValue;
export const SECURITY_CONTEXT_V3_URL = optionalValue;
export const SECURITY_JWS_CONTEXT_URL = optionalValue;
export const SECURITY_PROOF_URL = optionalValue;
export const SECURITY_SIGNATURE_URL = optionalValue;
export const SECURITY_X25519_CONTEXT_URL = optionalValue;
export const SignatureSuiteToken = Symbol.for('SignatureSuiteToken');
export const VERIFIABLE_CREDENTIAL_TYPE = optionalValue;
export const VERIFIABLE_PRESENTATION_TYPE = optionalValue;
export const X509ExtendedKeyUsage = {};
export const X509KeyUsage = {};
export const ClaimFormat = {
  JwtVc: 'jwt_vc',
  LdpVc: 'ldp_vc',
  DiVc: 'di_vc',
  JwtW3cVc: 'vc+jwt',
  SdJwtW3cVc: 'vc+sd-jwt',
};
export const PresentationSubmissionLocation = {};
export const DifPresentationExchangeSubmissionLocation = PresentationSubmissionLocation;

export function IsEnvelopedVerifiableCredentialType() {}
export function IsEnvelopedVerifiablePresentationType() {}
export function IsW3cCredentialSubject() {}
export function IsW3cIssuer() {}
export function IsW3cV2Issuer() {}
export function convertName() {}
export function createAuthorityKeyIdentifierExtension() {}
export function createBasicConstraintsExtension() {}
export function createCrlDistributionPointsExtension() {}
export function createExtendedKeyUsagesExtension() {}
export function createIssuerAlternativeNameExtension() {}
export function createKeyUsagesExtension() {}
export function createSubjectAlternativeNameExtension() {}
export function createSubjectKeyIdentifierExtension() {}
export function dcqlGetPresentationsToCreate() {
  unsupportedOptionalModule('dcqlGetPresentationsToCreate');
}
export function decodeSdJwt() {
  unsupportedOptionalModule('decodeSdJwt');
}
export function deriveProof() {
  unsupportedOptionalModule('deriveProof');
}
export function extractPresentationsWithDescriptorsFromSubmission() {
  unsupportedOptionalModule('extractPresentationsWithDescriptorsFromSubmission');
}
export function extractX509CertificatesFromJwt() {
  return [];
}
export function isMdocSupportedSignatureAlgorithm() {
  return false;
}
export function sdJwtVcHasher() {
  unsupportedOptionalModule('sdJwtVcHasher');
}
export function vcLibraries() {
  unsupportedOptionalModule('vcLibraries');
}
export function w3cDate() {
  return new Date().toISOString();
}
export function x509SignatureAlgorithmToJwa() {
  unsupportedOptionalModule('x509SignatureAlgorithmToJwa');
}
