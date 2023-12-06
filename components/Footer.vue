<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <footer class="flex items-center h-[60px] bottom-0 left-0 w-full bg-background/50 border-t border-border">
    <nav class="w-full flex justify-around">
      <NuxtLink to="/">
        <UiButton variant="link">
          <div class="flex flex-col items-center gap-1" :class="{ '!text-accent': router.currentRoute.value.path === '/' }">
            <div class="i-carbon:user text-xl" />
            <TextSmall>
              Accounts
            </TextSmall>
          </div>
        </UiButton>
      </NuxtLink>
      <NuxtLink to="/exchange">
        <UiButton variant="link">
          <div class="flex flex-col items-center gap-1" :class="{ '!text-accent': router.currentRoute.value.path === '/exchange' }">
            <div class="i-carbon:status-change text-xl" />
            <TextSmall>
              Exchanges
            </TextSmall>
          </div>
        </UiButton>
      </NuxtLink>
    </nav>
  </footer>
</template>
