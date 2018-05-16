;(window => {
    const Field = {}

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
    const trim = string => (string ? (string + '').trim() : '')

    /**
     * 字段必备属性
     */
    const FieldPropertys = ['propertyName', 'columnType', 'columnName', 'label']

    /**
     * 字段校验
     * @param {Object} field - 字段信息
     * @since 1.0.0
     */
    Field.validator = function(field) {
        if (!field) {
            return {
                pass: false,
                message: '无效的field属性'
            }
        }

        let pass = true
        let message = ''
        for (let property of FieldPropertys) {
            if (!field[property]) {
                message = `缺少${property}属性`
                pass = false
                break
            }
        }

        if (pass) {
            pass = rcolumnType.test(field.columnType)
            if (!pass) {
                message = `列类型只支持string,enum,date,number`
            }
        }

        // 如果是枚举,则应该配置lookupCode
        if (pass && field.columnType === 'enum') {
            const lookupCode = field.lookupCode
            if (!lookupCode) {
                message = '如果列类型是枚举,则必须配置lookupCode属性'
                pass = false
            }
        }

        return {
            pass: pass,
            message: message
        }
    }

    window.Field = Field
})(window)
