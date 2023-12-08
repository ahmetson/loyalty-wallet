<script setup lang="ts">
import { ExchangeState } from './core'
import type { Exchange } from '~/types/exchange'

const router = useRouter()

const exchanges = useLocalStorage<Exchange[]>('exchanges', [])
</script>

<template>
  <footer class="fixed flex items-center h-[60px] bottom-0 left-0 w-full bg-background/50 dark:bg-background/80 backdrop-blur">
    <nav class="w-full flex justify-around">
      <NuxtLink to="/exchange">
        <UiButton variant="link">
          <div class="relative flex flex-col items-center gap-1" :class="{ '!text-accent': router.currentRoute.value.path === '/exchange' }">
            <div class="i-carbon:status-change text-xl" />
            <div v-if="exchanges.filter(v => [ExchangeState.Idle].includes(v.state)).length > 0" class="absolute w-[12px] h-[12px] rounded-full bg-accent animate-ping top-0 right-[30%]" />
            <TextSmall>
              Loyalty
            </TextSmall>
          </div>
        </UiButton>
      </NuxtLink>
      <NuxtLink to="/my-info">
        <UiButton variant="link">
          <div class="flex flex-col items-center gap-1" :class="{ '!text-accent': router.currentRoute.value.path === '/my-info' }">
            <div class="i-carbon:user text-xl" />
            <TextSmall>
              My Info
            </TextSmall>
          </div>
        </UiButton>
      </NuxtLink>
      <NuxtLink to="/">
        <UiButton variant="link">
          <div class="flex flex-col items-center gap-1" :class="{ '!text-accent': router.currentRoute.value.path === '/' }">
            <div class="i-carbon:user text-xl" />
            <TextSmall>
              Account
            </TextSmall>
          </div>
        </UiButton>
      </NuxtLink>
    </nav>
  </footer>
</template>
