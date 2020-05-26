define([
    'dojo/i18n!./nls/main'
], function (i18n) {

    return {
        map: true,
        editable: true,
        bookmarks: [{
            extent: {
                xmin: 0,
                ymin: 0,
                xmax: 0,
                ymax: 0,
                spatialReference: {
                    wkid: 4326
                }
            },
            name: i18n.bookmarks.nullIsland
        }
            
        ]
    };
});