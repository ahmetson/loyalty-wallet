import { CircuitId, CircuitStorage, IndexedDBDataSource } from '@0xpolygonid/js-sdk'

export class CircuitStorageInstance {
  static instance: CircuitStorage
  static progress = ref(0)

  static async init() {
    if (!this.instance) {
      this.instance = new CircuitStorage(
        new IndexedDBDataSource('circuits'),
      )
      try {
        console.time('check loading circuits from DB')
        await this.instance.loadCircuitData(CircuitId.AuthV2)
        this.progress.value += 25
        await this.instance.loadCircuitData(CircuitId.AtomicQueryMTPV2)
        this.progress.value += 25
        await this.instance.loadCircuitData(CircuitId.AtomicQuerySigV2)
        this.progress.value += 25
        await this.instance.loadCircuitData(CircuitId.StateTransition)
        this.progress.value += 25
        console.timeEnd('check loading circuits from DB')
        return this.instance
      }
      catch (e) {
        console.time('CircuitStorageInstance.init')
        const auth_w = await fetch('./AuthV2/circuit.wasm')
          .then(response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))
        const mtp_w = await fetch('./credentialAtomicQueryMTPV2/circuit.wasm')
          .then(response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))
        const sig_w = await fetch('./credentialAtomicQuerySigV2/circuit.wasm')
          .then(response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))
        const ts_w = await fetch('./stateTransition/circuit.wasm')
          .then(response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))

        this.progress.value += 25

        const auth_z = await fetch('./AuthV2/circuit_final.zkey')
          .then(response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))
        const mtp_z = await fetch(
          './credentialAtomicQueryMTPV2/circuit_final.zkey',
        )
          .then(response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))
        const sig_z = await fetch(
          './credentialAtomicQuerySigV2/circuit_final.zkey',
        )
          .then(response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))
        const ts_z = await fetch(
          './stateTransition/circuit_final.zkey',
        )
          .then(response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))

        this.progress.value += 25

        const auth_j = await fetch('./AuthV2/verification_key.json')
          .then(response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))
        const mtp_j = await fetch(
          './credentialAtomicQueryMTPV2/verification_key.json',
        )
          .then(response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))
        const sig_j = await fetch(
          './credentialAtomicQuerySigV2/verification_key.json',
        )
          .then(response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))
        const ts_j = await fetch(
          './stateTransition/verification_key.json',
        )
          .then(response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))

        this.progress.value += 25
        console.timeEnd('CircuitStorageInstance.init')
        // this.instanceCS = new CircuitStorage(new InMemoryDataSource());
        console.time('CircuitStorageInstance.saveCircuitData')
        await this.instance.saveCircuitData(CircuitId.AuthV2, {
          circuitId: CircuitId.AuthV2,
          wasm: auth_w,
          provingKey: auth_z,
          verificationKey: auth_j,
        })
        await this.instance.saveCircuitData(CircuitId.AtomicQueryMTPV2, {
          circuitId: CircuitId.AtomicQueryMTPV2,
          wasm: mtp_w,
          provingKey: mtp_z,
          verificationKey: mtp_j,
        })
        await this.instance.saveCircuitData(CircuitId.AtomicQuerySigV2, {
          circuitId: CircuitId.AtomicQuerySigV2,
          wasm: sig_w,
          provingKey: sig_z,
          verificationKey: sig_j,
        })
        await this.instance.saveCircuitData(CircuitId.StateTransition, {
          circuitId: CircuitId.AtomicQuerySigV2,
          wasm: ts_w,
          provingKey: ts_z,
          verificationKey: ts_j,
        })
        this.progress.value += 25
        console.timeEnd('CircuitStorageInstance.saveCircuitData')
      }
    }
  }

  static getCircuitStorageInstance() {
    return this.instance
  }
}
