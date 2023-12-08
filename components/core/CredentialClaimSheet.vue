<script setup lang="ts">
import { core, fieldToByteArray } from '@0xpolygonid/js-sdk'
import CredentialCombobox from './CredentialCombobox.vue'
import type { Credential } from '~/lib/credential-requests'

const { issueCredentials, currentAccount } = usePolygonID()

const open = ref(false)
const credential = ref<Credential>({} as Credential)
const values = ref<{ [key: string]: any }>({
  id: new core.DID(currentAccount.did).string(),
})
const loading = ref(false)

async function claimCredential(ev: Event) {
  loading.value = true
  const data = unref(values)
  for (const field of credential.value.fields)
    data[field.name] = field.parse(data[field.name])

  const cred = credential.value.getCred(...Object.values(data))

  await issueCredentials(currentAccount, cred)
  loading.value = false
  open.value = false
}
</script>

<template>
  <UiSheet :open="open" @update:open="(v) => { open = v }">
    <UiSheetTrigger>
      <slot />
    </UiSheetTrigger>
    <UiSheetContent class="rounded-t-3xl" side="bottom">
      <UiSheetHeader>
        <UiSheetTitle class="flex flex-col items-center">
          Claim credentials
        </UiSheetTitle>

        <UiSheetDescription>
          There you can claim your credentials.
        </UiSheetDescription>
      </UiSheetHeader>

      <form class="my-6 space-y-3 flex flex-col" @submit.prevent="claimCredential">
        <div>
          <UiLabel for="credentials">
            Credential type
          </UiLabel>
          <CredentialCombobox id="credentials" v-model="credential" />
        </div>
        <div v-for="credField in credential?.fields" :key="credField.name">
          <UiTooltipProvider>
            <UiTooltip>
              <UiTooltipTrigger as-child>
                <UiLabel class="flex items-center gap-1">
                  {{ credField.description }} <div v-if="credField.tooltip" class="i-carbon:information" />
                </UiLabel>
              </UiTooltipTrigger>
              <UiTooltipContent>
                <p>{{ credField.tooltip }}</p>
              </UiTooltipContent>
            </UiTooltip>
          </UiTooltipProvider>

          <UiInput v-model="values[credField.name]" v-maska :placeholder="credField.mask" :data-maska="credField.mask" :type="credField.type" />
        </div>
        <UiSheetFooter>
          <UiButton type="submit">
            <span v-if="loading" class="i-mingcute:loading-3-fill mr-2 h-4 w-4 animate-spin" />
            Claim
          </UiButton>
        </UiSheetFooter>
      </form>
    </UiSheetContent>
  </UiSheet>
</template>
