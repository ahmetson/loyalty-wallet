<script setup lang="ts">
import type { W3CCredential } from '@0xpolygonid/js-sdk'
import CredentialClaimSheet from '~/components/core/CredentialClaimSheet.vue'
import { integerDate } from '~/lib/utils'

interface CredentialDataFieldDescription {
  field: string
  type: (v: any) => string
}

const { credentials, deleteCredential } = usePolygonID()

const TypeToField = new Map<string, CredentialDataFieldDescription>([
  ['KYCAgeCredential', {
    field: 'birthday',
    type: integerDate,
  }],
  ['KYCCountryOfResidenceCredential', {
    field: 'countryCode',
    type: v => v,
  }],
])
</script>

<template>
  <div class="h-full flex py-4 flex-col gap-6 px-6">
    <div class="flex items-center justify-between">
      <TextH2>Info</TextH2>
      <CredentialClaimSheet>
        <div class="i-carbon:add text-[32px]" />
      </CredentialClaimSheet>
    </div>
    <div class="space-y-3">
      <div v-for="cred in credentials" :key="cred.id" class="flex text-white items-center justify-between bg-gradient-to-br from-emerald-700 to-teal-800 p-2 rounded">
        <div>
          <TextH4 class="capitalize text-muted dark:text-white">
            {{ TypeToField.get(cred.credentialSubject.type as string)?.field }}
          </TextH4>
          <div>{{ TypeToField.get(cred.credentialSubject.type as string)?.type(cred.credentialSubject[TypeToField.get(cred.credentialSubject.type as string)?.field as string]) }}</div>
        </div>

        <UiButton variant="destructive" @click="deleteCredential(cred as W3CCredential)">
          Delete
        </UiButton>
      </div>
    </div>
  </div>
</template>
