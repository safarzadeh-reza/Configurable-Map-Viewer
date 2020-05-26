define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/_base/Color',
    'dojo/dom', 
    'dojo/domReady!',
    'dojo/on',
    'dojo/topic',
    'dojo/text!./PointClustering/templates/PointClustering.html',
    'esri/layers/FeatureLayer',
    'esri/InfoTemplate',
    'dojo/_base/array',
    'dojo/dom-construct',
    'xstyle/css!./PointClustering/css/PointClustering.css',

    'esri/request',
    'esri/graphic',
    'esri/geometry/Extent',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/PictureMarkerSymbol',
    'esri/renderers/ClassBreaksRenderer',
    'esri/layers/GraphicsLayer',
    'esri/SpatialReference',
    'esri/dijit/PopupTemplate',
    'esri/geometry/Point',
    'esri/geometry/webMercatorUtils',

    './PointClustering/ClusterFeatureLayer'

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, Color, dom, ready,
    on, topic, Template, FeatureLayer, InfoTemplate, arrayUtils, domConstruct, css, esriRequest, graphic,
    Extent, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, PictureMarkerSymbol, ClassBreaksRenderer,
    GraphicsLayer, SpatialReference, PopupTemplate, Point, webMercatorUtils, ClusterFeatureLayer) 
{
    var clusterLayer;
    var popupOptions = {
        "markerSymbol": new SimpleMarkerSymbol("circle", 20, null, new Color([0, 0, 0, 0.25])),
        "marginLeft": "20",
        "marginTop": "20"
    };

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: Template,

        postCreate: function(){
            this.inherited(arguments);
            this.initClusterLayer(this.map);
        },

        initClusterLayer: function (map) {
            topic.subscribe('layerControl/clusterMap', function (r) {
                console.log(r.layer.url); //layer id
                console.log(r.subLayer.id); //array of set visible layer ids
                if (clusterLayer)
                    map.removeLayer(clusterLayer);

                var popupTemplate = PopupTemplate({
                    'title': '',
                    //content: this.formatter,
                    fieldInfos: [
                        {
                            fieldName: 'name',
                            label: 'نام',
                            visible: true
                        },
                    ],
                    /*,
                    'fieldInfos': [{
                        'fieldName': 'TRACTCE10',
                        'label': 'Tract: ',
                        visible: true
                    }, {
                        'fieldName': 'NAME10',
                        'label': 'Name: ',
                        visible: true
                    }]
                    */
                });

                clusterLayer = new ClusterFeatureLayer({
                    'url': r.layer.url + '/' + r.subLayer.id,
                    'distance': 100,
                    'id': 'clusters',
                    'labelColor': '#fff',
                    'resolution': map.extent.getWidth() / map.width,
                    'singleColor': '#888',
                    'singleTemplate': popupTemplate,
                    'useDefaultSymbol': true,
                    'objectIdField': 'OBJECTID' // define the objectid field
                });
                var picBaseUrl = 'http://192.168.100.96:8080/cmv/images';
                var defaultSym = new PictureMarkerSymbol(picBaseUrl + 'BluePin1LargeB.png', 32, 32).setOffset(0, 15);
                var renderer = new ClassBreaksRenderer(defaultSym, 'clusterCount');
                var sls = SimpleLineSymbol;
                var sms = SimpleMarkerSymbol;
                var small = new sms('circle', 20,
                            new sls(sls.STYLE_SOLID, new Color([255,191,0,0.25]), 15),
                            new Color([255,191,0,0.5]));
                var medium = new sms('circle', 30,
                                          new sls(sls.STYLE_SOLID, new Color([148,0,211,0.25]), 15),
                                          new Color([148,0,211,0.5]));
                var large = new sms('circle', 50,
                            new sls(sls.STYLE_SOLID, new Color([255,0,0,0.25]), 15),
                            new Color([255,0,0,0.5]));
                renderer.addBreak(2, 10, small);
                renderer.addBreak(10, 25, medium);
                renderer.addBreak(25, 5000, large);
                // Providing a ClassBreakRenderer is also optional
                //clusterLayer.setRenderer(renderer);
                map.addLayer(clusterLayer);
                // close the info window when the map is clicked
                map.on('click', cleanUp);
                // close the info window when esc is pressed
                map.on('key-down', function(e) {
                    if (e.keyCode === 27) {
                        cleanUp();
                    }
                });

                function cleanUp() {
                    map.infoWindow.hide();
                //clusterLayer.clearSingles();
                }
                function error(err) {
                    console.log('something failed: ', err);
                }
              // show cluster extents...
              // never called directly but useful from the console 
                window.showExtents = function() {
                    var extents = map.getLayer('clusterExtents');
                    if ( extents ) {
                        map.removeLayer(extents);
                    }
                    extents = new GraphicsLayer({ id: 'clusterExtents' });
                    var sym = new SimpleFillSymbol().setColor(new Color([205, 193, 197, 0.5]));
                    arrayUtils.forEach(clusterLayer._clusters, function(c, idx) {
                        var e = c.attributes.extent;
                        extents.add(new Graphic(new Extent(e[0], e[1], e[2], e[3], map.spatialReference), sym));
                    }, this);
                    map.addLayer(extents, 0);
                }


            });  

            topic.subscribe('layerControl/removeClusterMap', function (r) {
                if (clusterLayer)
                    map.removeLayer(clusterLayer);
            }); 
                    
        },
        formatter: function(identifyResults){

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
                        { value: 1, text: "تیر" },
                        { value: 2, text: "مرداد" },
                        { value: 3, text: "شهریور" }
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

    });
});