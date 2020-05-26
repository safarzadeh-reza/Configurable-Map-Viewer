/*eslint no-console: 0, no-alert: 0*/
define([
    'dojo/i18n!./nls/main'
], function (i18n) {

    return {
        map: true,
        zoomExtentFactor: 2,
        singleZoomExtentFactor: 25,
        queries: [
            {
                description: i18n.find.ATM_Terminal,
                url: 'http://localhost:6080/arcgis/rest/services/parsaIranAtms_9802/MapServer',
                layerIds: [0, 1],
                searchFields: ['کد_ترمينال'],
                minChars: 1,
                gridColumns: [
                    {
                        field: 'کد ترمينال',
                        label: 'ترمینال',
                        resizable: false,
                        width: 50,
                        //sortable: false,
                    },
                    {
                        field: 'نام دستگاه',
                        label: 'نام',
                        resizable: false,
                        width:70 ,
                        //sortable: false,
                    },
                    {
                        field: 'کد شعبه',
                        label: 'کد شعبه',
                        resizable: false,
                        width: 50
                    },
                    {
                        field: 'مجموع تراکنش 5 ماه',
                        label: 'مجموع تراکنش',
                        resizable: false,
                        width: 110
                    },

                ]/*,
                sort: [
                    {
                        attribute: 'Name',
                        descending: false
                    }
                ]*/,
                prompt: 'ترمینال',
                selectionMode: 'single'
            },
            {
                description: i18n.find.ATM_Name,
                url: 'http://localhost:6080/arcgis/rest/services/parsaIranAtms_9802/MapServer',
                layerIds: [0, 1],
                searchFields: ['نام_دستگاه'],
                minChars: 1,
                gridColumns: [
                    {
                        field: 'کد ترمينال',
                        label: 'ترمینال',
                        resizable: false,
                        width: 50,
                        //sortable: false,
                    },
                    {
                        field: 'نام دستگاه',
                        label: 'نام',
                        resizable: false,
                        width: 70,
                        //sortable: false,
                    },
                    {
                        field: 'کد شعبه',
                        label: 'کد شعبه',
                        resizable: false,
                        width:50
                    },
                    {
                        field: 'مجموع تراکنش 5 ماه',
                        label: 'مجموع تراکنش  ',
                        resizable: false,
                        width:110
                    },
                ]/*,
                sort: [
                    {
                        attribute: 'Name',
                        descending: false
                    }
                ]*/,
                prompt: 'نام دستگاه',
                selectionMode: 'single'
            },
            /*
            {
                description: i18n.find.ATM_Accuracy,
                url: 'http://localhost:6080/arcgis/rest/services/parsaIranAtms_new/MapServer',
                layerIds: [0,1],
                searchFields: ['Accuracy'],
                minChars: 1,
                gridColumns: [
                    {
                        field: 'کد ترمينال',
                        label: 'ترمینال',
                        resizable: false
                        //width: 100,
                        //sortable: false,
                    },
                    {
                        field: 'نام دستگاه',
                        label: 'نام',
                        resizable: false
                        //width: 100,
                        //sortable: false,
                    },
                    {
                        field: 'خطاي ثبت (متر)',
                        label: 'دقت مکانی',
                        resizable: false
                    },
                    {
                        field: 'کد شعبه',
                        label: 'کد شعبه',
                        resizable: false
                    }
                ],
                prompt: 'دقت مکانی',
                selectionMode: 'single'
            },
            */
            {
                description: i18n.find.ATM_Branch,
                url: 'http://localhost:6080/arcgis/rest/services/parsaIranAtms_9802/MapServer',
                layerIds: [0, 1],
                searchFields: ['کد_شعبه'],
                filterFields: ['کد_شعبه'],
                minChars: 1,
                gridColumns: [
                    {
                        field: 'کد ترمينال',
                        label: 'ترمینال',
                        resizable: false,
                        width: 50,
                        //sortable: false,
                    },
                    {
                        field: 'نام دستگاه',
                        label: 'نام',
                        resizable: false,
                        width: 70,
                        //sortable: false,
                    },
                    {
                        field: 'کد شعبه',
                        label: 'کد شعبه',
                        resizable: false,
                        width: 50,
                    },
                    {
                        field: 'مجموع تراکنش 5 ماه',
                        label: 'مجموع تراکنش  ',
                        resizable: false,
                        width: 110,
                    },
                ]/*,
                sort: [
                    {
                        attribute: 'Name',
                        descending: false
                    }
                ]*/,
                prompt: 'کد شعبه',
                selectionMode: 'single'
            },
        ],
        filters: [
            {
                description: "فیلتر بر حسب تراکنش ماه آذر 97",
                url: 'http://localhost:6080/arcgis/rest/services/parsaIranAtms_9802/MapServer',
                layerIds: [0, 1],
                filterFields: ['F1397_09'],
                minChars: 1,
            },
            {
                description: "فیلتر بر حسب تراکنش ماه دی 97",
                url: 'http://localhost:6080/arcgis/rest/services/parsaIranAtms_9802/MapServer',
                layerIds: [0, 1],
                filterFields: ['F1397_10'],
                minChars: 1,
            },
            {
                description: "فیلتر بر حسب تراکنش ماه بهمن 97",
                url: 'http://localhost:6080/arcgis/rest/services/parsaIranAtms_9802/MapServer',
                layerIds: [0, 1],
                filterFields: ['F1397_11'],
                minChars: 1,
            },
            {
                description: "فیلتر بر حسب تراکنش ماه اسفند 97",
                url: 'http://localhost:6080/arcgis/rest/services/parsaIranAtms_9802/MapServer',
                layerIds: [0, 1],
                filterFields: ['F1397_12'],
                minChars: 1,
            },
            {
                description: "فیلتر بر حسب تراکنش ماه فروردین 98",
                url: 'http://localhost:6080/arcgis/rest/services/parsaIranAtms_9802/MapServer',
                layerIds: [0, 1],
                filterFields: ['F1398_01'],
                minChars: 1,
            },
            {
                description: "فیلتر بر حسب مجموع تراکنش",
                url: 'http://localhost:6080/arcgis/rest/services/parsaIranAtms_9802/MapServer',
                layerIds: [0, 1],
                filterFields: ['sum_transactions'],
                minChars: 1,
            },
            {
                description: "فیلتر بر حسب دقت مکانی",
                url: 'http://localhost:6080/arcgis/rest/services/parsaIranAtms_9802/MapServer',
                layerIds: [0, 1],
                filterFields: ['خطا__ثبت__متر_'],
                minChars: 1,
            },
        ],
        selectionSymbols: {
            polygon: {
                type: 'esriSFS',
                style: 'esriSFSSolid',
                color: [255, 0, 0, 175],
                outline: {
                    type: 'esriSLS',
                    style: 'esriSLSSolid',
                    color: [255, 0, 0, 255],
                    width: 3
                }
            },
            point: {
                type: 'esriSMS',
                style: 'esriSMSCircle',
                size: 10,
                color: [255, 0, 0, 175],
                angle: 0,
                xoffset: 0,
                yoffset: 0,
                outline: {
                    type: 'esriSLS',
                    style: 'esriSLSSolid',
                    color: [255, 0, 0, 255],
                    width: 1
                }
            }
        },
        selectionMode: 'extended'
    };
});