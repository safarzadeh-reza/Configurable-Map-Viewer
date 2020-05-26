define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/dom-construct',
    'dojo/_base/lang',
    'dojo/aspect',
    'dojo/_base/array',
    "dojo/number",
    'dijit/form/FilteringSelect',
    'dojo/store/Memory',
    'esri/renderers/UniqueValueRenderer',
    'esri/renderers/smartMapping',
    'esri/layers/FeatureLayer',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleFillSymbol',
    "esri/renderers/ClassBreaksRenderer",
    'esri/tasks/ClassBreaksDefinition',
    "esri/tasks/StatisticDefinition",
    'esri/tasks/UniqueValueDefinition',
    'esri/tasks/AlgorithmicColorRamp',
    'esri/tasks/GenerateRendererParameters',
    'esri/tasks/GenerateRendererTask',
    "esri/plugins/FeatureLayerStatistics",
    "esri/styles/choropleth",
    'esri/Color',
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/tasks/ProjectParameters",
    "esri/tasks/GeometryService",
    "esri/SpatialReference",
    "esri/geometry/webMercatorUtils",
    'dijit/form/Button',
    'dojox/widget/ColorPicker',
    'dijit/form/DropDownButton',
    'esri/request',
    'esri/symbols/jsonUtils',
    'dojo/text!./Renderer/templates/Renderer.html',
    'dojo/i18n!./Renderer/nls/resource',
    'xstyle/css!./Renderer/css/Renderer.css'


], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, domConstruct, lang, aspect, array, number,
    FilteringSelect, Memory, UniqueValueRenderer, smartMapping, FeatureLayer, SimpleMarkerSymbol, SimpleLineSymbol,
    SimpleFillSymbol, ClassBreaksRenderer, ClassBreaksDefinition, StatisticDefinition, UniqueValueDefinition,
    AlgorithmicColorRamp, GenerateRendererParameters, GenerateRendererTask, FeatureLayerStatistics, esriStylesChoropleth,
    Color, Query, QueryTask, ProjectParameters, GeometryService, SpatialReference, webMercatorUtils, Button, ColorPicker,
    DropDownButton, Request, symbolsJsonUtils, Renderer, i18n) {
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            widgetsInTemplate: true,
            templateString: Renderer,
            baseClass: 'gis_RendererDijit',
            i18n: i18n,
            layerSeparator: '||',
            init_renderers: [],
            fromColorHex: "#fff00f",
            toColorHex: "#f000ff",
            spatialFilters: {
                entireMap: true,
                currentExtent: true,
                identifiedFeature: true,
                searchFeatures: true,
                searchSelected: true,
                searchSource: true,
                searchBuffer: true
            },

            postCreate: function () {

                this.inherited(arguments);
                // this.initSpatialFilters();

                esri.config.defaults.io.proxyUrl = this.proxy_url;

                this.fromColorCP.value = this.fromColorHex;
                this.toColorCP.value = this.toColorHex;

                this.layers = [];
                
                array.forEach(this.layers2render, function (layerInfo) {

                    var layer = new FeatureLayer(layerInfo.url, {
                        mode: FeatureLayer.MODE_ONDEMAND,
                        id: layerInfo.id,
                        outFields: ['*'],
                        opacity: 1.0
                    });
                    if (layer) {
                        this.layers.push({
                            ref: layerInfo.id,
                            layerInfo: layer,
                            fields: layerInfo.fields
                        });
                    }
                }, this);              

                this.init_renderers.push({
                    layerid: 'simos',
                    init_render: 'null'
                });

                this.initRendererButton.on('click', lang.hitch(this, 'initRenderer'));
                this.setRendererButton.on('click', lang.hitch(this, 'createRenderer'));

                // rebuild the layer selection list when the map is updated
                // but only if we have a UI
                if (this.parentWidget) {
                    this.loadEpipedoOptions();
                    this.map.on('update-end', lang.hitch(this, function () {
                       // this.loadEpipedoOptions();
                    }));
                }

                if (this.parentWidget) {
                    if (this.parentWidget.toggleable) {
                        this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
                            this.onLayoutChange(this.parentWidget.open);
                        })));
                    }
                    this.own(aspect.after(this.parentWidget, 'resize', lang.hitch(this, function () {
                        this.gis_RendererDijitContainerNode.resize();
                    })));
                }
            },

            onLayoutChange: function (open) {
                if (open) {
                    this.gis_RendererDijitContainerNode.resize();
                }
            },

            loadEpipedoOptions: function () {

                var id = null;
                var renderingItems = [];
                var selectedId = this.querySelectEpipedo.get('value');
                var sep = this.layerSeparator;

                var i = 0;
                array.forEach(this.layers, lang.hitch(this, function (layer) {
                    renderingItems.push({
                        name: layer.ref,
                        id: layer.ref + sep + i,
                        layer: layer.layerInfo,
                        fields: layer.fields
                    });
                    i++;
                }));

                renderingItems.sort(function (a, b) {
                    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
                });

                this.querySelectEpipedo.set('disabled', (renderingItems.length < 1));
                if (renderingItems.length > 0) {
                    renderingItems.unshift({
                        name: this.i18n.selectQueryLayer,
                        id: '***'
                    });
                    if (!id) {
                        id = renderingItems[0].id;
                    }
                }
                var layer4rendering = new Memory({
                    data: renderingItems
                });

                this.querySelectEpipedo.set('store', layer4rendering);
                this.querySelectEpipedo.set('value', id);
            },

            _onQuerySelectEpipedoChange: function () {

                var t = this;
                var id = null;
                var renderedFields = [];
                var comboItem = t.querySelectEpipedo.item;

                if (this.querySelectEpipedo.item.layer) {
                    array.forEach(this.querySelectEpipedo.item.layer.fields, function (field) {
                        array.forEach(comboItem.fields, function (name) {
                            if (name == field.name) {
                                renderedFields.push({
                                    name: field.alias,
                                    id: field.name,
                                    type: field.type
                                });
                            }
                        });
                    });
                }


                this.querySelectField.set('disabled', (renderedFields.length < 1));

                var fields4rendering = new Memory({
                    data: renderedFields
                });

                this.querySelectField.set('store', fields4rendering);
                this.querySelectField.set('value', id);
                this.querySelectMethod.set('disabled', true);
                this.querySelectType.set('disabled', true);
                this.querySelectNumberOfClasses.set('disabled', true);
                this.querySelectStandardDeniationInterval.set('disabled', true);

            },

            _onQueryFieldChange: function () {
                if (this.querySelectField.item) {
                    if (this.querySelectField.item.type == 'esriFieldTypeString') {
                        this.querySelectMethod.set('disabled', true);
                        this.querySelectType.set('disabled', true);
                        this.querySelectNumberOfClasses.set('disabled', true);
                        this.querySelectStandardDeniationInterval.set('disabled', true);
                    } else {
                        this.querySelectMethod.set('disabled', false);
                        this.querySelectType.set('disabled', false);
                        this.querySelectNumberOfClasses.set('disabled', false);
                        this.querySelectStandardDeniationInterval.set('disabled', false);
                    }
                }
            },

            _onQueryTypeChange: function () {
                if (this.querySelectType.item) {
                    if (this.querySelectType.value == 'size') {
                        this.fromColorBtn.set('disabled', true);
                        this.toColorBtn.set('disabled', true);
                    } else {
                        this.fromColorBtn.set('disabled', false);
                        this.toColorBtn.set('disabled', false);
                    }
                }
            },

            _onQuerySelectMethod: function () {
                if (this.querySelectMethod.item.value == 'standard-deviation') {

                    dojo.style(dojo.byId('contDiv1'), "display", "none");
                    dojo.style(dojo.byId('contDiv2'), "display", "block");

                } else {

                    dojo.style(dojo.byId('contDiv1'), "display", "block");
                    dojo.style(dojo.byId('contDiv2'), "display", "none");
                }

            },

            _onFromColorChange: function (color) {
                this.fromColorHex = color;
                dojo.style(dojo.byId('fromColorDisplay'), "color", color);
            },

            _onToColorChange: function (color) {
                this.toColorHex = color;
                dojo.style(dojo.byId('toColorDisplay'), "color", color);
            },

            createRenderer: function () {
                var app = this;
                var classDef;

                var requestHandle = new Request({
                    "url": app.querySelectEpipedo.item.layer.url,
                    "content": {
                        "f": "json"
                    },
                    "callbackParamName": "callback"
                });
                requestHandle.then(function (response) {
                    var baseSymbol = null;

                    if (response.drawingInfo.renderer.hasOwnProperty("symbol")) {
                        baseSymbol = symbolsJsonUtils.fromJson(response.drawingInfo.renderer.symbol);
                        baseSymbol = new SimpleMarkerSymbol();
                        baseSymbol.setColor(new Color("#984ea3")).setOutline(new SimpleLineSymbol().setWidth(0.3).setColor(new Color([0, 0, 0, 0.8])));
                        app.baseSymbol = baseSymbol;
                    }

                    if (app.querySelectField.item.type == 'esriFieldTypeString') {
                        classDef = new UniqueValueDefinition();
                        classDef.attributeField = app.querySelectField.value;
                        app.querySelectMethod.set('disabled', true);
                        app.querySelectType.set('disabled', true);
                        app.querySelectNumberOfClasses.set('disabled', true);
                        app.querySelectStandardDeniationInterval.set('disabled', true);
                        classDef.baseSymbol = baseSymbol;

                    } else {
                        app.querySelectMethod.set('disabled', false);
                        app.querySelectType.set('disabled', false);
                        app.querySelectNumberOfClasses.set('disabled', false);
                        app.querySelectStandardDeniationInterval.set('disabled', false);

                        classDef = new ClassBreaksDefinition();
                        classDef.classificationField = app.querySelectField.value;
                        classDef.classificationMethod = app.querySelectMethod.value;
                        classDef.breakCount = app.querySelectNumberOfClasses.value;
                        classDef.standardDeviationInterval = app.querySelectStandardDeniationInterval.value;
                        classDef.baseSymbol = baseSymbol;

                        var colorRamp = new AlgorithmicColorRamp();
                        colorRamp.fromColor = Color.fromHex(app.fromColorHex);
                        colorRamp.toColor = Color.fromHex(app.toColorHex);
                        colorRamp.algorithm = "hsv"; // options are:  "cie-lab", "hsv", "lab-lch"
                        classDef.colorRamp = colorRamp;

                        var params = new GenerateRendererParameters();
                        params.classificationDefinition = classDef;
                        //limit the renderer to data being shown by the feature layer
                        params.where = app.layerDef;

                        if (app.querySelectType.value == 'size') {

                            //smart mapping functionality begins
                            //Create a scheme object assigning a theme

                            var schemes = esriStylesChoropleth.getSchemes({
                                //The following options are available for theme:high-to-low, above-and-below, centered-on, or extremes.
                                theme: "above-and-below",
                                basemap: "topo",
                                geometryType: "point",
                            });
                            //Create a classed color Render Parameter object
                            var classedSizedRenderParams = {
                                layer: app.querySelectEpipedo.item.layer,
                                field: app.querySelectField.value,
                                basemap: "topo",
                                classificationMethod: app.querySelectMethod.value,
                                standardDeviationInterval: app.querySelectStandardDeniationInterval.value,
                                numClasses: app.querySelectNumberOfClasses.value,
                                //scheme: schemes.primaryScheme,
                                showOthers: false,
                            };

                            smartMapping.createClassedSizeRenderer(classedSizedRenderParams).then(function (response) {
                                var opacityStops = [];
                                array.forEach(response.classBreakInfos,
                                    function (classBreakInfo, i) {
                                        var minOpacity = 0;
                                        var maxOpacity = 1;
                                        var opacity = minOpacity + (response.classBreakInfos.length - 1 - i) * maxOpacity /
                                            (response.classBreakInfos.length - 1);
                                        opacityStops.push({
                                            value: classBreakInfo.maxValue,
                                            opacity: opacity
                                        });
                                    });
                                var visualVariables = [
                                    {
                                        "type": "opacityInfo",
                                        "field": app.querySelectField.value,
                                        "stops": opacityStops
                                    },
                                ];
                                response.renderer.setVisualVariables(visualVariables);
                                app.applyRenderer(response.renderer)
                            }).otherwise(function (error) {
                                console.log("An error occurred while performing%s, Error: %o", "Smart Mapping", error);
                            });

                        } else if (app.querySelectType.value == 'color') {

                            if (app.querySelectEpipedo.item.layer && app.querySelectField.item.type != 'esriFieldTypeGeometry') {
                                var generateRenderer = new GenerateRendererTask(app.querySelectEpipedo.item.layer.url);
                                generateRenderer.execute(params, lang.hitch(app, 'applyRenderer'), lang.hitch(app, 'errorHandler'));
                            };
                        } else if (app.querySelectType.value == 'both') {

                            if (app.querySelectEpipedo.item.layer && app.querySelectField.item.type != 'esriFieldTypeGeometry') {
                                var generateRenderer = new GenerateRendererTask(app.querySelectEpipedo.item.layer.url);
                                generateRenderer.execute(params).then(function (generateRendererRespond) {
                                    var sizeStops = [];
                                    array.forEach(generateRendererRespond.infos,
                                        function (classBreakInfo, i) {
                                            var minSize = 3;
                                            var maxSize = 30;
                                            var size = minSize + i * maxSize / (generateRendererRespond.infos.length - 1)
                                            app.queryExecution(classBreakInfo);
                                            sizeStops.push({
                                                value: classBreakInfo.maxValue,
                                                size: size,
                                                label: classBreakInfo.label,
                                            });
                                        });
                                    var visualVariables = [
                                        {
                                            "type": "sizeInfo",
                                            "field": app.querySelectField.value,
                                            "stops": sizeStops
                                        }
                                    ];
                                    generateRendererRespond.setVisualVariables(visualVariables);
                                    app.applyRenderer(generateRendererRespond)
                                }).otherwise(function (error) {
                                    console.log("An error occurred while performing%s, Error: %o", "Size Info", error);
                                });
                            };

                        };
                    };
                },
                    function (error) {
                        console.log("request layer info failed => " + error);
                    });


            },

            applyRenderer: function (renderer) {

                var t = this;
                var layerid = this.querySelectEpipedo.item.layer.id;
                var addRender = true;
                renderer = this._processRenderer(renderer, "از", " (ریال) ", 1000000000);
                array.forEach(this.init_renderers, function (item) {
                    if (layerid == item.layerid)
                        addRender = false;
                });
                if (addRender) {
                    this.init_renderers.push({
                        layerid: layerid,
                        // init_render: this.querySelectEpipedo.item.layer._getRenderer()
                        init_renderer: renderer
                    });
                }
                this.initRenderer();

                if (dijit.byId('legend_widget_legend')) {
                    var legend = dijit.byId('legend_widget_legend');
                    legend.layerInfos.push({
                        layer: this.querySelectEpipedo.item.layer,
                        title: this.i18n.legendThematicPart1 + this.querySelectEpipedo.item.layer.id + this.i18n.legendThematicPart2 + this.querySelectField.item.name + "(ریال)"
                    });
                    legend.layers.push({
                        layer: this.querySelectEpipedo.item.layer
                    });
                }

                rendereredLayer = this._changeOpacity(this.querySelectEpipedo.item.layer);
                this.map.addLayer(rendereredLayer);
                this.map.getLayer(this.querySelectEpipedo.item.layer.id).setRenderer(renderer);

                //this.map.getLayer(this.querySelectEpipedo.item.layer.id).redraw();
                //this.map.getLayer(this.querySelectEpipedo.item.layer.id).refresh();

                /*var lDO=this.map.getLayer().layerDrawingOptions;
                lDO[]=new LayerDrawingOptions();
                lDO[].renderer=renderer;
                this.map.getLayer().setLayerDrawingOptions(lDO);*/

                var simos = this.map;
                var simos2 = this.querySelectEpipedo.item.layer.id;
                setTimeout(function () {
                    if (typeof simos.getLayer(simos2) !== 'undefined') {
                        simos.getLayer(simos2).redraw();
                        simos.getLayer(simos2).refresh();
                    }

                }, 1000);
                if (dijit.byId('legend_widget_legend')){
                    dijit.byId('legend_widget_legend').refresh();
                }

            },

            errorHandler: function (err) {
                console.log('Oops, error: ', err);
            },

            queryExecution: function (info) {
                var main = this;
                var queryTask = new esri.tasks.QueryTask(this.querySelectEpipedo.item.layer.url);
                var query = new Query();
                query.outFields = [this.querySelectField.value];

                var maxStatisticDefinition = new StatisticDefinition();
                maxStatisticDefinition.onStatisticField = this.querySelectField.value;
                maxStatisticDefinition.statisticType = "max";
                maxStatisticDefinition.outStatisticFieldName = "maxValue";

                var minStatisticDefinition = new StatisticDefinition();
                minStatisticDefinition.onStatisticField = this.querySelectField.value;
                minStatisticDefinition.statisticType = "min";
                minStatisticDefinition.outStatisticFieldName = "minValue";

                query.outStatistics = [maxStatisticDefinition, minStatisticDefinition];

                queryTask.execute(query).then(function (response) {

                    var minDataValue = response.features[0].attributes.minValue;
                    var maxDataValue = response.features[0].attributes.maxValue;
                    info.maxValue = maxDataValue;
                    info.minValue = minDataValue;

                });
            },

           /* getSpatialFilterGeometry: function () {
                var geometry = null, type = this.selectAttributeSpatialFilter.get('value');

                switch (type) {
                    case 'entireMap':
                    
                        break;
                    case 'currentExtent':
                        geometry = this.map.extent;
                        break;
                    default:
                        break;
                }

                return geometry;
            },

            initSpatialFilters: function () {
                var type = this.selectAttributeSpatialFilter.get('value'),
                    geomOptions = [],
                    popup = this.map.infoWindow;

                for (var key in this.spatialFilters) {
                    if (this.spatialFilters.hasOwnProperty(key)) {
                        if ((this.spatialFilters[key]) && (this.includeSpatialFilter(key, popup))) {
                            geomOptions.push({
                                value: key,
                                label: this.i18n.Labels.spatialFilters[key]
                            });
                        }
                    }
                }

                this.selectAttributeSpatialFilter.set('options', geomOptions);
                this.selectGeometry = null;
                if (geomOptions.length > 0) {
                    this.selectAttributeSpatialFilter.set('disabled', false);
                    this.selectAttributeSpatialFilter.set('value', type);
                } else {
                    this.selectAttributeSpatialFilter.set('disabled', true);
                }
            },

            includeSpatialFilter: function (key, popup) {
                switch (key) {
                    case 'identifiedFeature':
                        if (popup && popup.isShowing) {
                            return true;
                        }
                        break;
                    case 'searchSource':
                        if (this.selectedTable && this.selectedTable.sourceGraphics.graphics.length > 0) {
                            return true;
                        }
                        break;
                    case 'searchFeatures':
                        if (this.selectedTable && this.selectedTable.featureGraphics.graphics.length > 0) {
                            return true;
                        }
                        break;
                    case 'searchSelected':
                        if (this.selectedTable && this.selectedTable.selectedGraphics.graphics.length > 0) {
                            return true;
                        }
                        break;
                    case 'searchBuffer':
                        if (this.selectedTable && this.selectedTable.bufferGraphics.graphics.length > 0) {
                            return true;
                        }
                        break;
                    default:
                        return true;
                }
                return false;
            },
            */

            initRenderer: function () {
                var t = this;
                var map = this.map;
                /*
                 var layerid = this.querySelectEpipedo.item.layer.id;
                 array.forEach(this.init_renderers, function (item) {
                 if(layerid == item.layerid){
                 map.getLayer(layerid).setRenderer(item.init_render);
                 map.getLayer(layerid).redraw();
                 map.getLayer(layerid).refresh();
                 }
                 });
                 */
                //remove from map
                array.forEach(this.layers2render, function (item) {
                    if (map.getLayer(item.id)) {
                        var layer2remove = map.getLayer(item.id);
                        map.removeLayer(layer2remove);
                    }
                });
                //remove from legend
                if (dijit.byId('legend_widget_legend')) {
                    var legend = dijit.byId('legend_widget_legend');
                    var i = 0;
                    var legendItem2remove = [];
                    array.forEach(legend.layers, function (layer1) {
                        array.forEach(t.layers, function (layer2) {
                            if (layer1.id == layer2.layerInfo.id)
                                legendItem2remove.push(i);
                        });
                        i++;
                    });
                    array.forEach(legendItem2remove, function (id) {
                        legend.layerInfos.splice(legend.layerInfos.indexOf(id), 1);
                    });
                    dijit.byId('legend_widget_legend').refresh();
                }

            },

            _processRenderer: function (renderer, prefix, unitLabel, precision) {

                if (renderer.declaredClass === "esri.renderer.ClassBreaksRenderer" && this.querySelectType.value != 'size') {
                    array.forEach(renderer.infos, function (item, idx) {
                        if(item.classMaxValue>1000000){
                        if (precision) {                           
                            // var newMaxValue = Math.round(item.classMaxValue / precision) * precision;
                            // var newMinValue = Math.round(item.minValue / precision) * precision;
                            var newMaxValue = (item.classMaxValue / precision) * precision;
                            var newMinValue = (item.minValue / precision) * precision;
                            };

                        // if (formatLabel) {
                        item.label = number.format(newMinValue, { places: 0 }) + " - " + number.format(newMaxValue, { places: 0 }); // with thousand seperator
                        //item.label = item.minValue.toFixed(0) + " - " + item.classMaxValue.toFixed(0); //with no thousand seperator

                        // }

                        // if (prefix) {
                        //     item.label = prefix + " " + item.label;
                        // }

                        //if (unitLabel) {
                        // item.label = item.label + " " + unitLabel;
                        // }
                    }
                    else{
                        item.label = number.format(item.minValue, { places: 0 }) + " - " + number.format(item.classMaxValue, { places: 0 }); // with thousand seperator                        
                    }
                    });
                    
                }
                else {
                    array.forEach(renderer.infos, function (item, idx) {
                        if(item.maxValue>1000000){
                        if (precision) {
                            // var newMaxValue = Math.round(item.classMaxValue / precision) * precision;
                            // var newMinValue = Math.round(item.minValue / precision) * precision;
                            var newMaxValue = (item.maxValue / precision) * precision;
                            var newMinValue = (item.minValue / precision) * precision;
                        };
                        // if (formatLabel) {
                        item.label = number.format(newMinValue, { places: 0 }) + " - " + number.format(newMaxValue, { places: 0 }); // with thousand seperator
                        //item.label = item.minValue.toFixed(0) + " - " + item.maxValue.toFixed(0); //with no thousand seperator
                        //item.label = number.parse("1,000,000.00", {places: 0});

                        // }

                        // if (prefix) {
                        //     item.label = prefix + " " + item.label;
                        // }

                        //if (unitLabel) {
                        //    item.label = item.label + " " + unitLabel;
                        //}
                }
                else{
                    item.label = number.format(item.minValue, { places: 0 }) + " - " + number.format(item.maxValue, { places: 0 }); // with thousand seperator
                }
                    });
                }
                return renderer;
            },

            _changeOpacity: function (layer) {
                layer.setOpacity(this.opacityControlBtn.value)
                this.opacityControlBtn.on("change", function (value) {
                    if (value !== layer.opacity) {
                        layer.setOpacity(value);
                    }
                });
                return layer;
            }
        });

    });
    