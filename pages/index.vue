<script setup lang="ts">
import { QRCode } from '@/components/utils'

const qrText = ref<string>('test')

</script>

<template>
  <div class="h-screen flex flex-col gap-6 items-center justify-center">
    <TextH2>
      Coupon system demo
    </TextH2>

    <div class="max-w-280px">
      <UiLabel for="qrcode">
        Text to QRCode
      </UiLabel>
      <UiInput v-model="qrText" id="qrcode" />
    </div>


    <QRCode :text="qrText" />
  </div>
</template>
