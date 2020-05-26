(function () {
    var path = location.pathname.replace(/[^\/]+$/, '');
    window.dojoConfig = {
        locale: 'en-us',
        async: true,
        packages: [
            {
                name: 'viewer',
                location: path + 'js/viewer'
            }, {
                name: 'gis',
                location: path + 'js/gis'
            }, {
                name: 'config',
                location: path + 'js/config'
            }, {
                name: 'proj4js',
                location: '//cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.15'
            }, {
                name: 'flag-icon-css',
                location: '//cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.8.0'
            },
            /* customizations for WAB widgets */
            {
                name: 'jimu',
                location: path + 'js/wab/2.11/jimu.js'
            }, {
                name: 'libs',
                location: path + 'js/wab/2.11/libs'
            }, {
                name: 'wabwidgets',
                location: path + 'js/wab/2.11/widgets'
            },
            {
                name: 'widgets',
                location: path + 'js/widgets'
            },
            /* end customizations for WAB widgets */

            // jquery is only required for the Advanced Search in Search widget
            {
                name: 'jquery',
                location: path + 'js',
                main: 'jquery.min'
            }
            // end jquery
        ]
    };

    require(window.dojoConfig, [
        'dojo/_base/declare',

        // minimal Base Controller
        'viewer/_ControllerBase',

        // *** Controller Mixins
        // Use the core mixins, add custom mixins
        // or replace core mixins with your own
        'viewer/_ConfigMixin', // manage the Configuration
        'viewer/_LayoutMixin', // build and manage the Page Layout and User Interface
        'viewer/_MapMixin', // build and manage the Map
        'viewer/_WidgetsMixin', // build and manage the Widgets

        // 'viewer/_WebMapMixin' // for WebMaps

        'viewer/_SidebarMixin', // for mobile sidebar

        //'config/_customMixin'

        'config/_WABMixin', // cusom mix-in to use WAB widgets

        // needed by some wab widgets like Print
        'libs/caja-html-sanitizer-minified',

        // jimu stylesheet needed for WAB widgets
        'xstyle/css!jimu/css/jimu-theme.css',

        // needed so that jimu styles play nice with cmv
        'xstyle/css!./css/cmv-jimu.css',
        // some css tweaks for WAB widgets (optional)
        'xstyle/css!./css/cmv-wab.css'


    ], function (
        declare,

        _ControllerBase,
        _ConfigMixin,
        _LayoutMixin,
        _MapMixin,
        _WidgetsMixin,

        _WebMapMixin,

        _SidebarMixin
        //_MyCustomMixin

    ) {
            var App = declare([

                // add custom mixins here...note order may be important and
                // overriding certain methods incorrectly may break the app
                // First on the list are last called last, for instance the startup
                // method on _ControllerBase is called FIRST, and _LayoutMixin is called LAST
                // for the most part they are interchangeable, except _ConfigMixin
                // and _ControllerBase
                //

                // Mixin for Mobile Sidebar
                _SidebarMixin,

                _LayoutMixin,
                _WidgetsMixin,
                _WebMapMixin,
                _MapMixin,

                // configMixin should be right before _ControllerBase so it is
                // called first to initialize the config object
                _ConfigMixin,

                // controller base needs to be last
                _ControllerBase
            ]);
            var app = new App();
            app.startup();

        });
})();
