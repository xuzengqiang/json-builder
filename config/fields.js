/**
 * @fileOverview 默认字段配置
 * @author xuzengqiang <253948113@qq.com>
 * @date 2018-05-16 11:38:32
 * @version 1.0.0
 */

window.DEFAULT_GENERAL_FIELDS = [
    {
        propertyName: 'orderNumber',
        columnName: 'om.order_number',
        columnType: 'string',
        label: '下单编码'
    },
    {
        propertyName: 'orderSource',
        columnName: 'om.order_source',
        columnType: 'enum',
        label: '下单来源',
        lookupCode: 'oms_order_source'
    },
    {
        propertyName: 'goodsTime',
        columnName: 'om.goods_time',
        columnType: 'date',
        label: '货好时间'
    },
    {
        propertyName: 'estimateWaybill',
        columnName: 'om.estimate_waybill',
        columnType: 'number',
        label: '票数'
    }
]
