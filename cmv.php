<?php
    include 'core/init.php';
    $user_id = $_SESSION['user_id'];
    $user = $getFromU->userData($user_id);
    if($getFromU->loggedIn() === false){
        header('Location: '.BASE_URL.'index.php');
        die();
    }
    
?>

<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="application-name" content="cmv">
    <meta name="description" content="CMV - The Configurable Map Viewer. Community supported open source mapping framework. Works with the Esri JavaScript API, ArcGIS Server, ArcGIS Online and more. Make it your own!">
    <meta name="author" content="cmv.io">
    <link rel="shortcut icon" href="./favicon.png">
    <title>سامانه اطلاعات مکانی پارسا</title>
    
    <link rel="stylesheet" type="text/css" href="http://172.16.0.14:8080/arcgis_js_api/library/3.22/3.22/esri/css/esri.css">
    <link rel="stylesheet" href="http://172.16.0.14:8080/arcgis_js_api/library/3.22/3.22/dojox/widget/ColorPicker/ColorPicker.css" />
    <link rel="stylesheet" type="text/css" href="css/theme/flat/flat.css">
    <link rel="stylesheet" type="text/css" href="css/cmv-theme-overrides.css">
    <link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/font-farsi.css">
    <!-- <link rel="stylesheet" href="css/style-complete.css"/> -->


    <style>
        .chart{
            direction: ltr;
        }

        
    </style>

</head>

<body class="cmv flat" dir="rtl">
    <div class="appHeader">
        <div class="headerLogo">
            <img alt="logo" src="images/logo.png" height="54" />
        </div>
        <div class="headerTitle">
            <span id="headerTitleSpan">
            </span>
            <div id="subHeaderTitleSpan" class="subHeaderTitle">
            </div>
        </div>
        <div class="search">
            <div id='geocodeDijit'>
            </div>
        </div>
        <div class="user_name">
            <span id="user_name">
                <?php echo $user->userName;?>
            </span>
            <span style="display: none" id="user_group" title= "<?php echo $user->userGroup;?>">
            </span>
            <div id="user_title" class="user_title">
            <?php echo $user->userTitle;?>
            </div>
            <div class="dropdown">
                <button class="dropbtn">تنظیمات
                    <i class="fa fa-caret-down"></i>
                </button>
                <div class="dropdown-content">
                    <a href="password.php">تغییر رمز عبور</a>
                    <a href="includes/logout.php">خروج</a>
                </div>
            </div>
        </div>

        <div class="headerLinks">
            <div id="helpDijit">
            </div>
        </div>
    </div>
    <script type="text/javascript">
        var s = window.location.search, q = s.match(/locale=([^&]*)/i);
        var locale = (q && q.length > 0) ? q[1] : null;
        window.dojoConfig = {
            locale: "en-us",
            async: true
        };

    </script>
    <!--[if lt IE 9]>
            <script type="text/javascript" src="js/es5-shim.min.js"></script>
        <![endif]-->
    <script src="http://172.16.0.14:8080/arcgis_js_api/library/3.22/3.22/init.js"></script>
    <script src="js/config/app.js"></script>
</body>

</html>