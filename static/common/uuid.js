/**
 * @copyright (c) 2018, All rights reserved.
 * @fileOverview uuid.js
 * @date 2018-05-23 12:35:22
 * @version 1.0.0
 */

;(window => {
    const UUID_STRING = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const rint = /^[1-9]\d*$/
    const isInt = number => rint.test(number)

    /**
     * 生成UUID
     * @param {Integer} len - UUID的长度
     * @param {Integer} radix - 进制
     * @see {Math.uuid.js}
     * @example
     * Framework.uuid() => F343F26D-2707-473E-840F-B11A96DDD4E6
     * Framework.uuid(8, 2) => 00011100
     * Framework.uuid(32, 16) => 0CECFF9C8AA4C227E2A289576DBAF208
     */
    const UUID = (len, radix) => {
        const chars = UUID_STRING.split('')

        len = isInt(len) ? parseInt(len, 10) : null
        radix = isInt(radix) ? parseInt(radix, 10) : chars.length

        let uuid = []
        let i

        if (len) {
            for (i = 0; i < len; i++) {
                uuid[i] = chars[0 | (Math.random() * radix)]
            }
        } else {
            let r

            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
            uuid[14] = '4'

            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | (Math.random() * 16)
                    uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
                }
            }
        }

        return uuid.join('')
    }

    window.UUID = UUID
})(window)
