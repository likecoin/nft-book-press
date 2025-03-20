import { defineStore } from 'pinia'

import { getSigningClient } from '~/utils/cosmos'

function addIDToRecords (records: any[]) {
  return records.map(r => ({ id: r.data['@id'] as string, ...r }))
}

export const useIscnStore = defineStore('iscn', {
  state: () => ({
    recordsById: {} as any,
    records: [],
    isLoading: false,
    errorMessage: ''
  }),

  getters: {
    getISCNById: (state) => {
      return (iscnId: string) => state.recordsById[iscnId]
    },
    getIsLoading: state => state.isLoading,
    getErrorMessage: state => state.errorMessage
  },

  actions: {
    appendRecords (records: any[]) {
      records.forEach((r) => {
        const id = r.data['@id'] as string
        this.recordsById[id] = { id, ...r }
        this.records.push({ id, ...r })
      })
    },

    clearRecords () {
      this.recordsById = {}
      this.records = []
    },

    async fetchISCNByTx (iscnId: string) {
      this.clearRecords()
      const signingClient = await getSigningClient()
      const client = signingClient.getISCNQueryClient()
      const txRes = await client.queryISCNIdsByTx(iscnId).catch(() => null)
      let txRecords: any[] = []
      if (txRes) {
        txRecords = (await Promise.all(txRes.map(async (t) => {
          if (typeof t === 'string') {
            const res = await client.queryRecordsById(t)
            return res?.records[0]
          }
          return t
        }))).filter(t => t) as any[]
      }
      this.appendRecords(txRecords)
      return { records: addIDToRecords(txRecords) }
    },

    async fetchISCNById (iscnId: string) {
      this.clearRecords()
      const signingClient = await getSigningClient()
      const client = signingClient.getISCNQueryClient()
      const res = await client.queryRecordsById(iscnId).catch(() => null)
      if (!res) { return null }
      const records = res ? res.records : []
      this.appendRecords(records)
      return {
        ...res,
        records: addIDToRecords(records)
      }
    },

    async queryISCNByAddress (address: string) {
      this.clearRecords()
      let records: any[] = []
      try {
        this.isLoading = true
        const signingClient = await getSigningClient()
        const client = signingClient.getISCNQueryClient()
        let res
        let nextSequence
        do {
          res = await client.queryRecordsByOwner(address, nextSequence)
          if (res) {
            nextSequence = res.nextSequence.toNumber()
            this.appendRecords(res.records)
            records = records.concat(res.records)
          }
        } while (nextSequence !== 0)
      } catch (error) {
        console.error(error)
        this.errorMessage = (error as Error).message
      } finally {
        this.isLoading = false
      }
      return addIDToRecords(records)
    }
  }
})
