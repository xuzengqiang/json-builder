/**
 * @fileOverview 自定义查询组件
 * @author xuzengqiang <253948113@qq.com>
 * @date 2018-05-24 12:36:55
 * @version 1.0.0
 */
(window => {

    /**
     * 不同类型的操作类型枚举
     */
    const CompareMap = {
        enum: ['contain', 'not_contain'],
        string: ['equal', 'not_equal', 'contain'],
        number: ['equal', 'not_equal', 'greaterthan', 'greaterthanorequal', 'lessthan', 'lessthanorequal'],
        date: ['greaterthan', 'greaterthanorequal', 'lessthan', 'lessthanorequal', 'between', 'not_between']
    }

    /**
     * 默认条件操作符
     */
    const DefaultCompare = {
        enum: 'contain',
        string: 'contain',
        number: 'equal',
        date: 'between'
    }

    /**
     * 条件操作符
     * @description 查看system_GenericQuery_Operation 数据字典管理
     */
    const GenericQueryOperation = {
        equal: '等于',
        not_equal: '不等于',
        greaterthan: '大于',
        greaterthanorequal: '大于等于',
        lessthan: '小于',
        lessthanorequal: '小于等于',
        contain: '包含于',
        not_contain: '不包含于',
        between: '范围于',
        not_between: '非范围于'
    }

    /**
     * 表单类型
     */
    const FormElementType = {
        text: 'text',
        textarea: 'textarea',
        area: 'area',
        autocomplete: 'autocomplete'
    }

    /**
     * 字符串类型支持生成的表单元素类型
     * @since 1.0.0
     */
    const ElementTypes = {
        text: 'text',
        autocomplete: 'autocomplete',
        area: 'area',
        radio: 'radio',
        checkbox: 'checkbox',
        checkboxGroup: 'checkboxGroup'
    }

    /**
     * 是否禁用
     */
    const disableds = {
        yes: '是',
        no: '否'
    }

    /**
     * 关系操作符
     */
    const ConditionOperations = {
        and: '且',
        or: '或'
    }

    /**
     * element支持的type
     */
    const DateTypes = {
        year: 'year',
        month: 'month',
        date: 'date',
        dates: 'dates',
        week: 'week',
        datetime: 'datetime',
        datetimerange: 'datetimerange',
        daterange: 'daterange'
    }

    const CustomSearchComponent = {
        template: '#custom-search-template',
        name: 'CustomSearch',
        data () {
            return {
                customSearchFields: [],
                customSearchJSON: null,
                elementTypes: ElementTypes,
                disableds: disableds,
                conditionOperations: ConditionOperations,
                dateTypes: DateTypes
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
                let customSearchFields = []
                let compareMap
                let type

                selection.forEach(field => {
                    compareMap = {}
                    CompareMap[field.columnType].forEach(compare => {
                        compareMap[compare] = GenericQueryOperation[compare]
                    })

                    type = field.columnType == 'enum' ? 'select' : field.columnType == 'date' ? 'datePicker' : 'text'

                    customSearchFields.push({
                        propertyName: field.propertyName,
                        columnName: field.columnName,
                        columnType: field.columnType,
                        label: field.label,
                        frontBrackets: '(',
                        postBrackets: ')',
                        conditionOperation: 'and',
                        operation: DefaultCompare[field.columnType],
                        type: type,
                        show: true,
                        compareMap: compareMap,
                        placeholder: `请填写${field.label}`,
                        disabled: 'no',
                        lookupCode: field.lookupCode,
                        dateType: 'date'
                    })
                })
                this.customSearchFields = customSearchFields
            },
            /**
             * 构建自定义列JSON
             * @since 1.0.0
             */
            builderCustomSearch () {
                let fields = []
                let json
                this.customSearchFields.forEach(item => {
                    json = {
                        propertyName: item.propertyName,
                        columnName: item.columnName,
                        frontBrackets: item.frontBrackets,
                        postBrackets: item.postBrackets,
                        conditionOperation: item.conditionOperation,
                        operation: item.operation,
                        columnType: item.columnType,
                        label: item.label,
                        type: item.type,
                        show: true,
                        placeholder: item.placeholder,
                        disabled: item.disabled === 'no' ? false : true
                    }

                    switch (item.columnType) {
                        case 'date':
                            json.dateType = item.dateType
                            break
                        case 'enum':
                            json.lookupCode = item.lookupCode
                    }

                    fields.push(json)
                })
                this.customSearchJSON = fields
            }
        }
    }

    window.CustomSearchComponent = CustomSearchComponent
})(window)
