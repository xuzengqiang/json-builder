/**
 * field
 */
(window => {

    /**
     * 支持的列类型
     * @description
     * 暂时支持四种： string, date, enum, number
     */
    const rcolumnType = /^(string|date|enum|number)$/

    /**
     * 过滤掉字符串的前后空格
     * @param {String} string - 字符串 
     */
    const trim = string => string ? (string + '').trim() : ''

    /**
     * 列默认宽度
     */
    const DEFAULT_COLUMN_WIDTH = 120

    /**
     * 字段必备属性
     */
    const FieldPropertys = [
        'propertyName',
        'columnType',
        'columnName',
        'label'
    ]

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
     * 不同类型的操作类型枚举
     */
    const CompareMap = {
        enum: ['contain', 'not_contain'],
        string: ['equal', 'not_equal', 'contain'],
        number: ['equal', 'not_equal', 'greaterthan', 'greaterthanorequal', 'lessthan', 'lessthanorequal'],
        date: ['greaterthan', 'greaterthanorequal', 'lessthan', 'lessthanorequal', 'between', 'not_between']
    }

    /**
     * 对应类型的表单类型
     */
    const FormFieldType = {
        enum: 'select',
        date: 'datePicker',
        number: 'text',
        string: 'text'
    }

    /**
     * 日期选择对应类型枚举
     */
    const DateTypeEnum = {
        year: 'year',
        month: 'month',
        date: 'date',
        dates: 'dates',
        week: 'week',
        datetime: 'datetime',
        datetimerange: 'datetimerange',
        daterange: 'daterange'
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
     * 默认compare
     */
    const DefaultCompare = {
        string: 'contain',
        number: 'equal',
        enum: 'contain',
        date: 'between'
    }

    /**
     * 
     */
    const FieldTypeMap = {

    }

    class Field {
        /**
         * 构造函数
         * @param {Object} field 字段信息 
         * @param {Number} index 当前索引 
         */
        constructor(field, index) {
            this.field = field
            this.index = index
            this._initialize()
        }

        /**
         * 初始化
         */
        _initialize () {
            const field = this.field
            FieldPropertys.forEach(property => this[property] = this.getPropertyValue(property))
        }

        /**
         * 获取字段值
         * @param {String} property 属性名称
         */
        getPropertyValue (property) {
            return this.field && property ?
                trim(this.field[property]) :
                null
        }

        /**
         * 字段校验
         * @description
         * 1 必须包含propertyName,columnName,colummType,label属性字段
         * 2 如果columnType是enum,则必须包含lookupCode属性
         */
        validate () {
            let validate = true
            const errorOutput = message => {
                console.error(`第${this.index}条字段验证出错:${message}`)
            }

            for (let property of FieldPropertys) {
                if (!this[property]) {
                    errorOutput(`缺少${property}属性`)
                    validate = false
                    break
                }
            }

            if (validate) {
                validate = rcolumnType.test(this.columnType)
                if (!validate) {
                    errorOutput(`列类型只支持string,enum,date,number`)
                }
            }

            // 如果是枚举,则应该配置lookupCode
            if (validate && this.columnType === 'enum') {
                const lookupCode = this.getPropertyValue('lookupCode')
                if (!lookupCode) {
                    errorOutput('如果列类型是枚举,则必须配置lookupCode属性')
                }
            }

            return validate
        }

        /**
         * 构建表单元素
         * @param {HTMLElement} container - 构建的表单元素追加的容器
         */
        createElement (container) {
            if (!container instanceof HTMLElement) {
                container = document.body
            }

            let element = document.createElement('div')
            element.className = 'field-info'

            let baseElement = this._createBaseElement()
            element.appendChild(baseElement)

            container.appendChild(element)

            this._createColumnElement()
            this._createSearchElement()
            this.infoElement = element
        }

        /**
         * 创建基础信息元素
         */
        _createBaseElement () {
            let element = document.createElement('div')
            element.className = 'field-base-info'

            element.appendChild(this.createFieldElement('label', this.label))
            element.appendChild(this.createFieldElement('字段名称', this.propertyName))
            element.appendChild(this.createFieldElement('数据库字段名', this.columnName))
            element.appendChild(this.createFieldElement('字段类型', this.columnType))

            if (this.columnType === 'enum') {
                element.appendChild(this.createFieldElement('数据字典', this.getPropertyValue('lookupCode')))
            }

            this.baseElement = element
            return this.baseElement
        }

        /**
         * 创建操作信息
         */
        _createSearchElement () {
            const element = document.createElement('div')
            const appendChild = (fieldName, childNode) =>
                element.appendChild(this.createFieldElement(fieldName, childNode))

            element.className = 'field-operate-info'

            this.frontBracketsElement = dom.createInput('(', 'brackets')
            appendChild(this.frontBracketsElement)

            this.postBracketsElement = dom.createInput(')', 'brackets')
            appendChild(this.postBracketsElement)

            this.conditionOperationElement = dom.createSelect({
                and: '且',
                or: '或'
            })
            appendChild('条件关系', this.conditionOperationElement)

            this.operationElement = dom.createSelect(this.getCompareMap(), DefaultCompare[this.columnType])
            appendChild('条件操作符', this.operationElement)

            this.fieldTypeElement = dom.createInput(FormFieldType[this.columnType])
            appendChild('表单类型', this.fieldTypeElement)

            this.showElement = dom.createSelect({
                true: '是',
                false: '否'
            }, 'false')
            appendChild('是否显示', this.showElement)

            this.placeholderElement = dom.createInput(`请填写${this.label}`, 'placeholder')
            appendChild('placeholder', this.placeholderElement)

            if (this.columnType === 'date') {
                this.datetypeElement = dom.createSelect(DateTypeEnum, 'datetime')
                appendChild('日期类型', this.datetypeElement)
            }

            this.searchElement = element
        }

        /**
         * 获取支持的compare
         */
        getCompareMap () {
            let compareMap = {}
            CompareMap[this.columnType.toLowerCase()].forEach(operate => {
                compareMap[operate] = GenericQueryOperation[operate]
            })
            return compareMap
        }

        /**
         * 创建表格列需要的元素信息
         */
        _createColumnElement () {
            const element = document.createElement('div')
            const appendChild = (fieldName, childNode) =>
                element.appendChild(this.createFieldElement(fieldName, childNode))

            element.className = 'field-column-expand'

            this.columnShowElement = dom.createSelect({
                true: '是',
                false: '否'
            }, 'false')
            appendChild('是否显示', this.columnShowElement)

            this.columnWidthElement = dom.createInput(DEFAULT_COLUMN_WIDTH)
            appendChild('默认宽度', this.columnWidthElement)

            // 如果列类型是time,则需要设置过滤器
            if (this.columnType === 'date') {
                this.columnFilterElement = dom.createSelect(DateFilterEnum)
                appendChild('过滤器类型', this.columnFilterElement)
            }

            this.columnElement = element
        }

        /**
         * 创建字段说明
         * @param {String} name - 字段名称
         * @param {HTMLElement|String|Array} content - 字段内容
         */
        createFieldElement (name, content) {
            const element = document.createElement('label')
            element.className = 'field-label'

            if (typeof name === 'string') {
                const spanElement = document.createElement('span')
                spanElement.className = 'field-name'
                spanElement.innerHTML = `${name}:`
                element.appendChild(spanElement)
            } else if (name instanceof HTMLElement) {
                content = name;
                name = ''
            }

            const contentElement = document.createElement('span')
            contentElement.className = 'field-content'

            content = Array.isArray(content) ? content : content ? [content] : []
            content.forEach(child => {
                if (child instanceof HTMLElement) {
                    contentElement.appendChild(child)
                } else {
                    contentElement.textContent = child
                }
            })

            element.appendChild(contentElement)
            return element
        }

        /**
         * 配置自定义列
         */
        configCustomColumn () {
            let parentNode = this.searchElement.parentNode
            this.infoElement.appendChild(this.columnElement)
            parentNode && parentNode.removeChild(this.searchElement)
        }

        /**
         * 配置自定义查询
         */
        configCustomSearch () {
            let parentNode = this.columnElement.parentNode
            this.infoElement.appendChild(this.searchElement)
            parentNode && parentNode.removeChild(this.columnElement)
        }

        /**
         * 转化为自定义搜索JSON
         */
        toSearchJSON () {
            let isShow = this.showElement.value
            if (isShow === 'false') return null

            let json = {
                propertyName: this.propertyName,
                columnName: this.columnName,
                frontBracketsElement: this.frontBracketsElement.value,
                postBracketsElement: this.postBracketsElement.value,
                conditionOperation: this.conditionOperationElement.value,
                operation: this.operationElement.value,
                columnType: this.columnType,
                label: this.label,
                type: this.fieldTypeElement.value,
                show: true
            }

            if (FormFieldType[this.columnType] === 'text') {
                let placeholder = this.placeholderElement.value.trim()
                if (placeholder) {
                    json.placeholder = placeholder
                }
            }

            if (this.columnType === 'date') {
                json.dateType = this.datetypeElement.value
            }

            if (this.columnType === 'enum') {
                json.lookupCode = this.getPropertyValue('lookupCode')
            }

            return json
        }

        /**
         * 转化为自定义列JSON
         * @description
         * {
         *      show: true,
         *      key: 'username',
         *      width: '120px',
         *      lable: '用户名',
         *      filter: 'time'
         * }
         */
        toColumnJSON () {
            let json = {
                key: this.propertyName,
                label: this.label
            }
            json.show = this.columnShowElement.value === 'true' ? true : false
            json.width = (parseInt(this.columnWidthElement.value) || DEFAULT_COLUMN_WIDTH) + 'px'

            if (this.columnType === 'enum') {
                Object.assign(json, {
                    filter: {
                        type: 'lookup',
                        args: [
                            this.getPropertyValue('lookupCode')
                        ]
                    }
                })
            }

            if (this.columnType === 'date') {
                Object.assign(json, {
                    filter: this.columnFilterElement.value
                })
            }

            return json
        }
    }

    window.Field = Field
})(window)
