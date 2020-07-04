/*eslint no-console: 0, no-alert: 0*/
define({
    map: true,
    mapClickMode: true,
    useTabs: true,
    sidebarID: 'sidebarBottom',
    tables: []
    /*
        any predefined tables to add to the tab container or possibly just one table
    */
    /*tables: [
        {
            // title for tab
            title: 'جدول خوپردازها',

            // unique topicID so it doesn't collide with
            // other instances of attributes table
            topicID: 'query',

            // allow tabs to be closed
            // confirm tab closure
            closable: true,
            confirmClose: true,

            queryOptions: {
                // parameters for the query
                queryParameters: {

                  //  url: 'http://localhost:6080/arcgis/rest/services/parsaIranAtms_9802/FeatureServer/1',
                   // maxAllowableOffset: 100,
                   // where: 'کد_شعبه = 950 '
                },
                bufferParameters: {
                    distance: null,
                    unit: null,
                    showOnly: false
                },
            },
        }
    ]*/
});