<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { ref } from 'vue'
import { type Credential, credentials } from '~/lib/credential-requests'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'

const props = defineProps<{
  id: string
  modelValue: Credential
}>()

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const value = computed<Credential>({
  get() {
    return props.modelValue
  },
  set(v: Credential) {
    emit('update:modelValue', v)
  },
})
const selected = ref('')

const filterFunction = (list: string[], search: string) => list.filter(i => i.toLowerCase().includes(search.toLowerCase()))
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        :id="props.id"
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="justify-between w-full sm:w-250px"
      >
        <div class="truncate">
          {{ value.name ? value.name : 'Select credential type...' }}
        </div>
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0">
      <Command :filter-function="filterFunction">
        <CommandInput placeholder="Search credential type..." />
        <CommandEmpty>No credential type found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="cred, i in credentials"
              :key="i"
              :value="cred"
              @select="(ev) => {
                selected = ev.detail.value as string
                value = cred
                open = false
              }"
            >
              <Check
                :class="cn(
                  'mr-2 h-4 w-4',
                  value === cred ? 'opacity-100' : 'opacity-0',
                )"
              />
              <div class="truncate">
                {{ cred.name }}
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
