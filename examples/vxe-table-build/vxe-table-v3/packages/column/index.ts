import { VueConstructor } from 'vue'
import { VxeUI } from '../ui'
import VxeColumnComponent from '../table/src/column'

export const VxeColumn = Object.assign({}, VxeColumnComponent, {
  install (app: VueConstructor) {
    app.component(VxeColumnComponent.name as string + '3', VxeColumnComponent)
  }
})

if (VxeUI.dynamicApp) {
  VxeUI.dynamicApp.component(VxeColumnComponent.name as string, VxeColumnComponent)
}

VxeUI.component(VxeColumnComponent)

export const Column = VxeColumn
export default VxeColumn
