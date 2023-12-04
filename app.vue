<script setup lang="ts">
import { PolygonIdService } from './lib/polygon-id.service'

onMounted(async () => {
  if (!PolygonIdService.instancePS)
    PolygonIdService.init()
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
