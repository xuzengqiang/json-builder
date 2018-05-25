/**
 * @fileOverview 自定义列组件
 * @author xuzengqiang <253948113@qq.com>
 * @date 2018-05-24 12:33:57
 * @version 1.0.0
 */
(window => {

    /**
     * 系统时间过滤器
     * @enum
     */
    const TimeFilter = {
        date: 'date',
        minute: 'minute',
        time: 'time',
        second: 'second'
    }

    const CustomFieldComponent = {
        template: '#custom-field-template',
        name: 'CustomField',
        data () {
            return {
                selection: [],
                customColumnJSON: null,
                filters: TimeFilter
            }
        },
        /**
         * 属性列表
         * @property {Object} fields - 列
         */
        props: {
            fields: {
                type: Array,
                required: true
            }
        },
        methods: {
            /**
             * 复选框勾选之后改变的处理
             * @param {Array} selection - 勾选的列表数据
             * @since 1.0.0
             */
            selectionChangeHandle (selection) {
                this.selection = selection
            },
            /**
             * 构建自定义列
             * @since 1.0.0
             */
            builderCustomColumn () {
                let fields = []
                let found
                let json

                this.selection.forEach(item => {
                    found = this.selection.find(row => row.id === item.id)

                    json = {
                        label: item.label,
                        key: item.propertyName,
                        show: !!found,
                        width: item.width + 'px'
                    }

                    if (item.lookupCode) {
                        json.filter = {
                            type: 'lookup',
                            args: [item.lookupCode]
                        }
                    } else if (item.columnType === 'date') {
                        json.filter = item.filter
                    }
                    fields.push(json)
                })
                this.customColumnJSON = fields
            }
        }
    }

    window.CustomFieldComponent = CustomFieldComponent
})(window)
