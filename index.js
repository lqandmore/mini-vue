function createApp(rootComponent) {
  return {
    mount(selecotor) {
      const container = document.querySelector(selecotor)
      let isMounted = false
      let oldVnode = null
      watchEffect(function() {
        if (!isMounted) {
          oldVnode = rootComponent.render()
          mount(oldVnode,container)
          isMounted = true
        } else {
          const newVNode = rootComponent.render()
          patch(newVNode, oldVnode)
          oldVnode = newVNode
        }
      })
    }
  }
}