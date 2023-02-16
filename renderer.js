
const h = (tag, props,children) => {
  return {
    tag,
    props,
    children
  }
}
const mount = (n, container)=> {
  //根据虚拟node，创建出真实的元素
  const el = n.el = document.createElement(n.tag)
  //添加props
  if (n.props) {
    for (const key in n.props) {
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

const patch = (n1, n2)=> {
  if (n1.tag !== n2.tag) {
    const   n1Elparent = n2.el.parentElement;
    n1Elparent.removeElement(n2.el)
    mount(n1,n1Elparent)
  } else {
    //取出element对象，并在n2中保存
    const el = n1.el = n2.el;

    patchProps(n1, n2 ,el)
    patchChildren(n1,n2,el)
    
  }
}
const patchProps = (n1, n2 , el)=> {

  const oldProps = n2.props || {}
  const newProps = n1.props || {}

  for (const key in newProps) {
    const newValue = newProps[key]
    const oldValue = oldProps[key]
    if (newValue !== oldValue) {
      if (key.startsWith('on')) {
        el.addEventListener(key.slice(2).toLowerCase(),newValue)
      } else {
        el.setAttribute(key,newValue)
      }
    }
  }

  for (const key in oldProps) {
    if (!(key in newProps)) {
      const oldValue = oldProps[key]
      if (key.startsWith('on')) {
        el.removeEventListener(key.slice(2).toLowerCase(),oldValue)
      } else {
        el.removeAttrebute(key)
      }
    }
  }
}
const patchChildren = (n1, n2 ,el)=>{
  const newChildren = n1.children || []
  const oldChildren = n2.children || []
  if (typeof newChildren === 'string') {
    if (typeof oldChildren === 'string') {
      if (newChildren !== oldChildren) {
        el.textContent = newChildren
      }
    }else {
      el.innerHTML = newChildren
    }
  }else {
    if (typeof oldChildren === "string") {
      el.innerHTML = ""
      newChildren.forEach(item => {
        mount(item,el)
      })
    }else {
      // oldChildren: [v1, v2, v3, v8, v9]
      // newChildren: [v1, v5, v6]
      // 1.前面有相同节点的原生进行patch操作
      const commonLength = Math.min(oldChildren.length, newChildren.length)
      for (let i = 0;i< commonLength; i++ ) {
        patch(newChildren[i],oldChildren[i])
      }

      if (oldChildren.length > newChildren.length) {
        oldChildren.slice(commonLength).forEach(item=> {
          el.removeChild(item.el)
        })
      }else {
        newChildren.slice(commonLength).forEach(item=> {
          mount(item, el)
        })
      }
    }
  }

}