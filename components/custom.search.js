/**
 * @fileOverview 自定义查询组件
 * @author xuzengqiang <253948113@qq.com>
 * @date 2018-05-24 12:36:55
 * @version 1.0.0
 */
const CustomSearchComponent = {
    template: '#custom-search-template',
    name: 'CustomSearch',
    data() {},
    /**
     * 属性列表
     * @property {Object} fields - 列
     */
    props: {
        fields: {
            type: Array,
            required: true
        }
    }
}
