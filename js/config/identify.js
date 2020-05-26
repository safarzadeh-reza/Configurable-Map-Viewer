define([
    'dojo/i18n!./nls/main',
    'dojo/_base/lang',
    'dojo/number',
    'dojo/_base/array',
    'dojo/dom-construct',
    "dojo/dom",
    'dijit/layout/TabContainer',
    'dijit/layout/ContentPane',
    "dojox/charting/Chart",
    "dojox/charting/themes/Dollar",
    "dojox/charting/themes/Tom",
    "dojox/charting/themes/Julie",
    "dojox/charting/themes/PurpleRain",
    "dojox/charting/action2d/Tooltip",
    "dojox/charting/widget/Legend",
    "dojox/charting/action2d/Magnify",
    "dojox/charting/plot2d/Lines",
    "dojox/charting/plot2d/Markers",
    "dojox/charting/plot2d/StackedColumns",
    "dojox/charting/axis2d/Default",
    "dojo/fx/easing",
    "dojox/date/persian/Date",
    "dojox/date/persian/locale",
    "gis/dijit/Identify/Formatters",
    "dojo/parser",
    "dijit/Calendar",
    "dijit/form/DateTextBox",
    "dojo/domReady!",

], function (i18n, lang, number, array, domConstruct, dom, TabContainer, ContentPane, Chart, Dollar, Tom, Julie, PurpleRain,
    Tooltip, Legend, Magnify, Lines, Markers, StackedColumns, Default, easing, Date, locale, Formatters, parser, Calendar, DateTextBox) {

    var linkTemplate = '<a href="{url}" target="_blank">{text}</a>';
    function directionsFormatter(noValue, attributes) {
        return lang.replace(linkTemplate, {
            url: 'https://www.google.com/maps/dir/' + attributes.Address + ' Louisville, KY',
            text: 'Get Directions'
        });
    };

    var formatters = {
        charting: function (identifyResults) {
            var fieldInfos = identifyResults.infoTemplate.info.fieldInfos;
            var attributes = identifyResults.attributes;
            var mediaInfos = identifyResults.infoTemplate.info.mediaInfos;
            var html = domConstruct.create("div", { id: "infoNode", });
            var infoTable = domConstruct.create("div", { innerHTML: '<div class="title"">' + identifyResults.infoTemplate.info.title + '</div><hr>' }, html);
            var table = domConstruct.create("table", { class: "attrTable" }, infoTable);
            array.forEach(fieldInfos, function (info) {
                if (info.visible === true) {
                    var tr = domConstruct.create("tr", { valign: "top" }, table);
                    domConstruct.create("td", { class: "attrName", innerHTML: info.label }, tr);
                    if (info.format) {
                        var num = number.format(attributes[info.fieldName], { digitSeparator: info.format.digitSeparator, places: info.format.places });
                        domConstruct.create("td", { class: "attrValue", innerHTML: num }, tr);
                    }
                    else {
                        domConstruct.create("td", { class: "attrValue", innerHTML: attributes[info.fieldName] }, tr);
                    }
                }
            });
            var tableEnd = domConstruct.create("div", { innerHTML: '<br><div>' + mediaInfos.caption + '</div>' }, html);

            var chartNode = domConstruct.create("div", { id: "chartNode", class: "chartNode" }, html, "last");
            var chartData = [];
            var chartData2 = [];
            //var chartData3 = [];
            array.forEach(mediaInfos.value.fields_1, function (mediaInfo) {
                // var num = number.format(attributes[mediaInfo], {digitSeparator: true});
                // chartData.push(num);
                chartData.push(attributes[mediaInfo]);
            });
            array.forEach(mediaInfos.value.fields_2, function (mediaInfo) {
                chartData2.push(attributes[mediaInfo]);
            });

            // array.forEach(mediaInfos.value.fields_3, function(mediaInfo){
            //     chartData3.push(attributes[mediaInfo]/3);
            // });

            var chart = new Chart(chartNode);

            // Set the chart theme

            chart.setTheme(PurpleRain);
            // Add the only/default plot
            // chart.addPlot("line_plot", {
            //     type: "Lines",
            //     lines: true,
            //     areas: true,
            //     markers: false,
            // });
            chart.addPlot("default", {
                type: "StackedColumns",
                markers: true,
                // gap: 5,
                minBarSize: 20,
                maxBarSize: 60,
                animate: { duration: 1500}
            });

            //Finding Months

            var monthes = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]
            var today = new Date();
            //console.log(today);
            //onsole.log(locale.getNames("months", "wide"));
            var formatted = locale.format(today, {
                selector: "date",
                datePattern: "MM"
            });
            var num = number.parse(formatted);

            // Add axes

            chart.addAxis("x", {
                fixLower: "minor", fixUpper: "minor", minorTicks: false, labels: [
                    { value: 1, text: "سه ماه قبل" },
                    { value: 2, text: "دو ماه قبل" },
                    { value: 3, text: "ماه قبل" }
                    // { value: 1, text: monthes[num-2]},
                    // { value: 2, text: monthes[num-2]},
                    // { value: 3, text: monthes[num-3]}
                ],
            });
            chart.addAxis("y", { vertical: true, fixLower: "minor", fixUpper: "minor", min: 0, minorTicks: true });
            // Add the series of data
            chart.addSeries("تراکنش موفق", chartData, { plot: "default", fill: "#06c94e", stroke: { color: "#32822e", width: 1.5 } });
            chart.addSeries("تراکنش ناموفق", chartData2, { plot: "default", fill: "#c9063d", stroke: { color: "#8a1313", width: 1.5 } });
            //chart.addSeries("مجموع تراکنش سه ماه", chartData3, {plot: "line_plot"});
            console.log(chart)
            // Create the tooltip
            var tip = new Tooltip(chart, "default");
            //var tip2 = new Tooltip(chart, "line_plot");

            // Create the magnifier
            // var mag = new Magnify(chart,"default");
            // var action = new Magnify(
            //     chart, 
            //     "default", 
            //     {
            //         duration: 200,
            //         scale: 1.8
            //     }
            // );  

            // Render the chart!
            chart.render();
            var legend = domConstruct.create("div", { id: "legend" }, chartNode, "last")
            var legend = new Legend({ chart: chart }, legend);

            return html
        },
        /*attributeList: function (identifyResults) {

            // var listItem = '<li>{0}: {1}</li>';
            // var html = ['<ul>'];
            // for (var a in identifyResults.attributes) {
            //     //make sure a is an own property
            //     if (identifyResults.attributes.hasOwnProperty(a)) {
            //         html.push(lang.replace(listItem, [a, identifyResults.attributes[a]]));
            //     }
            // }
            // html.push('</ul>');
            // console.log(html)

            var listItem =
                '<tr valign="top"><td class="attrName">{0} :</td><td class="attrValue">{1}</td></tr>';
            var html = ['<div><table class="attrTable">'];
            for (var a in identifyResults.attributes) {
                //make sure a is an own property
                if (identifyResults.attributes.hasOwnProperty(a)) {
                    html.push(lang.replace(listItem, [a, identifyResults.attributes[a]]));
                }
            }
            html.push('</table></div>');
            return html;
        },
        tabContainer: function (identifyResults) {
            var att = identifyResults;
            var container = new TabContainer({
                style: 'height: 100%; width: 100%;',
                useMenu: false,
                useSlider: false
            });
            container.addChild(new ContentPane({
                title: 'اطلاعات',
                // content: [
                //     '<table class="attrTable">',
                //         '<tr valign="top">',
                //             '<td class="attrName">شماره دسته :</td>',
                //             '<td class="attrValue">'+identifyResults.attributes["Class value"]+'</td>',
                //         '</tr>',
                //         '<tr valign="top">',
                //             '<td class="attrName">جمعیت :</td>',
                //             '<td class="attrValue">'+identifyResults.attributes["Pixel Value"]+'</td>',
                //         '</tr>',
                //     '</table>'
                // ].join('')
                //content: formatters.attributeList(att).join(''),  
            }));
            container.addChild(new ContentPane({
                title: 'نمودار',
                content: formatters.charting(),
            }));
            return container.domNode;
        }*/
    };


    return {
        map: true,
        mapClickMode: true,
        mapRightClickMenu: true,
        identifyLayerInfos: true,
        identifyTolerance: 5,
        draggable: true,

        // config object definition:
        //  {<layer id>:{
        //      <sub layer number>:{
        //          <pop-up definition, see link below>
        //          }
        //      },
        //  <layer id>:{
        //      <sub layer number>:{
        //          <pop-up definition, see link below>
        //          }
        //      }
        //  }

        // for details on pop-up definition see: https://developers.arcgis.com/javascript/jshelp/intro_popuptemplate.html

        identifies: {

            population: {
                0: {
                        title:"جمعیت",
                        fieldInfos: [{
                            fieldName: 'Class value',
                            label: 'شماره دسته',
                            visible: true
                        },{
                            fieldName: 'Pixel Value',
                            label: 'جمعیت ساکن',
                            visible: true
                        }]

                       // title: 'Pole',
                        //content: formatters.tabContainer
                    
                },
            },
            parsaIRIranAtms: {
                0: {
                    title: "خودپردازهای پارسا",
                    content: formatters.charting,
                    fieldInfos: [
                        {
                            fieldName: 'Terminal_ID',
                            label: 'شماره ترمینال',
                            visible: true
                        },
                        {
                            fieldName: 'Branch_Name',
                            label: 'نام دستگاه',
                            visible: true
                        },
                        {
                            fieldName: 'Branch_Code',
                            label: 'کد شعبه',
                            visible: true
                        },
                        {
                            fieldName: 'Lag1MonthSucess',
                            label: 'مجموع تراکنش موفق ماه قبل',
                            //visible: true
                            format: { places: 0, digitSeparator: true },
                        },
                        {
                            fieldName: 'Lag1MonthFail',
                            label: 'مجموع تراکنش ناموفق ماه قبل ',
                            //visible: true
                            format: { places: 0, digitSeparator: true },
                        },
                        {
                            fieldName: 'Lag1MonthTotal',
                            label: 'مجموع تراکنش ماه قبل',
                            //visible: true
                            format: { places: 0, digitSeparator: true },
                        },
                        {
                            fieldName: 'Lag2MonthSucess',
                            label: 'مجموع تراکنش موفق 2 ماه قبل',
                            //visible: true
                            format: { places: 0, digitSeparator: true },
                        },
                        {
                            fieldName: 'Lag2MonthFail',
                            label: 'مجموع تراکنش ناموفق 2 ماه قبل',
                            //visible: true
                            format: { places: 0, digitSeparator: true },
                        },
                        {
                            fieldName: 'Lag2MonthTotal',
                            label: 'مجموع تراکنش 2 ماه قبل',
                            //visible: true
                            format: { places: 0, digitSeparator: true },
                        },
                        {
                            fieldName: 'Lag3MonthSucess',
                            label: 'مجموع تراکنش موفق 3 ماه قبل',
                            //visible: true,
                            format: { places: 0, digitSeparator: true },
                        },
                        {
                            fieldName: 'Lag3MonthFail',
                            label: 'مجموع تراکنش ناموفق 3 ماه قبل',
                            //visible: true,
                            format: { places: 0, digitSeparator: true },
                        },
                        {
                            fieldName: 'Lag3MonthTotal',
                            label: 'مجموع تراکنش 3 ماه قبل',
                            //visible: true,
                            format: { places: 0, digitSeparator: true },
                        },
                        {
                            fieldName: 'total_success',
                            label: 'مجموع کل تراکنش موفق 3 ماه',
                            visible: true,
                            format: { places: 0, digitSeparator: true },
                        },
                        {
                            fieldName: 'total_fail',
                            label: 'مجموع کل تراکنش ناموفق 3 ماه',
                            visible: true,
                            format: { places: 0, digitSeparator: true },
                        },
                        {
                            fieldName: 'total',
                            label: 'مجموع کل تراکنش 3 ماه',
                            visible: true,
                            format: { places: 0, digitSeparator: true },
                        },
                        {
                            fieldName: 'fail_percent',
                            label: 'درصد تراکنش ناموفق 3 ماه',
                            visible: true,
                            format: { places: 0, digitSeparator: true },
                        },
                        {
                            fieldName: 'ExistData',
                            label: 'تعداد روزهاي فعال',
                            visible: true,
                            format: { places: 0, digitSeparator: true },
                        },
                        {
                            fieldName: 'ActiveLenght',
                            label: 'تعداد روزهاي استقرار',
                            visible: true,
                            format: { places: 0, digitSeparator: true },
                        },
                    ],
                    mediaInfos: {
                        caption: "نمودار مجموع تراکنش های ماهانه 3 ماه گذشته (ریال)",
                        type: "columnchart",
                        //rotation: 30,
                        value: {
                            fields_1: ["Lag3MonthSucess", "Lag2MonthSucess", "Lag1MonthSucess"],
                            fields_2: ["Lag3MonthFail", "Lag2MonthFail", "Lag1MonthFail"],
                            fields_3: ["sum_success", "sum_success", "sum_success"],
                            theme: "Julie",
                        },
                    },
                }
            },
            /*
            parsaUiRIranATMs: {
                0: {
                    title: "خودپردازهای غیر فعال پارسا",
                    fieldInfos: [
                        {
                            fieldName: 'Terminal_id',
                            label: 'شماره ترمینال',
                            visible: true
                        },
                        {
                            fieldName: 'name',
                            label: 'نام دستگاه',
                            visible: true
                        },
                        // {
                        //     fieldName: 'CreatedBy',
                        //     label: 'ثبت کننده',
                        //     visible: true
                        // },
                        {
                            fieldName: 'Latitude',
                            label: 'عرض جغرافیایی',
                            visible: true
                        },
                        {
                            fieldName: 'Longitude',
                            label: 'طول جغرافیایی',
                            visible: true
                        },
                        {
                            fieldName: 'accuracy',
                            label: 'خطای ثبت (متر)',
                            visible: true
                        }
                    ]
                }
            },
            allIranATMs:{
                0:{
                    title:"بانک ها و خودپردازهای کل کشور",
                    fieldInfos: [
                        {
                            fieldName: 'Name',
                            label: 'نام دستگاه',
                            visible: true
                        },
                        {
                            fieldName: 'Snippet',
                            label: 'شهر و محله',
                            visible: true
                        }
                    ]
                }
            },*/
            allIranAtms_new: {
                0: {
                    title: "بانک ها و خودپردازهای کل کشور",
                    fieldInfos: [
                        {
                            fieldName: 'name',
                            label: 'نام دستگاه',
                            visible: true
                        },
                        {
                            fieldName: 'vicinity',
                            label: 'شهر و محله',
                            visible: true
                        }
                    ]
                }
            },
            iran_POIs: {
                    title: "عوارض مکانی کل کشور",
                    fieldInfos: [
                        {
                            fieldName: 'name',
                            label: 'نام عارضه',
                            visible: true
                        },
                        {
                            fieldName: 'vicinity',
                            label: 'شهر و محله',
                            visible: true
                        }
                    ]
            },
            tehran_suit: {
                0: {
                        title:"مطلوبیت شهر تهران",
                        fieldInfos: [{
                            fieldName: 'Stretched value',
                            label: 'شماره دسته',
                            visible: true
                        },{
                            fieldName: 'Pixel Value',
                            label: 'مقدار مطلوبیت',
                            visible: true
                        }]
                    
                },
            },
        }
    };
});
