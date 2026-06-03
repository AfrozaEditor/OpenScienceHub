 
export interface OfferAttribute {
  name: string;
  value: string;
}

export interface CreateOfferPayload {
  credentialDefinitionId: string;
  connectionId: string;
  attributes: OfferAttribute[];
  comment?: string;
}

/* ---------------- RESPONSE ---------------- */

export interface OfferResponse {
  message(message: any): unknown;
  success: boolean;
  statusCode: number;
  data: {
    invitationUrl: string;
    invitationQr: string;
    shortUrl?: string;
    outOfBandId: string;
    credentialExchangeId: string;
    state: string;
    credentialAttributes: {
      name: string;
      value: string;
    }[];
  };
}
