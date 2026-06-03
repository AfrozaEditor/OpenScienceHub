export type ProofRequestAttribute = {
  name: string;
};

export type ProofRequestSelectiveInput = {
  credDefId: string;
  attributes: ProofRequestAttribute[];
  comment?: string;
};
export interface ProofRequestResponse {
  invitationUrl: string;
  shortUrl?: string;
  verificationQr: string;
  outOfBandId: string;
  proofRecordId: string;
  state: string;
}
