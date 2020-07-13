const _Vue = null

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
          _Vue.prototype.$router = this.$options.router,
          this.$options.router.init()
        }
      }
    })
  }

  constructor (options) {
    this.$options = options
    this.routeMap = {}
  }
}
