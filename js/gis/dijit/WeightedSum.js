define([

    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/dom-construct',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/topic',
    'dojo/store/Memory',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/tasks/Geoprocessor',
    "esri/tasks/GeometryService",
    "esri/tasks/ProjectParameters",
    'dijit/form/CheckBox',
    'dijit/form/TextBox',
    'dijit/registry',
    "dojo/dom",
    "dojo/dom-construct",
    'dojo/text!./WeightedSum/templates/WeightedSum.html',
    'dojo/i18n!./WeightedSum/nls/resource',
    'xstyle/css!./WeightedSum/css/WeightedSum.css'

], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, domConstruct,
    lang, array, topic, Memory, ArcGISDynamicMapServiceLayer, Geoprocessor, GeometryService, ProjectParameters, CheckBox, 
    TextBox, registry, dom, domConstruct, WeightedSum, i18n) {
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            widgetsInTemplate: true,
            templateString: WeightedSum,
            baseClass: 'gis_WeightedSumDijit',
            i18n: i18n,
            layerSeparator: '||',
            init_renderers: [],

            postCreate: function () {

                this.waitingStatusContainer.style.display = 'none';

                var main = this;
                this.inherited(arguments);
                esri.config.defaults.io.proxyUrl = this.proxy_url;

                // ** filling combo box for cities **
                var id = null;
                var renderingItems = [];
                array.forEach(this.weightedSumLayers, lang.hitch(this, function (layers) {
                    renderingItems.push({
                        name: layers.name,
                        enName: layers.enName,
                        id: layers.id,
                        path: layers.path,
                        layerIds: layers.layerIds,
                        layerEnNames: layers.layerEnNames,
                        layerWeights: layers.layerWeights,
                        layerRadiuses: layers.layerRadiuses,
                    });
                }));

                renderingItems.sort(function (a, b) {
                    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
                });
                this.querySelectType.set('disabled', (renderingItems.length < 1));

                if (renderingItems.length > 0) {
                    renderingItems.unshift({
                        name: i18n.choseCity,
                        id: '***',

                    });
                    if (!id) {
                        id = renderingItems[0].id;
                    }
                }
                var layer4rendering = new Memory({
                    data: renderingItems
                });
                this.querySelectType.set('store', layer4rendering);
                this.querySelectType.set('value', id);

                this.layers = [];
                array.forEach(layer4rendering.data, function (layerInfo) {
                    if (layerInfo.layerIds) {
                        var layerNames = [];
                        layersLen = layerInfo.layerIds.length;
                        for (i = 0; i < layersLen; i++) {
                            layerNames.push({
                                name: main.layerInfos[layerInfo.id].layer.layerInfos[i],
                            });
                        }
                        this.layers.push({
                            id: layerInfo.id,
                            name: layerInfo.name,
                            enName: layerInfo.enName,
                            path: layerInfo.path,
                            layerIds: layerInfo.layerIds,
                            layerWeights: layerInfo.layerWeights,
                            layerRadiuses: layerInfo.layerRadiuses
                        });
                    }
                }, this);
            },
            operateWeightedSum: function () {

                // ** add waiting statuse in the side bar  **
                var i = 5;
                var app = this;
                array.forEach(this.querySelectType.item.layerIds, function (item) {
                    if (dijit.byId("check" + item).checked == true) {
                        i++;
                    }
                });

                var estimatedTime = Math.round(i * 1.4);
                this.waitingStatusContainer.style.display = 'none';
                var j = 1;
                var x = setInterval(function () {
                    var remainedTime = estimatedTime - j;
                    app.waitingStatus.innerHTML = "<i class='fa fa-spinner fa-spin fa-1x fa-fw'></i>لطفا منتظر بمانید... <br> ( زمان تقریبی انتظار : " + remainedTime + " ثانیه)"
                    if (remainedTime < 1) {
                        clearInterval(x);
                    }
                    j++
                }, 1000);


                // this.waitingStatus.innerHTML = "لطفا منتظر بمانید... <br> ( زمان تقریبی انتظار : " + estimatedTime + " ثانیه)"
                this.waitingStatusContainer.style.display = 'block';


                // ** creating geoproccessor tool  **
                var gp = new Geoprocessor("http://172.16.0.15:6080/arcgis/rest/services/WeightedSumServiceModel/GPServer/WeightedSumServiceModel_04");
                gp.setOutputSpatialReference({
                    wkid: this.map.spatialReference.wkid
                });
                var gpParams = this.setupParameters();
                gp.submitJob(gpParams, lang.hitch(this, 'gpJobComplete'), lang.hitch(this, 'gpJobFailed'));

            },
            setupParameters: function () {

                var app = this;
                var parameters = [];

                array.forEach(this.querySelectType.item.layerIds, function (item) {
                    if (dijit.byId("check" + item).checked == true) {
                        if (dijit.byId("text" + item).value) {
                            parameters.push({ "name": app.querySelectType.item.layerEnNames[item], "weight": dijit.byId("text" + item).value });
                        }
                        else if (!dijit.byId("text" + item).value) {
                            parameters.push({ "name": app.querySelectType.item.layerEnNames[item], "weight": 0 });
                        }
                    }
                });
                //parameters.push({ "name": this.querySelectType.item.enName + "_parsa_atm", "weight": 10 });
                var textParameters = JSON.stringify(parameters);
                var paramSet = {
                    "layers": textParameters,
                    "path": this.querySelectType.item.path
                }
                return paramSet;

            },
            gpJobComplete: function (jobinfo) {

                var outLayerUrl = 'http://172.16.0.15:6080/arcgis/rest/services/WeightedSumServiceModel/MapServer/jobs/' + jobinfo.jobId;
                var outputWSLayer = new ArcGISDynamicMapServiceLayer(outLayerUrl, {
                    "id": this.querySelectType.item.name,
                    "opacity": this.opacityControl.value,
                });

                //   **   Handle Opacity of the layer   **
                this.opacityControl.on("change", function (value) {
                    if (value !== outputWSLayer.opacity) {
                        outputWSLayer.setOpacity(value);
                    }
                });
                //  **  Handling Legend Options
                this.removeGraphics()
                //Add New Legend
                this._addLegend(outputWSLayer)
                //  **  Handeling Map Options
                // Add new Layer
                //this.map.addLayer(outputWSLayer);

                // Zoom to Layer Extent
                //var params = new ProjectParameters();
                //params.geometries = [point];
                // params.outSR = this.map.spatialReference;
                //params.transformation = transformation;
                //outputWSLayer.project(params);
                var map = this.map
                dojo.connect(outputWSLayer, 'onLoad', function() {
                    map.setExtent(outputWSLayer.fullExtent);
                  });


                
                // this.map.setExtent(this.layerInfos[0].layer.fullExtent);
                // Add to Identify Task
                this._addIdentifyTask(outputWSLayer)

            },
            removeGraphics: function () {
                this.waitingStatusContainer.style.display = 'none';
                var t = this;
                var map = this.map;

                // ** Remove old Legend **
                if (dijit.byId('legend_widget_legend')) {
                    var legend = dijit.byId('legend_widget_legend');
                    var i = 0;
                    var legendItem2remove = [];
                    array.forEach(legend.layers, function (layer1) {
                        array.forEach(t.layers, function (layer2) {
                            if (layer1.id == layer2.name)
                                legendItem2remove.push(i);
                        });
                        i++;
                    });
                    array.forEach(legendItem2remove, function (id) {
                        legend.layerInfos.splice(legend.layerInfos.indexOf(id), 1);
                    });
                    dijit.byId('legend_widget_legend').refresh();
                };

                // **  Remove from map  **
                array.forEach(this.weightedSumLayers, function (item) {
                    if (map.getLayer(item.name)) {
                        var layer2remove = map.getLayer(item.name);
                        map.removeLayer(layer2remove);
                    }
                });

                // **  Remove waiting statuse in the side bar  **
                //this.waitingStatus.style.display = 'none';
                domConstruct.empty(this.waitingStatus);
                // this.waitingStatusContainer.innerHTML = "تحلیل با موفقیت انجام شد"
            },
            _onAllLayersCheckBoxChange: function () {

                if (this.allLayersCheckBox.checked) {
                    dojo.forEach(dojo.query('.layerCheckBoxes'), function (item) {
                        var checkWidget = dijit.getEnclosingWidget(item);
                        checkWidget.set('checked', true);
                    });
                    dojo.forEach(dojo.query('.weights'), function (item) {
                        var weightWidget = dijit.getEnclosingWidget(item);
                        weightWidget.set('disabled', false)
                    });
                }
                else if (!this.allLayersCheckBox.checked) {
                    dojo.forEach(dojo.query('.layerCheckBoxes'), function (item) {
                        var checkWidget = dijit.getEnclosingWidget(item);
                        checkWidget.set('checked', false);
                    });
                    dojo.forEach(dojo.query('.weights'), function (item) {
                        var weightWidget = dijit.getEnclosingWidget(item);
                        weightWidget.set('disabled', true)
                    });
                };
            },
            _onCityChange: function () {
                this.waitingStatusContainer.style.display = 'none';
                // ** empty checkbox container and remove old layers **
                var t = this;
                array.forEach(registry.findWidgets(this.checkboxContainer), function (widget) {
                    widget.destroyRecursive();
                });
                domConstruct.empty(this.checkboxContainer);

                // ** making new layer check boxes from combo box layer **
                if (this.querySelectType.item.layerIds) {

                    var mapLayerId = this.querySelectType.item.id;
                    array.forEach(this.querySelectType.item.layerIds, function (item) {
                        var cheboxParams = { id: "check" + item, name: "checkBox" + item, checked: false, 'class': 'layerCheckBoxes' };
                        var checkbox = new CheckBox(cheboxParams, 'checkBox');

                        domConstruct.place(checkbox.domNode, dom.byId("checkboxContainer"));
                        checkbox.on("change", function () {
                            t._onCheckBoxChange();
                        });
                        // **making label for check boxes **
                        var checkLabel = domConstruct.create('label', {
                            'for': checkbox.name,
                            innerHTML: t.layerInfos[mapLayerId].layer.layerInfos[item].name
                        }, checkbox.domNode, "after");
                        domConstruct.place("<br />", checkLabel, "after");
                        dojo.query("label").style({
                            "width": "200px"
                        });

                        // ** making text boxes for taking weights **
                        var textBoxparams = { id: "text" + item, name: "textBox" + item, 'class': 'weights', placeholder: t.querySelectType.item.layerWeights[item], value: t.querySelectType.item.layerWeights[item], required: true, disabled: true };
                        var textBox = new TextBox(textBoxparams).placeAt(checkLabel, "after");
                        /* dojo.query(".dataField").style({
                            "height": "30px",
                            "width": "40px"
                        });*/

                        var checkLabel2 = domConstruct.create('label', {
                            'for': textBox.name,
                            innerHTML: "(شعاع پوشش " + t.querySelectType.item.layerRadiuses[item] + " متر)"
                        }, textBox.domNode, "after");
                        //domConstruct.place("<br />", checkLabel, "after");

                        /*
                        var textBoxparams2 = { id: "text2_" + item, name: "textBox_" + item, 'class': 'redius', placeholder: "(شعاع پوشش " + t.querySelectType.item.layerRadiuses[item] + " متر)", required: true, disabled: true };
                        dojo.query(".redius").style({
                            "height": "30px",
                            "width": "140px"
                        });
                        var textBox2 = new TextBox(textBoxparams2).placeAt(textBox, "after");

                        var checkLabel2 = domConstruct.create('label2_', {
                            'for': checkbox.name,
                            innerHTML: ""
                        }, checkbox.domNode, "before");
                        dojo.query("label2_").style({
                            "width": "100px"
                        });*/


                    });
                }
            },
            _onCheckBoxChange: function () {

                array.forEach(this.querySelectType.item.layerIds, function (item) {
                    if (dijit.byId("check" + item).checked == false) {
                        dijit.byId("text" + item).set("disabled", true);
                        //dijit.byId("text2_" + item).set("disabled", true)
                    }
                    else if (dijit.byId("check" + item).checked == true) {
                        dijit.byId("text" + item).set("disabled", false);
                        //dijit.byId("text2_" + item).set("disabled", false)
                    }
                });
            },

            _onDefaultModeClick: function () {
                this._onCityChange();
                this.removeGraphics();
            },

            _addIdentifyTask: function (outputWSLayer) {
                var layer = {};
                layer.layer = outputWSLayer;
                layer.layerIds = [0];
                layer.title = " نقشه مطلوبیت شهر " + outputWSLayer.id;
                layer.type = "WeightedSum"
                //filter layerInfos
                this.layerInfos = array.filter(this.layerInfos, function (item) {
                    return item["title"] != " نقشه مطلوبیت شهر " + outputWSLayer.id;
                });
                this.layerInfos.push(layer);
                //array.forEach(layer.layer.layerInfos, function(item){console.log(item)});

                topic.publish('identify/addLayerInfos', this.layerInfos);
            },

            _addLegend: function (outputWSLayer) {
                if (dijit.byId('legend_widget_legend')) {
                    var legend = dijit.byId('legend_widget_legend');
                    legend.layerInfos.push({
                        layer: outputWSLayer,
                        title: " نقشه مطلوبیت شهر " + outputWSLayer.id
                    });
                    legend.layers.push({
                        layer: outputWSLayer
                    });
                };
            },

            gpJobStatus: function (jobinfo) {

                console.debug(jobinfo)

            },
            gpJobFailed: function (error) {

                console.log(error)

            },
        });
    }
);