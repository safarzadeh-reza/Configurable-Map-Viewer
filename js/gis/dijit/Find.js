define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/dom-construct',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/on',
    'dojo/keys',
    'dojo/dom-style',
    'dojo/store/Memory',
    'dgrid/OnDemandGrid',
    'dgrid/Selection',
    'dgrid/Keyboard',
    'dgrid/extensions/ColumnResizer',
    'esri/layers/GraphicsLayer',
    'esri/symbols/jsonUtils',
    'esri/graphicsUtils',
    'esri/tasks/FindTask',
    'esri/tasks/FindParameters',
    'esri/geometry/Extent',
    'dojo/text!./Find/templates/Find.html',
    'dojo/i18n!./Find/nls/resource',

    'dijit/form/Form',
    'dijit/form/DropDownButton',
    'dijit/TooltipDialog',
    'dijit/form/FilteringSelect',
    'dijit/form/ValidationTextBox',
    'dijit/form/CheckBox',
    'dijit/form/Button',
    'xstyle/css!./Find/css/Find.css'
], function (
    declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, domConstruct, lang, array, on, keys, domStyle, Memory,
    OnDemandGrid, Selection, Keyboard, ColumnResizer, GraphicsLayer, symbolUtils, graphicsUtils, FindTask, FindParameters, Extent,
    FindTemplate, i18n
) {

        return declare(
            [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
                widgetsInTemplate: true,
                templateString: FindTemplate,
                baseClass: 'gis_AdvancedFindDijit',
                i18n: i18n,
                spatialReference: null,
                showOptionsButton: false,
                zoomOptions: {
                    select: true,
                    deselect: false
                },
                defaultResultsSymbols: {
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
                            width: 2
                        }
                    },
                    polyline: {
                        type: 'esriSLS',
                        style: 'esriSLSSolid',
                        color: [255, 0, 0, 255],
                        width: 3
                    },
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
                    }
                },
                defaultSelectionSymbols: {
                    point: {
                        type: 'esriSMS',
                        style: 'esriSMSCircle',
                        size: 10,
                        color: [4, 156, 219, 175],
                        angle: 0,
                        xoffset: 0,
                        yoffset: 0,
                        outline: {
                            type: 'esriSLS',
                            style: 'esriSLSSolid',
                            color: [4, 156, 219, 255],
                            width: 2
                        }
                    },
                    polyline: {
                        type: 'esriSLS',
                        style: 'esriSLSSolid',
                        color: [4, 156, 219, 255],
                        width: 3
                    },
                    polygon: {
                        type: 'esriSFS',
                        style: 'esriSFSSolid',
                        color: [4, 156, 219, 175],
                        outline: {
                            type: 'esriSLS',
                            style: 'esriSLSSolid',
                            color: [4, 156, 219, 255],
                            width: 3
                        }
                    }
                },
                postCreate: function () {
                    this.inherited(arguments);
                    if (this.showOptionsButton) {
                        domStyle.set(this.optionsDropDownDijit.domNode, 'display', 'inline-block');
                    }
                    this.initializeGlobalVariables();
                    this.addKeyUpHandlerToSearchInput();
                    this.initializeQueries();
                    this.updateSearchPrompt();
                },
                initializeGlobalVariables: function () {
                    this.queryIdx = 0;
                    this.filterIdx = 0;
                    this.currentQueryEventHandlers = [];
                    this.gridColumns = null;
                    if (!this.selectionMode) {
                        this.selectionMode = 'single';
                    }
                    if (!this.zoomExtentFactor) {
                        this.zoomExtentFactor = 1.5;
                    }
                    if (!this.singleZoomExtentFactor) {
                        this.singleZoomExtentFactor = 10;
                    }
                    if (!this.spatialReference) {
                        this.spatialReference = this.map.spatialReference.wkid;
                    }
                    if (!this.pointExtentSize) {
                        this.pointExtentSize = this.spatialReference === 4326 ? 0.0001 : 25;
                    }
                },
                addKeyUpHandlerToSearchInput: function () {
                    this.own(
                        on(
                            this.searchTextDijit, 'keyup', lang.hitch(
                                this, function (evt) {
                                    if (evt.keyCode === keys.ENTER) {
                                        this.search();
                                    }
                                }
                            )
                        )
                    );
                },
                initializeQueries: function () {
                    console.log(this)
                    var k, f = 0,
                        queryLen = this.queries.length;
                    filterLen = this.filters.length;
                    for (k = 0; k < queryLen; k++) {
                        this.queries[k].id = k;
                    }
                    for (f = 0; f < filterLen; f++) {
                        this.filters[f].id = f;
                    }
                    this.querySelectDom.style.display = 'none';
                    this.queryFilterFieldDom.style.display = 'none';
                    if (queryLen > 1) {
                        var queryStore = new Memory({
                            data: this.queries
                        });
                        this.querySelectDijit.set('store', queryStore);
                        this.querySelectDijit.set('value', this.queryIdx);
                        this.querySelectDom.style.display = 'block';

                        if (filterLen > 0) {
                            var filterStore = new Memory({
                                data: this.filters
                            });
                            this.filterFieldSelectDijit.set('store', filterStore);
                            this.filterFieldSelectDijit.set('value', this.filterIdx);
                            this.queryFilterFieldDom.style.display = 'block';
                        }
                    }
                },
                search: function () {
                    if (this.userInputIsInvalid()) {
                        this.displayInvalidUserInputMessage();
                        return;
                    }
                    if (this.queryConfigurationIsInvalid()) {
                        this.displayInvalidQueryConfigurationMessage();
                        return;
                    }
                    this.createOrResetResultsGrid();
                    this.displayFindMessage(this.i18n.searching);
                    this.executeFindTask();
                },
                executeFindTask: function () {
                    var url = this.getQueryInput().query.url;
                    var findParams = this.getFindParams();
                    var findTask = new FindTask(url);
                    findTask.execute(findParams, lang.hitch(this, this.showResults));
                },
                getQueryInput: function () {
                    return {
                        query: this.queries[this.queryIdx] || {},
                        filter: this.filters[this.filterIdx] || {},
                        searchText: this.searchTextDijit.get('value'),
                        filterText: this.filterTextDijit.get('value'),
                        filterType: this.filterSelectDijit.get('value'),
                    };
                },
                queryConfigurationIsInvalid: function () {
                    var query = this.getQueryInput().query;
                    if (!query.url || !query.searchFields || !query.layerIds) {
                        return true;
                    }
                    return false;
                },
                userInputIsInvalid: function () {
                    var userInput = this.getQueryInput().searchText;
                    if (userInput.length === 0 || this.userInputLessThanMinLength()) {
                        return true;
                    }
                    return false;
                },
                userInputLessThanMinLength: function () {
                    var queryInput = this.getQueryInput();
                    if (queryInput.query.minChars && (queryInput.searchText.length < queryInput.query.minChars)) {
                        return true;
                    }
                    return false;
                },
                displayInvalidQueryConfigurationMessage: function () {
                    this.displayFindMessage('تنظیمات کوئری مشکل دارد');
                    return;
                },
                displayInvalidUserInputMessage: function () {
                    var minChars = this.getQueryInput().query.minChars;
                    this.displayFindMessage('حداقل باید ' + minChars + ' حرف وارد کنید.');
                    return;
                },
                displayFindMessage: function (message) {
                    domConstruct.empty(this.findResultsNode);
                    this.findResultsNode.innerHTML = message;
                    this.findResultsNode.style.display = 'block';
                },
                getFindParams: function () {
                    var queryInput = this.getQueryInput();
                    var findParams = new FindParameters();
                    findParams.layerDefinitions = [];
                    findParams.returnGeometry = true;
                    findParams.layerIds = queryInput.query.layerIds;
                    findParams.searchFields = queryInput.query.searchFields;
                    findParams.searchText = queryInput.searchText;
                    findParams.contains = !this.containsSearchText.checked;
                    if (this.containsfilter.checked) {
                        findParams.layerDefinitions[1] = queryInput.filter.filterFields + queryInput.filterType + queryInput.filterText;
                    };
                    findParams.outSpatialReference = {
                        wkid: this.spatialReference
                    };
                    return findParams;
                },
                createOrResetResultsGrid: function () {
                    if (!this.resultsGrid) {
                        this.createResultsStore();
                        this.createResultsGrid();
                        this.attachStandardEventHandlersToResultsGrid();
                    }
                    this.clearResultsGrid();
                    this.clearFeatures();
                    this.resetResultsGridColumns();
                    this.resetResultsGridSort();
                    this.resetGridSelectionMode();
                    this.attachCustomEventHandlersToResultsGrid();
                },
                createResultsStore: function () {
                    if (!this.resultsStore) {
                        this.resultsStore = new Memory({
                            idProperty: 'id',
                            data: []
                        });
                    }
                },
                createResultsGrid: function () {
                    var Grid = declare([OnDemandGrid, Keyboard, Selection, ColumnResizer]);
                    this.resultsGrid = new Grid({
                        selectionMode: this.selectionMode,
                        cellNavigation: false,
                        showHeader: true,
                        store: this.resultsStore
                    }, this.findResultsGrid);
                    this.resultsGrid.startup();
                },
                resetResultsGridColumns: function () {
                    if (!this.resultsGrid) {
                        return;
                    }
                    var columns = this.queries[this.queryIdx].gridColumns || {
                        layerName: 'Layer',
                        foundFieldName: 'Field',
                        value: 'Result'
                    };
                    if (columns instanceof Array) {
                        columns = array.filter(
                            columns, function (column) {
                                if (typeof column.visible === 'undefined') {
                                    column.visible = true;
                                }
                                return column.visible;
                            }
                        );
                    }
                    this.resultsGrid.setColumns(columns);
                },
                resetResultsGridSort: function () {
                    if (!this.resultsGrid) {
                        return;
                    }
                    var sort = this.queries[this.queryIdx].sort || [
                        {
                            attribute: 'value',
                            descending: false
                        }
                    ];
                    this.resultsGrid.set('sort', sort);
                },
                resetGridSelectionMode: function () {
                    if (!this.resultsGrid) {
                        return;
                    }
                    var selectionMode = this.queries[this.queryIdx].selectionMode || this.selectionMode;
                    this.resultsGrid.set('selectionMode', selectionMode);
                },
                attachStandardEventHandlersToResultsGrid: function () {
                    if (!this.resultsGrid) {
                        return;
                    }
                    this.own(
                        this.resultsGrid.on('dgrid-select', lang.hitch(this, 'onResultsGridSelect'))
                    );
                    this.own(
                        this.resultsGrid.on('dgrid-deselect', lang.hitch(this, 'onResultsGridDeselect'))
                    );
                    this.own(
                        this.resultsGrid.on('.dgrid-row:dblclick', lang.hitch(this, 'onResultsGridRowClick'))
                    );
                },
                attachCustomEventHandlersToResultsGrid: function () {
                    if (!this.resultsGrid) {
                        return;
                    }
                    array.forEach(this.currentQueryEventHandlers, function (handler) {
                        handler.handle.remove();
                    });
                    var queryEventHandlers = this.queries[this.queryIdx].customGridEventHandlers || [];
                    array.forEach(queryEventHandlers, lang.hitch(this, function (handler) {
                        handler.handle = this.resultsGrid.on(handler.event, lang.hitch(this, handler.handler));
                    }));
                    this.currentQueryEventHandlers = queryEventHandlers;
                },
                showResults: function (results) {
                    var resultText = this.i18n.noResultsLabel;
                    this.results = results;
                    if (this.results.length > 0) {
                        var s = (this.results.length === 1) ? '' : this.i18n.resultsLabel.multipleResultsSuffix;
                        resultText = this.results.length + ' ' + this.i18n.resultsLabel.labelPrefix + s + ' ' + this.i18n.resultsLabel.labelSuffix;
                        this.createGraphicsLayerAndSymbols();
                        this.parseGridColumnProperties();
                        this.addResultsToGraphicsLayer();
                        this.zoomToGraphics(this.graphicsLayer.graphics);
                        this.showResultsGrid();
                    }
                    this.displayFindMessage(resultText);
                },
                createGraphicsLayerAndSymbols: function () {
                    if (!this.graphicsLayer) {
                        this.graphicsLayer = this.createGraphicsLayer();
                    }
                    if (!this.graphicsSymbols) {
                        this.graphicsSymbols = this.createGraphicsSymbols();
                    }
                },
                createGraphicsLayer: function () {
                    var graphicsLayer = new GraphicsLayer({
                        id: this.id + '_findGraphics',
                        title: 'Find'
                    });
                    graphicsLayer.on('click', lang.hitch(this, 'onGraphicsLayerClick'));
                    this.map.addLayer(graphicsLayer);
                    return graphicsLayer;
                },
                onGraphicsLayerClick: function (event) {
                    var zoomOnSelect = this.zoomOptions.select;
                    this.zoomOptions.select = false;
                    var row = this.resultsGrid.row(event.graphic.storeid);
                    this.resultsGrid.select(row);
                    this.resultsGrid.focus(row.element);
                    row.element.focus();
                    this.zoomOptions.select = zoomOnSelect;
                },
                createGraphicsSymbols: function () {
                    var graphicSymbols = {}, resultSymbolDefinitions, selectionSymbolDefinitions;
                    resultSymbolDefinitions = lang.mixin(this.defaultResultsSymbols, this.resultsSymbols || {});
                    graphicSymbols.resultsSymbols = {};
                    graphicSymbols.resultsSymbols.point = symbolUtils.fromJson(resultSymbolDefinitions.point);
                    graphicSymbols.resultsSymbols.polyline = symbolUtils.fromJson(resultSymbolDefinitions.polyline);
                    graphicSymbols.resultsSymbols.polygon = symbolUtils.fromJson(resultSymbolDefinitions.polygon);
                    selectionSymbolDefinitions = lang.mixin(
                        this.defaultSelectionSymbols, this.selectionSymbols || {}
                    );
                    graphicSymbols.selectionSymbols = {};
                    graphicSymbols.selectionSymbols.point = symbolUtils.fromJson(selectionSymbolDefinitions.point);
                    graphicSymbols.selectionSymbols.polyline = symbolUtils.fromJson(selectionSymbolDefinitions.polyline);
                    graphicSymbols.selectionSymbols.polygon = symbolUtils.fromJson(selectionSymbolDefinitions.polygon);
                    return graphicSymbols;
                },
                parseGridColumnProperties: function () {
                    if (this.queries[this.queryIdx].gridColumns) {
                        array.forEach(
                            this.results, function (result) {
                                array.forEach(
                                    this.queries[this.queryIdx].gridColumns, function (column) {
                                        function shouldGetValueFromAttributes(col, res) {
                                            if (col.field && !result.hasOwnProperty(col.field) && res.feature.attributes.hasOwnProperty(col.field)) {
                                                return true;
                                            }
                                            return false;
                                        }

                                        function shouldGetValueFromGetFunction(col, res) {
                                            if (col.field && !res.hasOwnProperty(col.field) && col.get) {
                                                return true;
                                            }
                                            return false;
                                        }

                                        if (shouldGetValueFromAttributes(column, this)) {
                                            this[column.field] = this.feature.attributes[column.field];
                                        } else if (shouldGetValueFromGetFunction(column, this)) {
                                            this[column.field] = column.get(this);
                                        }
                                    }, result
                                );
                            }, this
                        );
                    }
                },
                addResultsToGraphicsLayer: function () {
                    var unique = 0;
                    array.forEach(
                        this.results, function (result) {
                            result.id = unique;
                            result.feature.storeid = result.id;
                            unique++;
                            this.setGraphicSymbol(result.feature, false);
                            this.graphicsLayer.add(result.feature);
                        }, this
                    );
                },
                showResultsGrid: function () {
                    var queryInput = this.getQueryInput();
                    this.resultsGrid.store.setData(this.results);
                    this.resultsGrid.refresh();
                    var lyrDisplay = 'block';
                    if (queryInput.query.layerIds.length === 1) {
                        lyrDisplay = 'none';
                    }
                    this.resultsGrid.styleColumn('layerName', 'display:' + lyrDisplay);
                    if (queryInput.query && queryInput.query.hideGrid !== true) {
                        this.findResultsGrid.style.display = 'block';
                    }
                },
                onResultsGridSelect: function (event) {
                    array.forEach(
                        event.rows, lang.hitch(
                            this, function (row) {
                                var feature = row.data.feature;
                                this.setGraphicSymbol(feature, true);
                                if (feature && feature.getDojoShape()) {
                                    feature.getDojoShape().moveToFront();
                                }
                            }
                        )
                    );
                    this.graphicsLayer.redraw();
                    if (this.zoomOptions.select) {
                        this.zoomToSelectedGraphics();
                    }
                },
                onResultsGridDeselect: function (event) {
                    array.forEach(
                        event.rows, lang.hitch(
                            this, function (row) {
                                var feature = row.data.feature;
                                this.setGraphicSymbol(feature, false);
                            }
                        )
                    );
                    this.graphicsLayer.redraw();
                    if (this.zoomOptions.deselect) {
                        this.zoomToSelectedGraphics();
                    }
                },
                onResultsGridRowClick: function (event) {
                    var row = this.resultsGrid.row(event);
                    var feature = row.data.feature;
                    setTimeout(lang.hitch(this, function () {
                        if (this.resultsGrid.selection.hasOwnProperty(row.id)) {
                            this.zoomToGraphics([feature]);
                        }
                    }), 100);
                },
                setGraphicSymbol: function (graphic, isSelected) {
                    var symbol = isSelected ? this.graphicsSymbols.selectionSymbols[graphic.geometry.type] : this.graphicsSymbols.resultsSymbols[graphic.geometry.type];
                    graphic.setSymbol(symbol);
                },
                zoomToSelectedGraphics: function () {
                    var selectedGraphics = [];
                    var selection = this.resultsGrid.selection;
                    for (var id in selection) {
                        if (selection.hasOwnProperty(id)) {
                            selectedGraphics.push(this.resultsGrid.row(id).data.feature);
                        }
                    }
                    if (selectedGraphics.length === 0) {
                        return;
                    }
                    this.zoomToGraphics(selectedGraphics);
                },
                zoomToGraphics: function (graphics) {
                    var zoomExtent = null;
                    if (graphics.length > 1) {
                        zoomExtent = graphicsUtils.graphicsExtent(graphics);
                    } else if (graphics.length === 1) {
                        zoomExtent = this.getExtentFromGraphic(graphics[0]);
                        zoomExtent = zoomExtent.expand(this.singleZoomExtentFactor);
                    }
                    if (zoomExtent) {
                        this.setMapExtent(zoomExtent);
                    }
                },
                getExtentFromGraphic: function (graphic) {
                    var extent = null;
                    switch (graphic.geometry.type) {
                        case 'point':
                            extent = this.getExtentFromPoint(graphic);
                            break;
                        default:
                            extent = graphicsUtils.graphicsExtent([graphic]);
                            break;
                    }
                    return extent;
                },
                getExtentFromPoint: function (point) {
                    var sz = this.pointExtentSize; // hack
                    var pointGeometry = point.geometry;
                    return new Extent({
                        'xmin': pointGeometry.x - sz,
                        'ymin': pointGeometry.y - sz,
                        'xmax': pointGeometry.x + sz,
                        'ymax': pointGeometry.y + sz,
                        'spatialReference': {
                            wkid: this.spatialReference
                        }
                    });
                },
                setMapExtent: function (extent) {
                    this.map.setExtent(extent.expand(this.zoomExtentFactor));
                },
                clearResults: function () {
                    this.results = null;
                    this.clearResultsGrid();
                    this.clearFeatures();
                    this.searchFormDijit.reset();
                    this.querySelectDijit.setValue(this.queryIdx);
                    domConstruct.empty(this.findResultsNode);
                },
                clearResultsGrid: function () {
                    if (this.resultStore) {
                        this.resultsStore.setData([]);
                    }
                    if (this.resultsGrid) {
                        this.resultsGrid.refresh();
                    }
                    this.findResultsNode.style.display = 'none';
                    this.findResultsGrid.style.display = 'none';
                },
                clearFeatures: function () {
                    if (this.graphicsLayer) {
                        this.graphicsLayer.clear();
                    }
                },
                _onQueryChange: function (queryIdx) {
                    if (queryIdx >= 0 && queryIdx < this.queries.length) {
                        this.queryIdx = queryIdx;
                        this.updateSearchPrompt();
                    }
                },
                _onFilterCheckChange: function () {
                    if (this.containsfilter.checked) {
                        this.filterFieldSelectDijit.set('disabled', false)
                        this.filterSelectDijit.set('disabled', false)
                        this.filterTextDijit.set('disabled', false)
                    }
                    else {
                        this.filterFieldSelectDijit.set('disabled', true)
                        this.filterSelectDijit.set('disabled', true)
                        this.filterTextDijit.set('disabled', true)
                    }

                },
                _onFilterChange: function (filterIdx) {

                    if (filterIdx >= 0 && filterIdx < this.filters.length) {
                        this.filterIdx = filterIdx;
                        //this.updateSearchPrompt();
                    }
                },
                updateSearchPrompt: function () {
                    var prompt = this.queries[this.queryIdx].prompt || i18n.searchText.placeholder;
                    this.searchTextDijit.set('placeholder', prompt);
                    this.searchTextDijit.set('value', null);
                },
                onZoomOptionsSelectChange: function (value) {
                    this.zoomOptions.select = value;
                },
                onZoomOptionsDeselectChange: function (value) {
                    this.zoomOptions.deselect = value;
                }
            }
        );
    });
