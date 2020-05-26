define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    "esri/renderers/smartMapping",
    "esri/dijit/ClassedColorSlider",
    'dojo/text!./CClassedColorSlider/templates/CClassedColorSlider.html',
],function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,ClassedColorSlider,CClassedColorSliderTemplate){

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: CClassedColorSliderTemplate,
        i18n: i18n,
        map: null,
    })
})