<script setup lang="ts">
import type { W3CCredential } from '@0xpolygonid/js-sdk'
import { core } from '@0xpolygonid/js-sdk'

const { accounts, issuers, credentials, generateProof, issueCredentials, deleteCredential } = usePolygonID()
</script>

<template>
  <div class="h-full flex py-4 flex-col gap-6 px-6">
    <div class="flex items-center justify-between">
      <TextH2>Accounts</TextH2>
    </div>

    <div class="w-full flex flex-col gap-4">
      <div v-for="account in accounts" :key="account.did.id" class="flex flex-col bg-indigo px-4 py-4 rounded-xl gap-4">
        <div class="flex gap-2 justify-between">
          <TextP class="truncate max-w-full bg-muted/50 px-2 rounded-md">
            {{ account.did.id }}
          </TextP>
          <UiButton class="border-border/20" variant="default" size="sm" @click="issueCredentials(account)">
            Issue credential
          </UiButton>
        </div>
        <div v-if="credentials" class="space-y-2">
          <div v-for="cred in credentials" :key="cred.id" class="flex flex-col gap-2 justify-between bg-muted/50 p-2 rounded-md">
            <div class="flex items-center justify-between">
              <p class="truncate m-0">
                {{ cred.credentialSubject.type }}
              </p>
              <p class="truncate max-w-100px m-0">
                {{ cred.issuanceDate }}
              </p>
            </div>

            <div class="flex gap-2 items-end justify-end">
              <UiButton
                size="sm"
                @click="generateProof(cred as W3CCredential, new core.DID(issuers.find(v => {
                  console.log(v, cred.issuer.slice(14), v.did.id === cred.issuer.slice(14))
                  return v.did.id === cred.issuer.slice(14)
                })?.did))"
              >
                Generate Proof
              </UiButton>
              <UiButton
                variant="destructive"
                size="sm"
                @click="deleteCredential(cred as W3CCredential)"
              >
                Delete
              </UiButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
