// http://dojotoolkit.org/reference-guide/1.10/dojo/i18n.html
define({
    root: {
        Labels: {
            selectALayer: 'انتخاب لایه',
            selectAQuery: 'انتخاب پرسش و پاسخ',
            spatialFilter: 'اعمال فیلتر مکانی',
            buffer: 'محدوده',
            displayBuffer: 'فقط نشان دادن محدوده',
            attributeAddToExisting: 'اضافه کردن به نتایج موجود',
            spatialAddToExisting: 'اضافه کردن به نتایج موجود',
            selectFeaturesBy: 'انتخاب عوارض به وسیله ی ',
            tabTitleByAttribute: 'جست و جوی توصیفی',
            tabTitleByShape: 'جست و جوی مکانی',
            exactMatches: 'فقط جواب های دقیقا یکسان',

            importDialogTitle: 'وارد کردن پرسش و پاسخ',
            exportDialogTitle: 'خروجی از پرسش و پاسخ',

            // used for "Spatial Filters"
            spatialFilters: {
                entireMap: 'تمام محدوده نقشه (بدون فیتلر)',
                currentExtent: 'محدوده ی کنونی نقشه',
                identifiedFeature: 'Identified Feature',
                searchSource: 'فیلتر مکانی مورد استفاده در جست و جو',
                searchFeatures: 'عوارض موجود در نتیجه جست و جو',
                searchSelected: 'عوارض انتخاب شده در نتیجه جست و جو',
                searchBuffer: 'محدوده مورد استفاده برای جست و جو'
            }
        },
        Buttons: {
            search: {
                label: 'جست و جو',
                showLabel: true
            },
            stopDrawing: {
                label: 'لغو ترسیم',
                showLabel: true
            },
            selectByRectangle: {
                label: 'انتخاب به وسیله چهارضلعی',
                showLabel: false
            },
            selectByCircle: {
                label: 'انتخاب به وسیله دایره',
                showLabel: false
            },
            selectByPoint: {
                label: 'انتخاب به وسیله نقطه',
                showLabel: false
            },
            selectByPolyline: {
                label: 'انتخاب به وسیله خط',
                showLabel: false
            },
            selectByFreehandPolyline: {
                label: 'انتخاب به وسیله خط آزاد',
                showLabel: false
            },
            selectByPolygon: {
                label: 'انتخاب به وسیله چندضلعی',
                showLabel: false
            },
            selectByFreehandPolygon: {
                label: 'انتخاب به وسیله چند ضلعی آزاد',
                showLabel: false
            },
            selectByIdentify: {
                label: 'انتخاب به وسیله ی عوارض گزارش گرفته شده',
                showLabel: false
            },
            selectBySelected: {
                label: 'انتخاب به وسیله عوارض انتخاب شده',
                showLabel: false
            },
            switchToBasic: {
                label: 'برو به جست و جوی ساده',
                showLabel: true
            },
            switchToAdvanced: {
                label: 'برو به جست و جوی پیشرفته',
                showLabel: true
            },
            importSQL: {
                label: 'ورودی',
                showLabel: false
            },
            exportSQL: {
                label: 'خروجی',
                showLabel: false
            },
            clearFields: {
                label: 'حذف',
                showLabel: true
            }
        }
    }
});