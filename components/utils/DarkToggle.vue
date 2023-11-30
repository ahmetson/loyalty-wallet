<script setup lang="ts">
const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : '#ffffff',
  }],
})

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <UiButton size="sm" class="p-3" variant="outline" @click="toggleDark">

    <div class="dark:text-theme-primary i-ic:baseline-brightness-3 dark:i-ic:outline-light-mode" />
  </UiButton>
</template>
