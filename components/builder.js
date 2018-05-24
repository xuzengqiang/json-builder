/**
 * @fileOverview json构建组件
 * @author xuzengqiang <253948113@qq.com>
 * @date 2018-05-24 11:45:39
 * @version 1.0.0
 */
const Builder = {
    template: '#builder-template',
    name: 'Builder',
    /**
     * 属性列表
     * @property {Object|Array} json - 需要输出的json数据
     */
    props: {
        json: [Object, Array]
    },
    computed: {
        /**
         * 生成json字符串
         */
        jsonString() {
            if (!this.json) return ''

            try {
                return JSON.stringify(this.json, null, '\t')
            } catch (e) {
                console.error('构建失败')
                console.error(e)
                return ''
            }
        }
    },
    methods: {
        clickHandle() {
            this.$emit('click')
        }
    }
}
