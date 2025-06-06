import { VueConstructor } from 'vue'
import { VxeUI } from '../ui'
import './render'
import VxeTableComponent from './src/table'

let isReg = false

export const VxeTable = Object.assign({}, VxeTableComponent, {
  install (app: VueConstructor) {
    if (!isReg) {
      isReg = true
      if (VxeUI.dynamicApp) {
        VxeUI.dynamicApp.component(VxeTableComponent.name as string, VxeTableComponent)
      }
    }
    app.component(VxeTableComponent.name as string + '3', VxeTableComponent)
  }
})

VxeUI.component(VxeTableComponent)

export const Table = VxeTable
export default VxeTable
