<script setup lang="ts">
import { DarkToggle } from '~/components/utils'
</script>

<template>
  <header>
    <div class="max-w-[1400px] w-full mx-auto py-4 px-2 flex justify-between">
      <nav class="flex space-x-4">
        <NuxtLink to="/">
          <UiButton variant="link">
            QR Code
          </UiButton>
        </NuxtLink>
        <NuxtLink to="/scan">
          <UiButton variant="link">
            Scan
          </UiButton>
        </NuxtLink>
      </nav>
      <DarkToggle />
    </div>
  </header>
  <div class="max-w-[1400px] w-full mx-auto">
    <slot />
  </div>
</template>
