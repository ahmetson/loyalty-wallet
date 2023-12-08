import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { camelize, getCurrentInstance, toHandlerKey } from 'vue'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function integerDate(date: number): string {
  const number = String(date)
  return `${number.substring(0, 4)}.${number.substring(4, 6)}.${number.substring(6, 8)}`
}
