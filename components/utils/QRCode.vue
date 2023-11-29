<script setup lang="ts">
import QRCode from 'qrcode'

enum CorrectLevel {
  L = 'L',
  M = 'M',
  Q = 'Q',
  H = 'H'
}

const props = defineProps<{
  text: string
  correctLevel?: CorrectLevel
}>()

const container = ref<HTMLDivElement>()

function generateQRCode(v: string) {
  QRCode.toCanvas(v.length > 0 ? v : '0', { errorCorrectionLevel: props.correctLevel ?? 'H' }, function (err: Error, canvas: HTMLCanvasElement) {
    if (err) throw err
    canvas.id = 'qrcode-canvas'
    container.value!.appendChild(canvas)
  })
}

watch(() => props.text, (v) => {
  const canvas = document.querySelector('#qrcode-canvas')
  canvas?.remove()
  generateQRCode(v)
})

onMounted(() => {
  generateQRCode(props.text)
})

</script>

<template>
  <div ref="container" />
</template>
