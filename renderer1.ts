export interface vNode {
  tag: string,
  props: any ,
  children: any,
  el: Element | null
}

type hFn = (tag: string, props: any ,children: any) => vNode

type mountFn = (n: vNode, container: Element)=> void

type patchFn = (n1: vNode, n2: vNode)=> void

export const h: hFn = (tag, props,children, el = null) => {
  return {
    tag,
    props,
    children,
    el
  }
}

export const mount: mountFn = (n, container)=> {
  //根据虚拟node，创建出真实的元素
  const el = n.el = document.createElement(n.tag)
  //添加props
  if (n.props) {
    for (const key of n.props) {
      const value = n.props[key]
      if(key.startsWith('on')) {
        el.addEventListener(key.slice(2).toLowerCase(),value)
      }else {
        el.setAttribute(key, value)
      }
    }
  }
  //处理children
  if (n.children) {
    if (typeof n.children === 'string') {
      el.textContent = n.children
    } else {
      n.children.forEach(element => {
        mount(element, el)
      });
    }
  }
  //挂载el
  container.appendChild(el)
}
