/**
 * @copyright (c) 2018, All rights reserved.
 * @fileOverview json构建
 * @author xuzengqiang <253948113@qq.com>
 * @date 2018-05-23 12:37:59
 * @version 1.0.0
 */
;(window => {
    const JSONBuilder = {}
    const domReady = () => JSONBuilder.initialize()

    /**
     * 初始化
     */
    JSONBuilder.initialize = () => {}

    window.addEventListener('DOMContentLoaded', domReady)
})(window)
