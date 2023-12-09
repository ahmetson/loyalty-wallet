import { CircuitId, type ZeroKnowledgeProofRequest } from '@0xpolygonid/js-sdk'

export const proofRequests = new Map<number, ZeroKnowledgeProofRequest>([
  [1, {
    id: 1,
    circuitId: CircuitId.AtomicQuerySigV2,
    optional: false,
    query: {
      allowedIssuers: ['*'],
      type: 'KYCAgeCredential',
      context:
      'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
      credentialSubject: {
        birthday: {
          $lt: 20050101,
        },
      },
    },
  }],
  [2, {
    id: 2,
    circuitId: CircuitId.AtomicQuerySigV2,
    optional: false,
    query: {
      allowedIssuers: ['*'],
      type: 'KYCCountryOfResidenceCredential',
      context:
      'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
      credentialSubject: {
        countryCode: {
          $in: [
            84,
            92,
            93,
            7,
          ],
        },
      },
    },
  }],
])
