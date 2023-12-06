import type { HDNodeWallet } from 'ethers'
import type { Account } from '~/types/account'

export default defineNuxtRouteMiddleware((from, to) => {
  const accounts = useLocalStorage<Account[]>('accounts', [])

  // if (to.path === '/welcome' && wallet.value !== undefined && accounts.value.length > 0)
  //   return abortNavigation('account created')

  if (accounts.value.length === 0 && from.path !== '/welcome')
    return navigateTo('/welcome')
})
