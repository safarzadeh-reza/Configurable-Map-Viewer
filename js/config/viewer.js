define([
    'esri/units',
    'esri/geometry/Extent',
    'esri/config',
    /*'esri/urlUtils',*/
    'esri/tasks/GeometryService',
    'esri/layers/ImageParameters',
    'gis/plugins/Google',
    'dojo/i18n!./nls/main',
    'dojo/topic',
    'dojo/sniff',
    "esri/SpatialReference",
    "esri/dijit/PopupTemplate",
    "esri/renderers/ClassBreaksRenderer",
    "esri/layers/GraphicsLayer",
    "esri/symbols/TextSymbol",
    "esri/Color",
    "esri/symbols/Font",
    "dojo/Deferred",
    "dijit/Dialog",
    "dijit/form/Form",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "esri/geometry/geometryEngine",
    "dojo/_base/array",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/graphic"

], function (units, Extent, esriConfig, /*urlUtils,*/ GeometryService, ImageParameters, GoogleMapsLoader, i18n, topic,
    has, SpatialReference, PopupTemplate, ClassBreaksRenderer, GraphicsLayer, TextSymbol, Color, Font, Deferred, Dialog,
    Form, TextBox, Button, geometryEngine, array, SimpleLineSymbol, SimpleFillSymbol, Graphic) {

    // url to your proxy page, must be on same machine hosting you app. See proxy folder for readme.
    //esriConfig.defaults.io.proxyUrl = 'http://localhost/proxy/proxy.php';
    //esriConfig.defaults.io.alwaysUseProxy = false;

    var baseURLIp;
    if (window.location.hostname == "172.16.0.14") {
        baseURLIp = "http://172.16.0.15";
    }
    else {
        baseURLIp = window.location.protocol + "//" + window.location.hostname;
    }

    esriConfig.defaults.io.corsEnabledServers.push("http://localhost:6080");
    esriConfig.defaults.io.corsEnabledServers.push("http://172.16.0.15:6080");
    this.user_group = this.document.getElementById("user_group").title;

    // add a proxy rule to force specific domain requests through proxy
    // be sure the domain is added in proxy.config
    /*urlUtils.addProxyRule({
        urlPrefix: 'localhost:6080',
        proxyUrl: 'proxy/proxy.ashx'
    });*/

    // url to your geometry server.
    esriConfig.defaults.geometryService = new GeometryService(baseURLIp + ':6080/arcgis/rest/services/Utilities/Geometry/GeometryServer');

    // Use your own Google Maps API Key.
    // https://developers.google.com/maps/documentation/javascript/get-api-key
    GoogleMapsLoader.KEY = 'NOT-A-REAL-API-KEY';

    // helper function returning ImageParameters for dynamic layers
    // example:
    // imageParameters: buildImageParameters({
    //     layerIds: [0],
    //     layerOption: 'show'
    // })
    function buildImageParameters(config) {
        config = config || {};
        var ip = new ImageParameters();
        //image parameters for dynamic services, set to png32 for higher quality exports
        ip.format = 'png32';
        for (var key in config) {
            if (config.hasOwnProperty(key)) {
                ip[key] = config[key];
            }
        }
        return ip;
    }

    //some example topics for listening to menu item clicks
    //these topics publish a simple message to the growler
    topic.subscribe('layerControl/toggleClustering', function (event) {
        if (event.layer.getMap().getLayer(event.layer.id + "Buffer")) {
            topic.publish('growler/growl', {
                title: 'خطا',
                message: 'فعال سازی همزمان خوشه بندی و شعاع پوشش در این نسخه امکان پذیر نیست'
            });
            return;
        }
        if (!event.layer.isFeatureReductionEnabled() | !event.layer.getFeatureReduction()) {

            topic.publish('growler/growl', {
                title: 'خوشه بندی',
                message: 'خوشه بندی برای لایه ' + event.layer.id + ' فعال خواهد شد'
            });

            if (!event.layer.getFeatureReduction()) {
                event.layer.setFeatureReduction({
                    type: "cluster"
                });
            } else {
                event.layer.enableFeatureReduction();
            }

            function drawClusterCounts(GL) {
                GL.clear();
                var graphics = event.layer.getAggregateGraphics();
                for (var i = 0; i < graphics.length; i++) {
                    var g = graphics[i];
                    var txtSym = new TextSymbol(g.attributes.cluster_count).setColor(new Color([0, 0, 0, 1])).setFont(new Font("10pt").setWeight(Font.WEIGHT_BOLDER).setFamily("B titr")).setVerticalAlignment("center").setHaloColor(new Color([255, 255, 255, 0.7])).setHaloSize(2.5);;
                    g.setSymbol(txtSym);
                    GL.add(g);
                }

                map = GL.getMap();
                var center = GL.getMap().extent.getCenter();
                map.centerAt(center);
                map.centerAt(center);

            }

            var GL = new GraphicsLayer({ id: event.layer.id + "Clus" });
            var map = event.layer.getMap();
            map.addLayer(GL);

            event.layer._clusterManager.on("renderer-change", function () {
                setTimeout(continueExecution2, 1000);
                function continueExecution2() {
                    var Gl = event.layer.getMap().getLayer(event.layer.id + "Clus");
                    drawClusterCounts(GL);
                }
            });

            topic.publish('growler/growl', {
                title: 'خوشه بندی',
                message: 'خوشه بندی برای لایه ' + event.layer.id + ' فعال شد'
            });


        } else {
            topic.publish('growler/growl', {
                title: 'خوشه بندی',
                message: 'خوشه بندی برای لایه ' + event.layer.id + ' غیرفعال خواهد شد'
            });

            event.layer.disableFeatureReduction();
            event.layer.getMap().removeLayer(event.layer.getMap().getLayer(event.layer.id + "Clus"));

            topic.publish('growler/growl', {
                title: 'خوشه بندی',
                message: 'خوشه بندی برای لایه ' + event.layer.id + ' غیرفعال شد'
            });
        }
    });

    topic.subscribe('layerControl/buffer', function (event) {

        if (event.layer.isFeatureReductionEnabled() && event.layer.getFeatureReduction()) {
            topic.publish('growler/growl', {
                title: 'خطا',
                message: 'فعال سازی همزمان خوشه بندی و شعاع پوشش در این نسخه امکان پذیر نیست'
            });
            return;
        }

        if (event.layer.getMap().getLayer(event.layer.id + "Buffer") == undefined) {
            var form = new Form();
            var txt = new TextBox({
                placeHolder: "مقدار شعاع پوشش (متر)"
            }).placeAt(form.containerNode);
            var btn = new Button({
                label: "نمایش"
            }).placeAt(form.containerNode);
            var dia = new Dialog({
                content: form,
                title: "شعاع پوشش"
            });
            form.startup();
            dia.show();

            btn.on("click", function () {
                dia.hide();
                var dist = txt.value;

                topic.publish('growler/growl', {
                    title: 'شعاع پوشش',
                    message: 'شعاع پوشش با مقدار ' + dist + ' متر برای لایه ' + event.layer.id + ' فعال خواهد شد'
                });

                var GL = new GraphicsLayer({ id: event.layer.id + "Buffer" });

                var symbol = new SimpleFillSymbol(
                    SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 0, 0, 0.5]), 2
                    ),
                    new Color([255, 0, 0, 0.45])
                );

                array.forEach(event.layer.graphics, function (gr) {
                    var buffer = geometryEngine.geodesicBuffer(gr.geometry, dist, "meters");
                    var graphic = new Graphic(buffer, symbol);
                    GL.add(graphic);
                });

                event.layer.getMap().addLayer(GL);

                topic.publish('growler/growl', {
                    title: 'شعاع پوشش',
                    message: 'شعاع پوشش با مقدار ' + dist + ' متر برای لایه ' + event.layer.id + ' فعال شد'
                });

            });

        } else {

            topic.publish('growler/growl', {
                title: 'شعاع پوشش',
                message: 'شعاع پوشش برای لایه ' + event.layer.id + ' غیرفعال خواهد شد'
            });

            event.layer.getMap().removeLayer(event.layer.getMap().getLayer(event.layer.id + "Buffer"));

            topic.publish('growler/growl', {
                title: 'شعاع پوشش',
                message: 'شعاع پوشش برای لایه ' + event.layer.id + ' غیرفعال شد'
            });

        }

    });

    topic.subscribe('layerControl/classify', function (event) {
        if (a == 1) {
            var form = new Form();
            var txt = new TextBox({
                placeHolder: "مقدار شعاع پوشش (متر)"
            }).placeAt(form.containerNode);
            var btn = new Button({
                label: "نمایش"
            }).placeAt(form.containerNode);
            var dia = new Dialog({
                content: form,
                title: "شعاع پوشش"
            });
            form.startup();
            dia.show();
        }
        else { }
    });

    this.widgets = {
        growler: {
            include: true,
            id: 'growler',
            type: 'domNode',
            path: 'gis/dijit/Growler',
            srcNodeRef: 'growlerDijit',
            options: {}
        },
        /*search: {
            include: true,
            type: has('phone') ? 'titlePane' : 'domNode',
            path: 'esri/dijit/Search',
            srcNodeRef: 'geocoderButton',
            title: i18n.viewer.widgets.search,
            iconClass: 'fa-search',
            position: 0,
            options: {
                map: true,
                visible: true,
                enableInfoWindow: false,
                enableButtonMode: has('phone') ? false : true,
                expanded: has('phone') ? true : false
            }
        },*/
        identify: {
            include: true,
            id: 'identify',
            //type: 'titlePane',
            type: 'invisible',
            path: 'gis/dijit/Identify',
            title: i18n.viewer.widgets.identify,
            iconClass: 'fa-info-circle',
            open: false,
            preload: true,
            position: 7,
            options: 'config/identify',
        },
        mapInfo: {
            include: true,
            id: 'mapInfo',
            type: 'domNode',
            path: 'gis/dijit/MapInfo',
            srcNodeRef: 'mapInfoDijit',
            options: {
                map: true,
                mode: 'dec',
                firstCoord: 'y',
                unitScale: 3,
                showScale: false,
                showZoom: false,
                xLabel: ' طول :  ',
                yLabel: ' عرض :  ',
                minWidth: 100
            }
        },
        scalebar: {
            include: true,
            id: 'scalebar',
            type: 'map',
            path: 'esri/dijit/Scalebar',
            options: {
                map: true,
                attachTo: 'top-right',
                scalebarStyle: 'line',
                scalebarUnit: 'dual'
            }
        },
        locateButton: {
            include: true,
            id: 'locateButton',
            type: 'domNode',
            path: 'gis/dijit/LocateButton',
            srcNodeRef: 'locateButton',
            options: {
                map: true,
                publishGPSPosition: true,
                highlightLocation: true,
                useTracking: true,
                geolocationOptions: {
                    maximumAge: 0,
                    timeout: 15000,
                    enableHighAccuracy: true
                }
            }
        },
        overviewMap: {
            include: has('phone') ? false : true,
            id: 'overviewMap',
            type: 'map',
            path: 'esri/dijit/OverviewMap',
            options: {
                map: true,
                attachTo: 'bottom-right',
                color: '#0000CC',
                height: 100,
                width: 125,
                opacity: 0.30,
                visible: false
            }
        },
        homeButton: {
            include: true,
            id: 'homeButton',
            type: 'domNode',
            path: 'esri/dijit/HomeButton',
            srcNodeRef: 'homeButton',
            options: {
                map: true,
                extent: new Extent({
                    xmin: -180,
                    ymin: -85,
                    xmax: 180,
                    ymax: 85,
                    spatialReference: {
                        wkid: 4326
                    }
                })
            }
        },
        legend: {
            include: true,
            id: 'legend',
            type: 'titlePane',
            path: 'gis/dijit/Legend',
            title: i18n.viewer.widgets.legend,
            iconClass: 'fa-picture-o',
            open: true,
            position: 1,
            options: {
                map: true,
                legendLayerInfos: true
            }
        },
        layerControl: {
            include: true,
            id: 'layerControl',
            type: 'titlePane',
            path: 'gis/dijit/LayerControl',
            title: i18n.viewer.widgets.layerControl,
            iconClass: 'fa-th-list',
            open: true,
            position: 0,
            options: {
                map: true,
                layerControlLayerInfos: true,
                separated: true,
                vectorReorder: true,
                overlayReorder: true,
                // create a custom menu entry in all of these feature types
                // the custom menu item will publish a topic when clicked
                // menu: {
                //     feature: [
                //         //     {
                //         //     topic: 'toggleClustering',
                //         //     iconClass: '',
                //         //     label: 'فعال/غیرفعال سازی خوشه بندی'
                //         // },
                //         // {
                //         //     topic: 'buffer',
                //         //     iconClass: '',
                //         //     label: 'نمایش / عدم نمایش شعاع پوشش'
                //         // }
                //         /*,{
                //     topic: 'classify',
                //     iconClass:'',
                //     label: 'فعال / غیرفعال سازی دسته بندی'
                // }*/],
                // dynamic: [{
                //     label: 'PointClustering',
                //     topic: 'clusterMap',
                //     iconClass: 'fa fa-search fa-fw'
                // },{
                //     label: 'Remove PointClustering',
                //     topic: 'removeClusterMap',
                //     iconClass: 'fa fa-search fa-fw'
                // }]
                // },
                //create a example sub layer menu that will
                //apply to all layers of type 'dynamic'
                /*subLayerMenu: {
                    dynamic: [{
                        topic: 'goodbye',
                        iconClass: 'fa fa-frown-o',
                        label: 'Say goodbye'
                    }]
                }*/
            }
        },
        /*bookmarks: {
            include: true,
            id: 'bookmarks',
            type: 'titlePane',
            path: 'gis/dijit/Bookmarks',
            title: i18n.viewer.widgets.bookmarks,
            iconClass: 'fa-bookmark',
            open: false,
            position: 4,
            options: 'config/bookmarks'
        },*/
        /*find: {
            include: true,
            id: 'find',
            type: 'titlePane',
            canFloat: true,
            path: 'gis/dijit/Find',
            title: i18n.viewer.widgets.find,
            iconClass: 'fa-search',
            open: false,
            position: 3,
            options: 'config/find'
        },*/
        search: {
            include: true,
            id: 'search',
            type: 'titlePane',
            path: 'gis/dijit/Search',
            iconClass: 'fa-search',
            canFloat: true,
            title: i18n.viewer.widgets.search,
            open: false,
            position: 3,
            options: 'config/searchWidget'
        },
        renderer: {
            include: true,
            id: 'renderer',
            type: 'titlePane',
            canFloat: false,
            path: 'gis/dijit/Renderer',
            title: i18n.viewer.widgets.renderer,
            iconClass: 'fa fa-pie-chart',
            open: false,
            position: 2,
            options: 'config/renderer'
        },

        weightedsum: {
            include: true,
            id: 'weightedsum',
            type: 'titlePane',
            canFloat: false,
            path: 'gis/dijit/WeightedSum',
            title: i18n.viewer.widgets.weightedSum,
            iconClass: 'fa fa-map-marker',
            open: false,
            position: 4,
            options: 'config/weightedsum'
        },

        /* draw: {
             include: true,
             id: 'draw',
             type: 'titlePane',
             canFloat: true,
             path: 'gis/dijit/Draw',
             title: i18n.viewer.widgets.draw,
             iconClass: 'fa-paint-brush',
             open: false,
             position: 4,
             options: {
                 map: true,
                 mapClickMode: true
             }
         },
         */
        /*measure: {
            include: true,
            id: 'measurement',
            type: 'titlePane',
            canFloat: true,
            path: 'gis/dijit/Measurement',
            title: i18n.viewer.widgets.measure,
            iconClass: 'fa-expand',
            open: false,
            position: 5,
            options: {
                map: true,
                mapClickMode: true,
                defaultAreaUnit: units.SQUARE_MILES,
                defaultLengthUnit: units.MILES
            }
        },*/

        eMeasure: {
            include: true,
            id: 'eMeasure',
            type: 'titlePane',
            position: 5,
            title: i18n.viewer.widgets.measure,
            iconClass: 'fa-expand',
            open: false,
            path: 'gis/dijit/Measure',
            options: {
                map: true,
                widgetManager: true,
                config: {
                    widgets: [
                        {
                            id: 'WABMeasure',
                            uri: 'jimu/BaseWidgetPanel',
                        }
                    ]
                }
            }
        },

        heatmap: {
            include: true,
            id: 'heatmap',
            type: 'titlePane',
            title: i18n.viewer.widgets.heatmap,
            iconClass: 'fas fa-fire',
            open: false,
            position: 6,
            path: 'gis/dijit/Heatmap',
            options: {
                map: true,
                layerControlLayerInfos: true
            }
        },

        introduction: {
            include: true,
            id: 'introduction',
            type: 'invisible',
            path: 'gis/dijit/Introduction',
            options: 'config/introductionWidget',
            position: 9,
        },

        print: {
            include: true,
            id: 'print',
            type: 'titlePane',
            canFloat: true,
            path: 'gis/dijit/Print',
            title: i18n.viewer.widgets.print,
            iconClass: 'fa-print',
            open: false,
            position: 8,
            options: {
                map: true,
                printTaskURL: baseURLIp + ':6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
                //copyrightText: 'حقوق این سامانه متعلق به شرکت پارسا می باشد',
                //authorText: 'Me',
                defaultTitle: i18n.viewer.titles.pageTitle,
                defaultFormat: 'JPG',
                defaultLayout: 'A4 Portrait'
            }
        },/*
        editor: {
            include: has('phone') ? false : true,
            id: 'editor',
            type: 'titlePane',
            path: 'gis/dijit/Editor',
            title: i18n.viewer.widgets.editor,
            iconClass: 'fa-pencil',
            open: false,
            position: 8,
            options: {
                map: true,
                mapClickMode: true,
                editorLayerInfos: true,
                settings: {
                    toolbarVisible: true,
                    showAttributesOnClick: true,
                    enableUndoRedo: true,
                    createOptions: {
                        polygonDrawTools: ['freehandpolygon', 'autocomplete']
                    },
                    toolbarOptions: {
                        reshapeVisible: true,
                        cutVisible: true,
                        mergeVisible: true
                    }
                }
            }
        },*/
        /*locale: {
            include: true,
            type: has('phone') ? 'titlePane' : 'domNode',
            id: 'locale',
            position: 0,
            srcNodeRef: 'geocodeDijit',
            path: 'gis/dijit/Locale',
            title: i18n.viewer.widgets.locale,
            iconClass: 'fas fa-fw fa-flag',
            options: {
                style: has('phone') ? null : 'margin-left: 30px;'
            }
        },*/
        help: {
            include: has('phone') ? false : true,
            id: 'help',
            type: 'floating',
            path: 'gis/dijit/Help',
            //title: i18n.viewer.widgets.help,
            //iconClass: 'fa-info-circle',
            // paneOptions: {
            //     draggable: false,
            //     html: '<a href="#"><i class="fa fa-fw fa-info-circle"></i>link</a>'.replace('link', i18n.viewer.widgets.help),
            //     domTarget: 'helpDijit',
            //     style: 'height:345px;width:450px;'
            // },
            // options: {}
        },
        attributesTable: {
            include: true,
            id: 'attributesContainer',
            type: 'domNode',
            srcNodeRef: 'attributesContainer',
            path: 'gis/dijit/AttributesTable',
            options: 'config/attributesTable'
        },

        exportDialog: {
            include: true,
            id: 'export',
            type: 'floating',
            path: 'gis/dijit/Export',
            title: 'خروجی',
            preload: true,
            options: {
                excel: true,
                xlsExcel: true,
                csv: true,
                shapefile: false,
                kml: true,
                kmz: true,
                geojson: true,
                topojson: true,
                wkt: false,
                defaultExportType: 'excel',
                // this option can be a string or a function that returns
                // a string.
                filename: function () {
                    var date = new Date();
                    return 'export_results_' + date.toLocaleDateString();
                }
            }
        },
        clusterMap: {
            include: true,
            id: 'clusterMap',
            type: 'invisible', //titlePane, invisible
            canFloat: true,
            title: '<i class="icon-large icon-road"></i>&nbsp;&nbsp;clusterMap',
            path: 'gis/dijit/PointClustering',
            position: 30,
            open: false,
            options: {
                map: true,
            }
        },
        messagebox: {
            include: true,
            id: 'messagebox',
            type: 'invisible',
            path: 'gis/dijit/MessageBox',
            options: {
                //nameSpace: 'app' // optional namespace
            }
        },
        // timesliderTool: {
        //     include: true,
        //     id: 'timesliderTool',
        //     type: 'domNode',
        //     srcNodeRef: 'timeButton',
        //     path: 'gis/dijit/TimeSlider',
        //     title: 'مدیریت زمان',
        //     options: {
        //         map: true,
        //         mapRightClickMenu: false,
        //         mapClickMode: true
        //     }
        // }


    }

    return {
        // used for debugging your app
        isDebug: true,

        //default mapClick mode, mapClickMode lets widgets know what mode the map is in to avoid multipult map click actions from taking place (ie identify while drawing).
        defaultMapClickMode: 'identify',
        // map options, passed to map constructor. see: https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1
        mapOptions: {
            //basemap: 'streets',
            navigationMode: 'classic',
            center: [53.28418, 32.694866],
            zoom: 6,
            sliderStyle: 'small',
            maxZoom: 20
        },

        //webMapId: 'ef9c7fbda731474d98647bebb4b33c20',  // High Cost Mortgage
        // webMapOptions: {},

        panes: {
            // 	left: {
            // 		splitter: true
            // 	},
            // 	right: {
            // 		id: 'sidebarRight',
            // 		placeAt: 'outer',
            // 		region: 'right',
            // 		splitter: true,
            // 		collapsible: true
            // 	},
            bottom: {
                id: 'sidebarBottom',
                placeAt: 'outer',
                splitter: true,
                collapsible: true,
                region: 'bottom',
                style: 'height:200px;',
                content: '<div id="attributesContainer"></div>',
                //open: false
            },
            // top: {
            // 	id: 'sidebarTop',
            // 	placeAt: 'outer',
            // 	collapsible: true,
            // 	splitter: true,
            //     region: 'top',
            //     // style: 'height:300px;display:block;',
            //     content: '<div id="timeSlider"></div>'
            // }
        },
        // collapseButtonsPane: 'center', //center or outer

        // custom titles
        titles: {
            header: i18n.viewer.titles.header,
            subHeader: i18n.viewer.titles.subHeader,
            pageTitle: i18n.viewer.titles.pageTitle
        },

        layout: {
            /*  possible options for sidebar layout:
                    true - always use mobile sidebar, false - never use mobile sidebar,
                    'mobile' - use sidebar for phones and tablets, 'phone' - use sidebar for phones,
                    'touch' - use sidebar for all touch devices, 'tablet' - use sidebar for tablets only (not sure why you'd do this?),
                    other feature detection supported by dojo/sniff and dojo/has- http://dojotoolkit.org/reference-guide/1.10/dojo/sniff.html
 
                default value is 'phone'
            */
            //sidebar: 'phone'
        },

        // user-defined layer types
        /*
        layerTypes: {
            myCustomLayer: 'widgets/MyCustomLayer'
        },
        */

        // user-defined widget types
        /*
        widgetTypes: [
            'myWidgetType'
        ],
        */

        // operationalLayers: Array of Layers to load on top of the basemap: valid 'type' options: 'dynamic', 'tiled', 'feature'.
        // The 'options' object is passed as the layers options for constructor. Title will be used in the legend only. id's must be unique and have no spaces.
        // 3 'mode' options: MODE_SNAPSHOT = 0, MODE_ONDEMAND = 1, MODE_SELECTION = 2
        operationalLayers: [
            /*
            {
                type: 'feature',
                url: baseURLIp + ':6080/arcgis/rest/services/ParsaAtms/FeatureServer/0',
                title: "خودپردازهای پارسا",
                options: {
                    id: 'parsaUiRIranATMs',
                    opacity: 1.0,
                    visible: true,
                    outFields: ["*"],
                    

                },
                identifyLayerInfos: {
                    layerIds: [0]
                },

                layerControlLayerInfos: {
                    expanded: false,
                    layerIds: [0],
                    layerGroup: "دستگاه های خودپرداز",
                    metadataUrl: false,
                    menu: [
                        {
                            topic: 'buffer',
                            iconClass: '',
                            label: 'نمایش / عدم نمایش شعاع پوشش'
                        },
                        {
                            topic: 'toggleClustering',
                            iconClass: '',
                            label: 'فعال/غیرفعال سازی خوشه بندی'
                        },
                    ]
                },
                legendLayerInfos: {
                    exclude: false,
                    layerInfo: {
                        title: "خودپردازهای پارسا",
                        //hideLayers: [1]
                    }
                }
            },
            */
            {
                type: 'feature',
                url: baseURLIp + ':6080/arcgis/rest/services/Nursing/FeatureServer/0',
                title: "دسته بندی دستگاه های خودپرداز تهران",
                options: {
                    id: 'parsaATMs',
                    opacity: 1.0,
                    visible: true,
                    outFields: ["*"],
                    /*featureReduction: {
                        type: "cluster",
                    }*/

                },
                identifyLayerInfos: {
                    layerIds: [0]
                },

                layerControlLayerInfos: {
                    expanded: false,
                    layerIds: [0],
                    layerGroup: "دستگاه های خودپرداز",
                    metadataUrl: true,
                    menu: [
                        {
                            topic: 'buffer',
                            iconClass: '',
                            label: 'نمایش / عدم نمایش شعاع پوشش'
                        },
                        {
                            topic: 'toggleClustering',
                            iconClass: '',
                            label: 'فعال/غیرفعال سازی خوشه بندی'
                        },
                    ],
                },
                legendLayerInfos: {
                    exclude: false,
                    layerInfo: {
                        title: "دسته بندی دستگاه های خودپرداز تهران",
                        //hideLayers: [1]
                    }
                }
            },
            {
                type: 'feature',
                url: baseURLIp + ':6080/arcgis/rest/services/ParsaAtms/FeatureServer/0',
                title: "خودپردازهای پارسا",
                options: {
                    id: 'parsaIRIranAtms',
                    opacity: 1.0,
                    visible: true,
                    outFields: ["*"],
                    // featureReduction: {
                    //     type: "cluster",
                    // }

                },
                identifyLayerInfos: {
                    layerIds: [0]
                },
                layerControlLayerInfos: {
                    expanded: false,
                    layerIds: [0],
                    layerGroup: "دستگاه های خودپرداز",
                    metadataUrl: false,
                    menu: [
                        {
                            topic: 'buffer',
                            iconClass: '',
                            label: 'نمایش / عدم نمایش شعاع پوشش'
                        },
                        // {
                        //     topic: 'toggleClustering',
                        //     iconClass: '',
                        //     label: 'فعال/غیرفعال سازی خوشه بندی'
                        // },
                        //     {
                        //     label: 'خوشه بندی',
                        //     topic: 'clusterMap',
                        //     iconClass: 'fa fa-search fa-fw'
                        // }, {
                        //     label: 'حذف خوشه بندی',
                        //     topic: 'removeClusterMap',
                        //     iconClass: 'fa fa-search fa-fw'
                        // }
                    ]
                },
                legendLayerInfos: {
                    exclude: false,
                    layerInfo: {
                        title: "خودپردازهای پارسا",
                        //hideLayers: [1]
                    }
                }
            },

            // {
            //     type: 'feature',
            //     url: baseURLIp + ':6080/arcgis/rest/services/Test_for_Timeslider/FeatureServer/0',
            //     title: " خودپردازهای زمانمند پارسا",
            //     options: {
            //         id: 'parsaTimeAware',
            //         opacity: 1.0,
            //         visible: true,
            //         outFields: ["*"],
            //         // featureReduction: {
            //         //     type: "cluster",
            //         // }

            //     },
            //     identifyLayerInfos: {
            //         layerIds: [0]
            //     },
            //     layerControlLayerInfos: {
            //         expanded: false,
            //         layerIds: [0],
            //         layerGroup: "دستگاه های خودپرداز",
            //         metadataUrl: false,
            //     },
            //     legendLayerInfos: {
            //         exclude: false,
            //         layerInfo: {
            //             title: "خودپردازهای زمانمند پارسا",
            //             //hideLayers: [1]
            //         }
            //     }
            // },
            {
                type: 'dynamic',
                url: baseURLIp + ':6080/arcgis/rest/services/allIranAtms_new/MapServer',
                title: "خودپردازهای کل کشور",
                options: {
                    id: 'allIranAtms_new',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: buildImageParameters({
                        layerIds: [0],
                        layerOption: 'show'
                    })
                    //outFields: ["name", "vicinity"],
                    //mode: 1,
                },
                identifyLayerInfos: {
                    layerIds: [0]
                },
                layerControlLayerInfos: {
                    layerGroup: "دستگاه های خودپرداز",
                    expanded: false,
                    layerIds: [0],
                    metadataUrl: false,
                },
                legendLayerInfos: {
                    exclude: false,
                    layerInfo: {
                        title: "خودپردازهای سایر بانک ها",
                    }
                }
            },
            {
                type: 'dynamic',
                url: baseURLIp + ':6080/arcgis/rest/services/POIs/Iran_POI/MapServer',
                title: "عوارض مکانی کل کشور",
                options: {
                    id: 'iran_POIs',
                    opacity: 1.0,
                    visible: false,
                    maxScale: 0,
                    //minScale:9027.977411,
                    imageParameters: buildImageParameters({
                        layerIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
                        layerOption: 'show'
                    }),

                },
                identifyLayerInfos: {
                    layerIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
                    outFields: ["name", "vicinity"],

                },
                layerControlLayerInfos: {
                    expanded: false,
                    //layerIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
                    metadataUrl: false,
                    /*menu: [{
                        label: 'PointClustering',
                        topic: 'clusterMap',
                        iconClass: 'fa fa-search fa-fw'
                    },{
                        label: 'Remove PointClustering',
                        topic: 'removeClusterMap',
                        iconClass: 'fa fa-search fa-fw'
                    }],
                    subLayerMenu:[{
                        label: 'PointClustering',
                        topic: 'clusterMap',
                        iconClass: 'fa fa-search fa-fw'
                    },{
                        label: 'Remove PointClustering',
                        topic: 'removeClusterMap',
                        iconClass: 'fa fa-search fa-fw'
                    }]*/
                },
                legendLayerInfos: {
                    exclude: false,
                    layerInfo: {
                        title: "عوارض مکانی",
                    }
                }
            },
            /*
            {
                type: 'dynamic',
                url: baseURLIp + ':6080/arcgis/rest/services/POIs/Hamedan_POI/MapServer',
                title: "همدان",
                options: {
                    id: 'ّhamedanPOI',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: buildImageParameters({
                        layerIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
                        layerOption: 'show'
                    })
                },
                identifyLayerInfos: {
                    //layerIds:[]
                    layerIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
                },
                layerControlLayerInfos: {
                    layerGroup: "عوارض مکانی",
                    expanded: false,
                    layerIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
                },
                legendLayerInfos: {
                    exclude: false,
                    layerInfo: {
                        title: "عوارض مکانی همدان",
                        //hideLayers: [0]
                    }
                }
            },
            */
            {
                type: 'dynamic',
                url: baseURLIp + ':6080/arcgis/rest/services/Suitibility_Maps/AllCities_Suitability/MapServer',
                title: "نقشه های مطلوبیت شهرها",
                options: {
                    id: 'ّallCities_Suit',
                    opacity: 1.0,
                    visible: true,
                    imageParameters: buildImageParameters({
                        //layerIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
                        layerIds: [27],
                        layerOption: 'show'
                    })
                },
                identifyLayerInfos: {
                    // layerIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
                    layerIds: [27],
                },
                layerControlLayerInfos: {
                    expanded: false,
                    layerIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
                },
                legendLayerInfos: {
                    exclude: false,
                    layerInfo: {
                        title: "نقشه های مطلوبیت",
                        //hideLayers: [0]
                    }
                }
            },
            /*{
                type: 'dynamic',
                url: baseURLIp + ':6080/arcgis/rest/services/Suitibility_Maps/Tehran_suitibility/MapServer',
                title: "تهران",
                options: {
                    id: 'tehran_suit',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: buildImageParameters({
                        layerIds: [0],
                        layerOption: 'show'
                    })
                },
                identifyLayerInfos: {
                    layerIds: [0]
                },
                layerControlLayerInfos: {
                    expanded: false,
                    layerIds: [0],
                    layerGroup: "نقشه های مطلوبیت شهرها",
                },
                legendLayerInfos: {
                    exclude: false,
                    layerInfo: {
                        title: "نقشه مطلوبیت شهر تهران",
                        //hideLayers: [0]
                    }
                }
            },
            */
            {
                type: 'dynamic',
                url: baseURLIp + ':6080/arcgis/rest/services/population/MapServer',
                title: "جمعیت",
                options: {
                    id: 'population',
                    opacity: 1.0,
                    visible: false,
                    imageParameters: buildImageParameters({
                        layerIds: [0],
                        layerOption: 'show'
                    })
                },
                identifyLayerInfos: {
                    layerIds: [0]
                },
                layerControlLayerInfos: {
                    noLegend: false,
                    noZoom: false,
                    noTransparency: false,
                    swipe: false,
                    sublayers: true,
                    expanded: false,
                    layerIds: [0]
                },
                legendLayerInfos: {
                    exclude: false,
                    layerInfo: {
                        title: "جمعیت",
                        //hideLayers: [0]
                    }
                }
            },
            // {
            //     type: 'dynamic',
            //     url: baseURLIp + ':6080/arcgis/rest/services/HeatMap_Slider/MapServer',
            //     title: "HeatMap",
            //     options: {
            //         id: 'HeatMap',
            //         opacity: 1.0,
            //         visible: false,
            //         imageParameters: buildImageParameters({
            //             layerIds: [3],
            //             layerOption: 'show'
            //         })
            //     },
            //     identifyLayerInfos: {
            //         layerIds: [3]
            //     },
            //     layerControlLayerInfos: {
            //         noLegend: false,
            //         noZoom: false,
            //         noTransparency: false,
            //         swipe: false,
            //         sublayers: true,
            //         expanded: false,
            //         layerIds: [3]
            //     },
            //     legendLayerInfos: {
            //         exclude: false,
            //         layerInfo: {
            //             title: "HeatMap",
            //             //hideLayers: [0]
            //         }
            //     }
            // },
            {
                type: "webtiled",
                url: 'http://172.16.0.14:8080/basemaps/GSM/index.php?col=${col}&row=${row}&level=${level}',
                //url: "http://localhost:8080/basemaps/gmm/gm_${col}_${row}_${level}.png",
                title: "نقشه پایه آفلاین",
                options: {
                    id: "offlineGoogleMap",
                    /*initialExtent: new Extent(5622914.998585167, 3803917.178743637, 6060826.535480649,
                    3915941.0602750396, new SpatialReference({ wkid: 102100 })),
                    fullExtent: new Extent(5665302.7217034185, 3684842.843129839, 6018438.812362398,
                    3915941.0602750396, new SpatialReference({ wkid: 102100 })),*/
                    //copyright: '<a href="http://www.parsa-cit.com/" target="_blank">حقوق متعلق به شرکت پردازش الکترونیک راشد سامانه (پارسا)</a>'
                    copyright: '<a href="http://www.parsa-cit.com/" target="_blank">شرکت پردازش الکترونیک راشد سامانه (پارسا)</a>'
                }/*,
            legendLayerInfos: {
                exclude: true
            }*/
            },
            {
                type: "webtiled",
                url: "http://${subDomain}.google.com/vt/lyrs=m@221097413,traffic&hl=fa&z=${level}&x=${col}&y=${row}",
                title: "نقشه پایه آنلاین",
                options: {
                    id: "GoogleMap",
                    subDomains: ["mt0", "mt1", "mt2", "mt3", "mts0", "mts1", "mts2", "mts3"],
                    //initialExtent: new Extent(minX,minY,maxX,maxY,new SpatialReference({ wkid: 102100 })),
                    //fullExtent: new Extent(minX,minY,maxX,maxY,new SpatialReference({ wkid: 102100 })),
                    //copyright: 'Maps &copy; <a href="http://www.parsa-cit.com/" target="_blank">شرکت پارسا</a>'
                },
                legendLayerInfos: {
                    exclude: true
                }
            },
        ],
        // set include:true to load. For titlePane type set position the the desired order in the sidebar
        widgets: this.widgets
    };
});
