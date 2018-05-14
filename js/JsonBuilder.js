(window => {

    class JSONBuilder {
        constructor(options = {}) {
            try {
                this.json = JSON.parse(options.json)
            } catch (e) {
                console.error(e)
                throw new Error('对不起,JSON数据解析失败.无法生成字段信息')
            }

            this.fieldsContainer = options.fieldsContainer
            this.fieldsContainer.innerHTML = ''
            this._fieldsBuilder()
        }

        /**
         * 获取有效的字段数组
         */
        getFields () {
            const json = this.json
            let field
            let fields = []
            if (Array.isArray(json)) {
                let index = 0
                let length = json.length
                for (index = 0; index < length; index++) {
                    field = new Field(json[index], index + 1)
                    if (field.validate()) {
                        fields.push(field)
                    }
                }
            }
            return fields
        }

        /**
         * 根据json数据构建字段信息
         */
        _fieldsBuilder () {
            this.originFields = this.getFields()
            this.originFields.forEach(field => {
                field.createElement(this.fieldsContainer)
            })
        }

        /**
         * 配置自定义列
         */
        configCustomColumn () {
            this.originFields.forEach(field => {
                field.configCustomColumn()
            })
        }

        /**
         * 配置自定义查询
         */
        configCustomSearch () {
            this.originFields.forEach(field => {
                field.configCustomSearch()
            })
        }

        /**
         * 构建自定义列
         */
        builderCustomColumn () {
            let columnJSON = []
            this.originFields.forEach(field => {
                columnJSON.push(field.toColumnJSON())
            })
            return columnJSON
        }

        /**
         * 构建自定义查询
         */
        builderCustomSearch () {
            let searchJSON = []
            let json
            this.originFields.forEach(field => {
                json = field.toSearchJSON()
                json && searchJSON.push(json)
            })
            return searchJSON
        }
    }

    JSONBuilder.VERSION = '1.0.0'
    window.JSONBuilder = JSONBuilder
})(window)