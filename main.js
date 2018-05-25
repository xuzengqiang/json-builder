/**
 * @copyright (c) 2018, All rights reserved.
 * @fileOverview json构建
 * @author xuzengqiang <253948113@qq.com>
 * @date 2018-05-23 12:37:59
 * @version 1.0.1
 */
dom.ready(() => {
    new Vue({
        el: '#app',
        data () {
            return {
                generalFieldsJSONString: JSON.stringify(DEFAULT_GENERAL_FIELDS, null, '\t'),
                customColumnFields: [],
                customSearchFields: [],
                currentModule: 'custom-field'
            }
        },
        methods: {
            analyzeJSON () {
                let generalFields
                try {
                    generalFields = JSON.parse(this.generalFieldsJSONString)
                } catch (e) {
                    this.$alert('对不起,JSON解析失败,请检测', '温馨提示')
                }

                this.customColumnFields = []
                this.customSearchFields = []

                if (Array.isArray(generalFields)) {
                    let index = 0
                    let length = generalFields.length
                    let validate
                    let field
                    let json
                    let filter

                    for (index = 0; index < length; index++) {
                        field = generalFields[index]
                        validate = Field.validator(field)
                        if (validate.pass) {
                            json = {
                                propertyName: field.propertyName,
                                columnName: field.columnName,
                                columnType: field.columnType,
                                label: field.label,
                                lookupCode: field.lookupCode || '',
                                id: UUID()
                            }

                            filter = field.lookupCode ? 'lookup' : field.columnType == 'date' ? 'time' : ''

                            this.customColumnFields.push(
                                Object.assign({}, json, {
                                    width: '100',
                                    ignore: 'no',
                                    filter: filter
                                })
                            )

                            this.customSearchFields.push(Object.assign({}, json))
                        } else {
                            this.$message.error(`第${index + 1}条配置出错:${validate.message}`)
                        }
                    }
                }
            }
        }
    })
})
