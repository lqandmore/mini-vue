class Dep {
  constructor() {
    this.subscribes = new Set()
  }

  depend() {
    if (activeEffect) {
      this.subscribes.add(activeEffect)
    }
  }

  notify() {
    this.subscribes.forEach(effect=> {
      effect()
    })
  }
}

let activeEffect = null

function watchEffect(effect) {
  activeEffect = effect
  effect()
  activeEffect = null
}

const  targetMap = new WeakMap()
function getDep(target, key) {
  let depsMap = targetMap.get(target)
  if(!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep =depsMap.get(key)
  if(!dep) {
    dep = new Dep()
    depsMap.set(key, dep)
  }
  return dep
}

function reactive(raw) {
  return new Proxy(raw,{
    get(target, key) {
      const dep = getDep(target ,key)
      dep.depend()
      return target[key]
    },
    set(target, key, newValue) {
      const dep = getDep(target , key)
      target[key] = newValue
      dep.notify()
    }
  })

}