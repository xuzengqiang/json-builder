/**
 * @copyright (c) 2018, All rights reserved.
 * @fileOverview json构建
 * @author xuzengqiang <253948113@qq.com>
 * @date 2018-05-23 12:37:59
 * @version 1.0.0
 */
dom.ready(() => {
    const JSONBuilder = {}

    /**
     * 支持的列类型
     * @description
     * 暂时支持四种： string, date, enum, number
     */
    const rcolumnType = /^(string|date|enum|number)$/

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
     * 日期过滤器枚举
     */
    const DateFilterEnum = {
        date: 'date',
        minute: 'minute',
        time: 'time',
        second: 'second'
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

    new Vue({
        el: '#app',
        data() {
            return {
                name: '1212',
                generalFieldsJSONString: JSON.stringify(DEFAULT_GENERAL_FIELDS, null, '\t'),
                customColumnFields: [],
                fields: [],
                customSearchFields: [],
                customColumnJSONString: '',
                customSearchJSONString: '',
                selection: [],
                currentModule: 'custom-field',
                timeFilters: {
                    date: 'date',
                    minute: 'minute',
                    time: 'time',
                    second: 'second'
                },
                conditionOperations: {
                    and: '且',
                    or: '或'
                },
                disabled: {
                    yes: '是',
                    no: '否'
                },
                stringFileTypes: {
                    text: 'text',
                    autocomplete: 'autocomplete',
                    area: 'area',
                    radio: 'radio',
                    checkbox: 'checkbox',
                    checkboxGroup: 'checkboxGroup'
                },
                dateTypes: {
                    year: 'year',
                    month: 'month',
                    date: 'date',
                    dates: 'dates',
                    week: 'week',
                    datetime: 'datetime',
                    datetimerange: 'datetimerange',
                    daterange: 'daterange'
                }
            }
        },
        computed: {},
        methods: {
            analyzeJSON() {
                let generalFields
                try {
                    generalFields = JSON.parse(this.generalFieldsJSONString)
                } catch (e) {
                    this.$alert('对不起,JSON解析失败,请检测', '温馨提示')
                }

                if (Array.isArray(generalFields)) {
                    let index = 0
                    let length = generalFields.length
                    let validate
                    let field
                    let base
                    for (index = 0; index < length; index++) {
                        field = generalFields[index]
                        validate = Field.validator(field)
                        if (validate.pass) {
                            base = {
                                propertyName: field.propertyName,
                                columnName: field.columnName,
                                columnType: field.columnType,
                                label: field.label,
                                lookupCode: field.lookupCode || '',
                                id: UUID()
                            }

                            let filter = field.lookupCode ? 'lookup' : field.columnType == 'date' ? 'time' : ''

                            this.customColumnFields.push(
                                Object.assign({}, base, {
                                    width: '100',
                                    filter: filter
                                })
                            )

                            this.fields.push(Object.assign({}, base))
                        } else {
                            this.$message.error(`第${index + 1}条配置出错:${validate.message}`)
                        }
                    }
                }
            },
            columnSelectionChangeHandle(selection) {
                this.selection = selection
            },
            selectionChangeHandle(selection) {
                let customSearchFields = []
                let compareMap

                selection.forEach(field => {
                    compareMap = {}
                    CompareMap[field.columnType].forEach(compare => {
                        compareMap[compare] = GenericQueryOperation[compare]
                    })

                    let type = field.columnType == 'enum' ? 'select' : field.columnType == 'date' ? 'datePicker' : 'text'

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
            builderCustomColumn() {
                let fields = []
                let found
                let base
                this.customColumnFields.forEach(item => {
                    found = this.selection.find(row => row.id === item.id)

                    base = {
                        label: item.label,
                        key: item.propertyName,
                        show: !!found,
                        width: item.width + 'px'
                    }

                    if (item.lookupCode) {
                        base.filter = {
                            type: 'lookup',
                            args: [item.lookupCode]
                        }
                    } else if (item.columnType === 'date') {
                        base.filter = item.filter
                    }
                    fields.push(base)
                })
                this.customColumnJSONString = JSON.stringify(fields, null, '\t')
            },
            builderCustomSearch() {
                let fields = []
                let base
                this.customSearchFields.forEach(item => {
                    base = {
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
                            base.dateType = item.dateType
                            break
                        case 'enum':
                            base.lookupCode = item.lookupCode
                    }

                    fields.push(base)
                })
                this.customSearchJSONString = JSON.stringify(fields, null, '\t')
            }
        }
    })
})
