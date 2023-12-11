import { type CredentialRequest, CredentialStatusType, type core } from '@0xpolygonid/js-sdk'

const config = useRuntimeConfig()

export interface CredentialField {
  name: string
  description: string
  type: string
  mask?: string
  tooltip?: string
  parse: (v: any) => any
}

export interface Credential {
  name: string
  getCred: (...args: any[]) => CredentialRequest
  fields: CredentialField[]
}

export const credentials: Credential[] = [
  {
    name: 'KYCAgeCredential',
    fields: [{
      name: 'birthday',
      description: 'Birth Date',
      type: 'text',
      mask: '####-##-##',
      tooltip: 'Fill in your birth date in from YYYY-MM-DD',
      parse: (v: string) => Number.parseInt(v.replaceAll('-', '')),
    }],
    getCred: KYCAgeCredential,
  },
  {
    name: 'KYCCountryOfResidenceCredential',
    fields: [{
      name: 'countryCode',
      description: 'Country of Residence',
      type: 'text',
      mask: '####',
      parse: (v: string) => Number.parseInt(v),
    }],
    getCred: KYCCountryOfResidenceCredential,
  },
]

export function KYCAgeCredential(id: core.DID, birthday: number): CredentialRequest {
  return {
    credentialSchema:
  'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v2.json',
    type: 'KYCAgeCredential',
    credentialSubject: {
      id,
      birthday,
      documentType: 99,
    },
    expiration: 1893526400,
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      id: config.public.RHS_URL,
    },
  }
}

export function KYCCountryOfResidenceCredential(id: core.DID, countryCode: number): CredentialRequest {
  return {
    credentialSchema:
    'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCCountryOfResidenceCredential-v4.json',
    type: 'KYCCountryOfResidenceCredential',
    credentialSubject: {
      id,
      countryCode,
      documentType: 99,
    },
    expiration: 1893526400,
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      id: config.public.RHS_URL,
    },
  }
}
