<script setup lang="ts">
function launchBarcodeScanner() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.BarcodeDetector)
    alert('Your device does not support the Barcode Detection API. Try again on Chrome Desktop or Android')

  else
    startDetection()
}

async function startDetection() {
  // we start the device's camera
  const video: HTMLVideoElement = document.getElementById('barcode-detection-video') as HTMLVideoElement
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  video.srcObject = stream
  video.play()

  // for the purpose of this demo, we're only detecting QR codes, but there are plenty of other barcodes formats we could detect
  // see https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API#supported_barcode_formats
  const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] })

  video.addEventListener('loadedmetadata', async () => {
    console.log('event fired')
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')

    const checkForQrCode = async function () {
      // we draw the current view from the camera on a canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // then we pass that canvas to the barcode detector
      const barcodes = await barcodeDetector.detect(canvas)

      if (barcodes.length > 0) {
        const barcodeData = barcodes[0].rawValue
        alert(`Detected QR code with the following content: ${barcodeData}`)
      };

      requestAnimationFrame(checkForQrCode)
    }

    checkForQrCode()
  })
}
</script>

<template>
  <div class="h-screen flex flex-col gap-6 items-center justify-center">
    <TextH2>
      Scan
    </TextH2>

    <video id="barcode-detection-video" class="absolute z-[-10] top-0 left-0 h-screen w-screen" />

    <UiButton class="z-10" variant="ghost" @click="launchBarcodeScanner">
      Scan QR
    </UiButton>
  </div>
</template>
