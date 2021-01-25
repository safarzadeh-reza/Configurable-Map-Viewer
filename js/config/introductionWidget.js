define({
    // mimic a dojo dijit button
    html: '<span class="dijitButton" style="color:#333"><span class="dijitReset dijitInline dijitButtonNode"><span class="dijitReset dijitStretch dijitButtonContents"><span class="dijitReset dijitInline dijitIcon fa fa-video-camera"></span><span class="dijitReset dijitInline dijitButtonText">راهنمای تصویری سامانه</span></span></span></span>',

    // place the button in the upper right
    domTarget: 'helpDijit',

    startOnLoad: true,

    cookieOptions: {
        expires: new Date(Date.now() + (360000 * 24 * 0)) // Always show in the demo
    },

    // Documentation https://introjs.com/docs/themes/list
    introTheme: 'modern',

    // Documentation: https://introjs.com/docs/intro/options/
    introOptions: {
        steps: [
            {
                intro: [
                    '<div style="width:350px;">',
                    '<h4>به سامانه مکانی جامع پارسا خوش آمدید</h4>',
                    'این سامانه جهت نمایش اطلاعات مکانی مربوط به دستگاه های خودپرداز شرکت پارسا ایجاد شده است.<br/><br/>',
                    'جهت مشاهده ادامه ی راهنما بر روی دکمه ی بعد کلیک کنید.<br/><br/>',
                    //'<div style="text-align:center">',
                    //'<a href="https://github.com/cmv/cmv-app" target="_blank" style="color:#fff;text-decoration:underline;">',
                    //'<img src="https://cmv.io/images/rocket-logo.png" style="width:100px;" /><br/>',
                    //'Get CMV on Github',
                    //'</a><br/><br/>',
                    '</div>',
                    '</div>'
                ].join('')
            },
            {
                element: '#mapCenter',
                intro: '<h4>اعمال روی نقشه</h4>برای پیمایش نقشه می توانید به صورت زیر عمل کنید :<br/>' +
                [
                    '<ul>',
                    '<li>Drag : جابه جایی نقشه</li>',
                    '<li>SHIFT + Click : قرار دادن نقطه کلیک شده در وسط</li>',
                    '<li>SHIFT + Drag : بزرگنمایی</li>',
                    '<li>SHIFT + CTRL + Drag : کوچک نمایی</li>',
                    '<li>Mouse Scroll Forward : بزرگنمایی</li>',
                    '<li>Mouse Scroll Backward : کوچک نمایی</li>',
                    '<li>استفاده از کلیدهای جهت دار جهت جا به جایی نقشه</li>',
                    '<li>کلید (+) برای بزرگنمایی</li>',
                    '<li>کلید (-) برای کوچک نمایی</li>',
                    '<li>Double Click : بزرگنمایی به نقطه مورد نظر</li>',
                    '</ul>'
                ].join('')
            },
            {
                element: '#mapCenter_zoom_slider',
                intro: '<h4>زوم روی نقشه</h4>شما میتوانید با استفاده از این دکمه بزرگنمایی و کوچک نمایی بر روی نقشه انجام دهید.'
            },
            {
                element: '#sidebarRight',
                intro: '<h4>نوار ابزار</h4>شما میتوانید ابزارک های موجود را در این نوار ابزار مشاهده نمایید.',
                position: 'left'
            },
            {
                element: '.sidebarrightCollapseButton',
                intro: '<h4>باز/بسته کردن نوار ابزار</h4>با استفاده از این دکمه میتوانید نوار ابزار کناری با باز/بسته کنید.',
                position: 'left'
            },
            {
                element: '#layerControl_parent .dijitTitlePaneTitle',
                intro: '<h4>لایه های قابل مشاهده</h4>در این قسمت می توانید لایه های مورد نظر را انتخاب کرده و برخی تحلیل های مکانی ساده مانند خوشه بندی و شعاع پوشش ان ها را مشاهده نمایید.',
                position: 'left'
            },
            {
                element: '#renderer_parent .dijitTitlePaneTitle',
                intro: '<h4>ابزار دسته بندی</h4>با استفاده از این ابزار می توانید لایه ها را بر اساس ویژگی های دلخواه دسته بندی کرده و نتایج تحلیل را به صورت گرافیکی مشاهده نمایید.<br/><br/>'+
                '<img src="http://172.16.0.14:8080/cmv/images/classifying.png" style="width:300px;" /><br/>',
                //position: 'left'
            },
            {
                element: '#search_parent .dijitTitlePaneTitle',
                intro: '<h4>ابزار جست و جو</h4>با استفاده از این ابزار می توانید جست و جوی توصیفی و مکانی انجام دهید. جست و جوی توصیفی مانند نام، کد شعبه و ... و جست و جوی مکانی مانند جست و جوی خودپردازهای در فاصله ی معین از نقطه مورد نظر.<br/><br/>'+
                '<img src="http://172.16.0.14:8080/cmv/images/search.png" style="width:300px;" /><br/>',
                //position: 'left'
            },
            // {
            //     element: '#weightedsum_parent .dijitTitlePaneTitle',
            //     intro: '<h4>ابزار تحلیل مطلوبیت مکانی</h4>با استفاده از این ابزار با تعیین وزن لایه های مورد نظر در محدوده  مشخص می توانید نقشه ی مطلوبیت جانمایی دستگاه خودپرداز در آن محدوده را مشاهده نمایید. وزن های اولیه به صورت پیش فرض و با نظر کارشناسی قرار داده شده اند',
            //     position: 'left'
            // },
            {
                element: '#eMeasure_parent .dijitTitlePaneTitle',
                intro: '<h4>اندازه گیری و ترسیم</h4>با استفاده از این ابزار می توانید اشکال هندسی را بر روی نقشه ترسیم کرده و مقادیر مورد نظر را اندازه گیری نمایید.<br/><br/>'+
                '<img src="http://172.16.0.14:8080/cmv/images/measuring.png" style="width:300px;" /><br/>',
                //position: 'left'
            },
            // {
            //     element: '#heatmap_parent .dijitTitlePaneTitle',
            //     intro: '<h4>ایجاد نقشه های حرارتی</h4>با استفاده از این ابزار می توانید نقشه های چگالش هر لایه را با توجه به معیار مورد نظر مشاهده نمایید. به طور مثال چگالی دستگاه های با درصد تراکنش ناموفق در کدام مناطق بالاست و در کدام مناطق پایین است.',
            //     //position: 'left'
            // },
            {
                element: '#print_parent .dijitTitlePaneTitle',
                intro: '<h4>ابزار چاپ</h4>با استفاده از این ابزار می توانید از نقشه های تولید شده خروجی با فرمت های قابل تنظیم تهیه نمایید.',
                position: 'left'
            },
            {
                element: '#sidebarBottom',
                intro: '<h4>جدول توصیفی</h4>در این قسمت شما می توانید جداول اطلاعات توصیفی مربوط به نتایج جست و جوی خود بر روی عوارض را مشاهده نمایید و خروجی های متناسب با نیاز خود را در قالب فایل اکسل، شیپ فایل و ... تهبه نمایید.',
                position: 'left'
            },
            {
                element: '#helpDijit',
                intro: '<h4>مشاهده دوباره ی راهنما</h4>با کلیک بر روی این قسمت شما می توانید این راهنما را دوباره مشاهده نمایید.',
                position: 'left'
            }
        ]
    }
});