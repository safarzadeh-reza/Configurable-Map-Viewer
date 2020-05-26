/*eslint no-alert: 0*/
define([
    'dojo/_base/lang',
    'dojo/on',
    'dojo/number',
    'esri/geometry/geometryEngine',
    "dojo/dom",
    'dojo/dom-construct',
    'dojo/topic',
    "dojox/charting/Chart",
    "dojox/charting/themes/MiamiNice",
    "dojox/charting/plot2d/Columns",
    "dojox/charting/plot2d/Markers",
    "dojox/charting/axis2d/Default",
    "dojo/domReady!"
], function (lang, on, number, geometryEngine, dom, domConstruct, topic, Chart, theme) {

    /* function getDateTime (value) {
         if (isNaN(value) || value === 0 || value === null) {
             return null;
         }
         return new Date(value);
     }*/

    return {
        map: true,
        mapClickMode: true,

        queryStringOptions: {
            valueParameter: 'NAME'
        },

        enableAdvancedSearch: true,
        enableClearButton: true,

        layers: [
            {
                name: 'خودپردازهای پارسا',
                expression: '', // additional where expression applied to all queries
                idProperty: 'objectid',
                labelWidth: 100,
                advancedSearchOptions: {
                    fields: [
                        { id: "total_mean", label: "میانگین تراکنش روزانه پاییز هر دستگاه", type: "double", caseInsensitive: false },
                        { id: "success_mean", label: "میانگین تراکنش موفق روزانه پاییز هر دستگاه", type: "double", caseInsensitive: false },
                        { id: "unsuccess_mean", label: "میانگین تراکنش ناموفق روزانه پاییز هر دستگاه", type: "double", caseInsensitive: false },
                        { id: "Lag1MonthTotal", label: "مجموع تراکنش ماه قبل", type: "double", caseInsensitive: false },
                        { id: "Lag1MonthSucess", label: "مجموع تراکنش موفق ماه قبل", type: "double", caseInsensitive: false },
                        { id: "Lag1MonthFail", label: "مجموع تراکنش ناموفق ماه قبل" , type: "double", caseInsensitive: false },
                        { id: "Lag2MonthTotal", label:"مجموع تراکنش 2 ماه قبل", type: "double", caseInsensitive: false },
                        { id: "Lag2MonthSucess", label:"مجموع تراکنش موفق 2 ماه قبل", type: "double", caseInsensitive: false },
                        { id: "Lag2MonthFail", label:"مجموع تراکنش ناموفق 2 ماه قبل", type: "double", caseInsensitive: false },
                        { id: "Lag3MonthTotal", label: "مجموع تراکنش 3 ماه قبل" , type: "double", caseInsensitive: false },
                        { id: "Lag3MonthSucess", label: "مجموع تراکنش موفق 3 ماه قبل" , type: "double", caseInsensitive: false },
                        { id: "Lag3MonthFail", label: "مجموع تراکنش ناموفق 3 ماه قبل", type: "double", caseInsensitive: false },
                        { id: "total_success", label: "مجموع تراکنش موفق 3 ماه" , type: "double", caseInsensitive: false },
                        { id: "total_fail", label: "مجموع تراکنش ناموفق 3 ماه", type: "double", caseInsensitive: false },
                        { id: "total", label:"مجموع تراکنش 3 ماه", type: "double", caseInsensitive: false },
                        { id: "fail_percent", label:"درصد تراکنش ناموفق 3 ماه", type: "double", caseInsensitive: false },
                        { id: "Terminal_ID", label: "کد ترمینال", type: "double", caseInsensitive: false },
                        { id: "Branch_Code", label: "کد شعبه", type: "double", caseInsensitive: false },
                        { id: "accuracy", label: "خطای ثبت (متر)", type: "double", caseInsensitive: false },
                        { id: "ExistData", label: "تعداد روزهای فعال", type: "double", caseInsensitive: false },
                        { id: "ActiveLenght", label: "تعداد روزهای استقرار", type: "double", caseInsensitive: false },

                    ]
                },
                queryParameters: {
                    type: 'spatial', // spatial, relationship, table or database
                    layerID: 'parsaIRIranAtms', // from operational layers
                    sublayerID: 1,
                    outFields: ['*']
                },
                infoTemplates: {
                    buffer: {
                        title: 'محدوده جست و جو',
                        content: function (feature) {
                            if (feature.geometry) {
                                return 'مساحت محدوده  =  ' + number.format(geometryEngine.geodesicArea(feature.geometry, 'square-meters'), {places: 0, digitSeparator: true}) + ' متر مربع ';
                            }
                            return '';
                        }
                    },
                    features: {
                        title: 'نتایج جست و جو',
                        content: function (feature) {
                            var listItem = ' {1}  :  {0} <br> ';
                            var html = ['<ul>'];
                            var b;
                            for (var a in feature.attributes) {
                                //make sure a is an own property
                                if (feature.attributes.hasOwnProperty(a)) {
                                    if (a == 'Branch_Name' || a == 'Terminal_ID' || a == 'Branch_Code' || a == 'total_success' || a == 'total_fail' || a=='total' || a=='fail_percent') {
                                        if (a == 'Branch_Name') {
                                            b = 'نام دستگاه'
                                        }
                                        else if (a == 'Terminal_ID') {
                                            b = 'کد ترمینال'
                                        }
                                        else if (a == 'Branch_Code') {
                                            b = 'کد شعبه'
                                        }
                                        else if (a == 'total_success') {
                                            b = 'مجموع تراکنش های موفق 3 ماه'
                                        }
                                        else if (a == 'total_fail') {
                                            b = 'مجموع تراکنش های ناموفق 3 ماه'
                                        }
                                        else if (a == 'total') {
                                            b = 'مجموع کل تراکنش های 3 ماه'
                                        }
                                        else if (a == 'fail_percent') {
                                            b = 'درصد تراکنش ناموفق 3 ماه'
                                        }
                                        html.push(lang.replace(listItem, [feature.attributes[a], b]));
                                    }

                                }
                            }
                            html.push('</ul>');
                           return html.join('');
                        }
                    }
                },
                attributeSearches: [
                    {
                        name: '[جست و جوی خودپردازهای پارسا]',
                        searchFields: [
                            {
                                field: 'Branch_Code',
                                label: 'کد شعبه',
                                expression: '(Branch_Code = [value])',
                                placeholder: 'کد شعبه',
                                //required: true,
                                minChars: 3,
                                height: 30,
                                width: 'calc(100% - 75px)'
                            },
                            {
                                field: 'Terminal_ID',
                                label: 'کد ترمینال',
                                expression: '(Terminal_ID = [value])',
                                placeholder: 'کد ترمینال',
                                //required: true,
                                minChars: 3,
                                height: 30,
                                width: 'calc(100% - 75px)'
                            },
                            {
                                field: 'Branch_Name',
                                label: 'نام دستگاه',
                                expression: '(Branch_Name LIKE \'%[value]%\')',
                                placeholder: 'نام دستگاه',
                                //required: true,
                                minChars: 1,
                                height: 30,
                                width: 'calc(100% - 75px)'
                            },
                        ],
                        title: 'خودپردازهای پارسا',
                        topicID: 'خودپردازهای پارسا',
                        gridOptions: {
                            columns: [
                                {
                                    field: 'Dist',
                                    label: 'فاصله از نقطه مرکز (متر)',
                                    width: 100,
                                    exportable: true,
                                    topicID: 'ParsaATM',
                                    renderCell: function (object, value, node) {
                                        // function from search widget
                                        if (object.feature.geometry) {
                                            topic.publish('searchResults/returnGeometry', node, object );
                                        }
                                    }
                                },
                                {
                                    field: 'Terminal_ID',
                                    label: 'شماره ترمینال',
                                    width: 100
                                },
                                {
                                    field: 'Branch_Name',
                                    label: 'نام دستگاه',
                                    width: 180
                                },
                                {
                                    field: 'Branch_Code',
                                    label: 'کد شعبه',
                                    width: 50
                                },
                                {
                                    field: 'Lag1MonthSucess',
                                    label: 'مجموع تراکنش موفق ماه قبل',
                                    width: 120
                                },
                                {
                                    field: 'Lag1MonthFail',
                                    label: 'مجموع تراکنش ناموفق ماه قبل ',
                                    width: 120
                                },
                                {
                                    field: 'Lag1MonthTotal',
                                    label: 'مجموع تراکنش ماه قبل',
                                    width: 120
                                },
                                {
                                    field: 'Lag2MonthSucess',
                                    label: 'مجموع تراکنش موفق 2 ماه قبل',
                                    width: 120
                                },
                                {
                                    field: 'Lag2MonthFail',
                                    label: 'مجموع تراکنش ناموفق 2 ماه قبل',
                                    width: 120
                                },
                                {
                                    field: 'Lag2MonthTotal',
                                    label: 'مجموع تراکنش 2 ماه قبل',
                                    width: 120
                                },
                                {
                                    field: 'Lag3MonthSucess',
                                    label: 'مجموع تراکنش موفق 3 ماه قبل',
                                    width: 120
                                },
                                {
                                    field: 'Lag3MonthFail',
                                    label: 'مجموع تراکنش ناموفق 3 ماه قبل',
                                    width: 120
                                },
                                {
                                    field: 'Lag3MonthTotal',
                                    label: 'مجموع تراکنش 3 ماه قبل',
                                    width: 120
                                },
                                {
                                    field: 'total_success',
                                    label: 'مجموع کل تراکنش موفق 3 ماه',
                                    width: 120
                                },
                                {
                                    field: 'total_fail',
                                    label: 'مجموع کل تراکنش ناموفق 3 ماه',
                                    width: 120
                                },
                                {
                                    field: 'total',
                                    label: 'مجموع کل تراکنش 3 ماه',
                                    width: 120
                                },
                                {
                                    field: 'fail_percent',
                                    label: 'درصد تراکنش ناموفق 3 ماه',
                                    width: 120
                                },
                                {
                                    field: 'ExistData',
                                    label: 'تعداد روزهاي فعال',
                                    width: 100
                                },
                                {
                                    field: 'ActiveLenght',
                                    label: 'تعداد روزهاي استقرار',
                                    width: 100
                                },
                            ],
                        }
                    }
                ]
            },
            //-------------------------------------------
            /*

            {
                name: 'خودپردازهای غیر فعال پارسا',
                expression: '', // additional where expression applied to all queries
                idProperty: 'objectid',
                labelWidth: 100,
                advancedSearchOptions: {
                    fields: [
                        { id: "Terminal_id", label: "شماره ترمینال", type: "double", caseInsensitive: false },
                        { id: "accuracy ", label:"خطای ثبت (متر)", type: "double", caseInsensitive: false },
                    ]
                },
                queryParameters: {
                    type: 'spatial', // spatial, relationship, table or database
                    layerID: 'parsaUiRIranATMs', // from operational layers
                    sublayerID: 0,
                    outFields: ['*']
                },
                infoTemplates: {
                    buffer: {
                        title: 'محدوده جست و جو',
                        content: function (feature) {
                            if (feature.geometry) {
                                return 'مساحت محدوده  =  ' + number.format(geometryEngine.geodesicArea(feature.geometry, 'square-meters'), {places: 0, digitSeparator: true}) + ' متر مربع '
                            }
                            return '';
                        }
                    },
                    features: {
                        title: 'نتایج جست و جو',
                        content: function (feature) {
                            var listItem = ' {1}  :  {0} <br> ';
                            var html = ['<ul>'];
                            var b;
                            for (var a in feature.attributes) {
                                //make sure a is an own property
                                if (feature.attributes.hasOwnProperty(a)) {
                                    if (a == 'name' || a == 'Terminal_id' || a == 'accuracy') {
                                        if (a == 'name') {
                                            b = 'نام دستگاه'
                                        }
                                        else if (a == 'Terminal_id') {
                                            b = 'کد ترمینال'
                                        }
                                        else if (a == 'accuracy') {
                                            b = 'خطای ثبت (متر)'
                                        }
                                        html.push(lang.replace(listItem, [feature.attributes[a], b]));
                                    }
                                }
                            }
                            html.push('</ul>');
                           return html.join('');
                        }
                    }
                },
                attributeSearches: [
                    {
                        name: '[جست و جوی خودپردازهای پارسا]',
                        searchFields: [
                            {
                                field: 'accuracy',
                                label: 'خطای ثبت (متر)',
                                expression: '(accuracy = [value])',
                                placeholder: 'خطای ثبت (متر)',
                                //required: true,
                                minChars: 3,
                                height: 30,
                                width: 'calc(100% - 75px)'
                            },
                            {
                                field: 'Terminal_id',
                                label: 'کد ترمینال',
                                expression: '(Terminal_id = [value])',
                                placeholder: 'کد ترمینال',
                                //required: true,
                                minChars: 3,
                                height: 30,
                                width: 'calc(100% - 75px)'
                            },
                            {
                                field: 'name',
                                label: 'نام دستگاه',
                                expression: '(name LIKE \'%[value]%\')',
                                placeholder: 'نام دستگاه',
                                //required: true,
                                minChars: 1,
                                height: 30,
                                width: 'calc(100% - 75px)'
                            },
                        ],
                        title: 'خودپردازهای غیر فعال پارسا',
                        topicID: 'خودپردازهای غیر فعال  پارسا',
                        gridOptions: {
                            columns: [
                                {
                                    id: 'Action',
                                    field: 'Terminal_id',
                                    label: 'فاصله از نقطه مرکز (متر)',
                                    width: 100,
                                    exportable: true,
                                    topicID: 'ParsaUIATM',
                                    renderCell: function (object, value, node) {

                                        // function from search widget

                                        if (object.feature.geometry) {
                                            topic.publish('searchResults/returnGeometry', node, object);
                                        }
                                    }
                                },
                                {
                                    field: 'Terminal_id',
                                    label: 'شماره ترمینال',
                                    width: 100
                                },
                                {
                                    field: 'name',
                                    label: 'نام دستگاه',
                                    width: 150
                                },
                                {
                                    field: 'accuracy',
                                    label: 'خطای ثبت (متر)',
                                    width: 50
                                },
                            ],
                        }
                    }
                ]
            },
            */
            //-------------------------------------------
            {
                name: 'خودپردازهای سایر بانک ها',
                expression: '', // additional where expression applied to all queries
                idProperty: 'objectid',
                labelWidth: 100,
                queryParameters: {
                    type: 'spatial', // spatial, relationship, table or database
                    layerID: 'allIranAtms_new', // from operational layers
                    sublayerID: 0,
                    outFields: ['name', 'vicinity']
                },
                infoTemplates: {
                    buffer: {
                        title: 'محدوده مورد جست و جو',
                        content: function (feature) {
                            if (feature.geometry) {
                                return 'مساحت محدوده  =  ' + number.format(geometryEngine.geodesicArea(feature.geometry, 'square-meters'), {places: 0, digitSeparator: true}) + ' متر مربع ';
                            }
                            return '';
                        }
                    },

                    features: {
                        title: 'نتایج جست و جو',
                        content: function (feature) {
                            var listItem = ' {1}  :  {0} <br> ';
                            var html = ['<ul>'];
                            var b;
                            for (var a in feature.attributes) {
                                //make sure a is an own property
                                if (feature.attributes.hasOwnProperty(a)) {
                                    if (a == 'name' || a == 'vicinity') {
                                        if (a == 'name') {
                                            b = 'نام دستگاه'
                                        }
                                        else if (a == 'vicinity') {
                                            b = 'شهر و محله'
                                        }
                                        html.push(lang.replace(listItem, [feature.attributes[a], b]));
                                    }

                                }
                            }
                            html.push('</ul>');
                           return html.join('');
                        }
                    }
                },
                attributeSearches: [
                    {
                        name: '[جست و جوی خودپردازهای سایر بانک ها]',
                        enableAdvancedSearch: false,
                        searchFields: [
                            //     {
                            //         field: 'name',
                            //         label: 'نام دستگاه',
                            //         expression: '(name LIKE \'%[value]%\')',
                            //         placeholder: 'نام دستگاه',
                            //         //required: true,
                            //         minChars: 1,
                            //         height: 30,
                            //         width: 'calc(100% - 75px)'
                            //     }
                        ],
                        title: 'خودپردازهای سایر بانک ها',
                        topicID: 'خودپردازهای سایر بانک ها',
                        gridOptions: {
                            columns: [
                                {
                                    id: 'Action',
                                    field: 'dist',
                                    label: 'فاصله از نقطه مرکز (متر)',
                                    width: 100,
                                    sortable: true,
                                    exportable: true,
                                    topicID: 'otherATMs',
                                    renderCell: function (object, value, node) {
                                        // function from search widget

                                        if (object.feature.geometry) {

                                            topic.publish('searchResults/returnGeometry', node, object);
                                        }
                                        //on(node, 'click', function () {
                                        //topic.publish('searchResults/returnGeometry', x);
                                        // });
                                        //node.innerHTML = '<i style=\'margin-left:2px; font-family: B Yekan;\'>'+dist+'</i>';
                                    }
                                },
                                {
                                    field: 'name',
                                    label: 'نام دستگاه',
                                    width: 120,
                                },
                                {
                                    field: 'vicinity',
                                    label: 'شهر و محله',
                                    width: 120,
                                },
                            ],
                        }
                    }
                ]
            },
            /* {
                 name: 'Public Safety',
                 expression: '', // additional where expression applied to all queries
                 idProperty: 'OBJECTID',
                 attributeSearches: [
                     {
                         name: 'Hospitals',
                         queryParameters: {
                             type: 'table', // spatial, relationship, table or database
                             layerID: 'louisvillePubSafety', // from operational layers
                             sublayerID: 5,
                             outFields: ['*']
                         },
                         enableClearButton: false,
                         searchFields: [
                             {
                                 field: 'Hospital Name',
                                 label: 'Name',
                                 expression: '(NAME LIKE \'%[value]%\')',
                                 required: true,
                                 minChars: 3,
                                 defaultValue: 'Bap',
                                 width: 'calc(100% - 65px)'
                             },
                             {
                                 field: 'Total Admissions',
                                 label: 'Admissions >=',
                                 type: 'numberspinner',
                                 constraints: {min: 0, max: 100000, places: 0},
                                 defaultValue: 0,
                                 expression: '(TOTALADM >= [value])',
                                 width: 120
                             },
                             {
                                 field: 'Total Admissions',
                                 label: 'Admissions <=',
                                 type: 'numberspinner',
                                 expression: '(TOTALADM <= [value])',
                                 constraints: {min: 1, max: 99999, places: 0},
                                 defaultValue: 4000,
                                 width: 120
                             }
                         ],
 
                         title: 'Hospitals',
                         topicID: 'hospitalQuery',
                         gridOptions: {
                             columns: [
                                 {
                                     id: 'Action',
                                     field: 'OBJECTID',
                                     label: 'Action',
                                     width: 60,
                                     sortable: false,
                                     exportable: false,
                                     renderCell: function (object, value, node) {
                                         on(node, 'click', function () {
                                             alert('Do something exciting here like search for related records or edit the selected record.');
                                         });
                                         node.innerHTML = '<i class=\'fa fa-pencil\' style=\'margin-left:8px;\'></i>';
                                     }
                                 },
                                 {
                                     field: 'NAME',
                                     label: 'Name'
                                 },
                                 {
                                     field: 'ADDRESS',
                                     label: 'Address',
                                     width: 150
                                 },
                                 {
                                     field: 'CITY',
                                     label: 'City',
                                     width: 80
                                 },
                                 {
                                     field: 'STABREV',
                                     label: 'State',
                                     width: 50
                                 },
                                 {
                                     field: 'ZIPCODE',
                                     label: 'Zip Code',
                                     width: 100
                                 },
                                 {
                                     field: 'TOTALADM',
                                     label: 'Total Admission',
                                     width: 100
                                 },
                                 {
                                     field: 'LASTUPDATE',
                                     label: 'Last Update',
                                     width: 120,
                                     get: function (object) { // allow export as a proper date
                                         return getDateTime(object.LASTUPDATE);
                                     },
                                     formatter: 'dateTime'
                                 }
                             ],
                             sort: [
                                 {
                                     property: 'NAME',
                                     descending: 'ASC'
                                 }
                             ]
                         }
                     },
                     {
                         name: 'Police Stations',
                         queryParameters: {
                             type: 'table', // spatial, relationship, table or database
                             url: 'https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/PublicSafety/PublicSafetyOperationalLayers/MapServer/2',
                             outFields: ['*']
                         },
                         enableAdvancedSearch: false,
 
                         searchFields: [
                             {
                                 field: 'PDNAME',
                                 label: 'Station',
                                 expression: '(PDNAME = \'[value]\')',
                                 unique: true,
                                 includeBlankValue: true,
                                 width: 'calc(100% - 85px)'
                             },
                             {
                                 field: 'LASTUPDATE',
                                 label: 'Updated After',
                                 expression: '(LASTUPDATE >= date \'[value]\')',
                                 type: 'date',
                                 labelWidth: 110,
                                 width: 130
                             },
                             {
                                 field: 'LASTUPDATE',
                                 label: 'Updated Before',
                                 expression: '(LASTUPDATE <= date \'[value]\')',
                                 type: 'date',
                                 labelWidth: 110,
                                 width: 130
                             }
                         ],
 
                         title: 'Police Stations',
                         topicID: 'policeStationQuery',
                         gridOptions: {
                             columns: [
                                 {
                                     field: 'PDNAME',
                                     label: 'Name',
                                     width: 150
                                 },
                                 {
                                     field: 'ADDRESS',
                                     label: 'Address',
                                     width: 150
                                 },
                                 {
                                     field: 'PDTYPE',
                                     label: 'Type',
                                     width: 100
                                 },
                                 {
                                     field: 'PDFUNCTION',
                                     label: 'Function',
                                     width: 100
                                 },
                                 {
                                     field: 'LASTUPDATE',
                                     label: 'Last Update',
                                     width: 100,
                                     get: function (object) { // allow export as a proper date
                                         return new Date(object.LASTUPDATE);
                                     },
                                     formatter: 'dateTime'
                                 },
                                 {
                                     field: 'layerName',
                                     label: 'Layer',
                                     width: 100
                                 }
                             ],
                             sort: [
                                 {
                                     property: 'PDNAME',
                                     descending: 'ASC'
                                 }
                             ]
                         }
                     }
                 ]
             },
             */
            /*
            {
                name: 'خودپردازهای پارسا',
                findOptions: {
                    url: 'http://localhost:6080/arcgis/rest/services/parsaIranAtms_9802/MapServer',
                    layerIds: [0,1],
                    searchFields: ['کد_شعبه', 'کد_ترمينال']
                },
                infoTemplates: {
                    buffer: {
                        title: 'Search Buffer',
                        content: function (feature) {
                            if (feature.geometry) {
                                return number.format(geometryEngine.geodesicArea(feature.geometry, 'acres'), {
                                    places: 2
                                }) + ' Acres';
                            }
                            return '';
                        }
                    }
                },
                attributeSearches: [
                    {
                        name: '[جست و جوی خودپرداز بر اساس کد شعبه]',
                        searchFields: [
                            {
                                field: 'کد_شعبه',
                                label: 'کد شعبه',
                                //expression: '[value]%\')',
                                placeholder: 'کد شعبه',
                                //required: true,
                                minChars: 3,
                                height: 30,
                                width: 'calc(100% - 75px)'
                            },
                            {
                                field: 'کد_ترمينال',
                                label: 'کد ترمینال',
                                //expression: '[value]%\')',
                                placeholder: 'کد ترمینال',
                                //required: true,
                                minChars: 3,
                                height: 30,
                                width: 'calc(100% - 75px)'
                            },

                        ],

                        title: 'خودپردازهای پارسا',
                        topicID: 'findPublicSafetyQuery',
                        gridOptions: {
                            columns: [
                                {
                                    field: 'کد ترمينال',
                                    label: 'شماره ترمینال',
                                    width: 150
                                },
                                {
                                    field: 'نام دستگاه',
                                    label: 'نام دستگاه',
                                    width: 150
                                },
                                {
                                    field: 'کد شعبه',
                                    label: 'کد شعبه',
                                    width: 150
                                },
                                {
                                    field: 'تراکنش 1397/09',
                                    label: 'تراکنش ماه آذر',
                                    width: 150,
                                    // get: function (object) { // allow export as a proper date
                                    //     return new Date(object['Last Update Date']);
                                    // },
                                    // formatter: 'date'
                                },
                                {
                                    field: 'تراکنش 1397/10',
                                    label: 'تراکنش ماه دی',
                                    width: 150
                                },
                                {
                                    field: 'تراکنش 1397/11',
                                    label: 'تراکنش ماه بهمن',
                                    width: 150
                                },
                                {
                                    field: 'تراکنش 1397/12',
                                    label: 'تراکنش ماه اسفند',
                                    width: 150
                                },
                                {
                                    field: 'تراکنش 1398/01',
                                    label: 'تراکنش ماه فروردین',
                                    width: 150
                                },
                            ],
                            // sort: [
                            //     {
                            //         property: 'Name',
                            //         descending: false
                            //     }
                            // ]
                        }
                    }
                ]
            }
            */
        ]
    };
});