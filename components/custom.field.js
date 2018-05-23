/**
 * @fileOverview 自定义列组件
 * @author xuzengqiang <253948113@qq.com>
 * @date 2018-05-24 12:33:57
 * @version 1.0.0
 */
const CustomFieldComponent = {
    template: '#custom-field-template',
    name: 'CustomField',
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
