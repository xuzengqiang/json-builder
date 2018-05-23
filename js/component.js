/**
 * @fileOverview 组件注册
 * @author xuzengqiang <253948113@qq.com>
 * @date 2018-05-24 12:39:52
 * @version 1.0.0
 */
dom.ready(() => {
    const components = [CustomFieldComponent, CustomSearchComponent]
    components.forEach(component => Vue.component(component.name, component))
})
