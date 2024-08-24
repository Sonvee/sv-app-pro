import permission from './modules/permission'
import role from './modules/role'
import waterMarker from './modules/waterMarker'
import draggable from './modules/draggable'
import debounce from './modules/debounce'
import throttle from './modules/throttle'
import longpress from './modules/longpress'

const directivesList = {
  permission,
  role,
  waterMarker,
  draggable,
  debounce,
  throttle,
  longpress
}

const directives = {
  install: function (app) {
    Object.keys(directivesList).forEach((key) => {
      app.directive(key, directivesList[key])
    })
  }
}

export default directives
