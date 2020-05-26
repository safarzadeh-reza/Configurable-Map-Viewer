define({
    map: true,
    identifyLayerInfos: true,
    //proxy_url: 'http://localhost:8080/cmv/proxy/PHP/proxy.php',

    layers2render: [
        /*
        {
            id: 'خودپردازهای غیر فعال پارسا',
            url: 'http://192.168.100.50:6080/arcgis/rest/services/ParsaAtms/FeatureServer/0',
            fields: ['accuracy',]

        }
        */
        {
            id: 'خودپردازهای فعال پارسا',
            url: 'http://192.168.100.50:6080/arcgis/rest/services/ParsaAtms/FeatureServer/0',
            fields: ['Lag1MonthSucess','Lag1MonthFail','Lag1MonthTotal','Lag2MonthSucess','Lag2MonthFail','Lag2MonthTotal','Lag3MonthSucess','Lag3MonthFail','Lag3MonthTotal','total_success', 'total_fail', 'total', 'fail_percent','accuracy']
        }
    ]

});			