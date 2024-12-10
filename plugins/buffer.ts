import { Buffer } from 'buffer'
import process from 'node:process'

globalThis.Buffer = Buffer
globalThis.process = process

export default defineNuxtPlugin((_) => {
})
