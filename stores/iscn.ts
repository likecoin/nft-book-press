import { defineStore } from 'pinia'

import { getSigningClient } from '~/utils/cosmos'

function addIDToRecords (records: any[]) {
  return records.map(r => ({ id: r.data['@id'] as string, ...r }))
}

export const useIscnStore = defineStore('iscn', {
  state: () => ({
    recordsById: {} as any,
    records: [],
    isLoading: false
  }),

  getters: {
    getISCNById: (state) => {
      return (iscnId: string) => state.recordsById[iscnId]
    },
    getAllRecords: (state) => {
      return Object.values(state.recordsById)
    },
    getIsLoading: state => state.isLoading
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
    }
  }
})
