let _Vue = null

export default class HashRouter {
  static install (Vue) {
    // 判断是否已经加载插件
    if (HashRouter.install.installed) {
      return
    }
    HashRouter.install.installed = true

    // 将 Vue 构造函数保存到全局
    _Vue = Vue

    // 定义全局混入，每次创建 Vue 实例的时候，将传入的 router 注入到 Vue 实例上
    _Vue.mixin({
      beforeCreate () {
        // 添加判断，避免创建组件的时候注入 router
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  constructor (options) {
    this.$options = options
    this.routeMap = {}
    // 使用 Vue 提供的 observable 将路由地址转换成响应式数据
    this.data = _Vue.observable({
      // 记录当前路由地址的属性
      // 如果当前地址有 hash 值，就初始化当前地址的 hash 如果没有默认为 /
      // 解决页面 F5 刷新之后页面组件和路由不对应的问题
      current: window.location.hash.slice(1) || '/'
    })
  }

  init () {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }

  createRouteMap () {
    // 遍历所有的路由规则并解析成键值对的形式存储到 routeMap 这个对象里
    this.$options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  initComponents (Vue) {
    const self = this
    Vue.component('router-link', {
      props: {
        to: String
      },
      // render 函数接收 h 函数作为参数，h 函数用于创建虚拟 DOM ，这个 h 函数是 Vue 传过来的
      render (h) {
        return h('a', {
          attrs: {
            href: this.to
          },
          on: {
            click: this.clickHandler
          }
        }, [this.$slots.default])
      },
      methods: {
        clickHandler (e) {
          // 跳转路由
          window.location.hash = this.to
          // 更新 current
          this.$router.data.current = this.to
          // 组织 a 标签默认跳转
          e.preventDefault()
        }
      }
    })
    Vue.component('router-view', {
      render (h) {
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }

  initEvent () {
    window.addEventListener('hashchange', () => {
      this.data.current = window.location.hash.slice(1)
    })
  }
}
