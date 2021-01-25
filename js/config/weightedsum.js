define({
    map: true,
    identifyLayerInfos: true,
    //proxy_url: 'http://localhost:8080/cmv/proxy/PHP/proxy.php',

    //    var path = location.pathname.replace(/[^\/]+$/, '');


    weightedSumLayers: [

        {
            id: 3,
            name: "همدان",
            enName:"Hamedan",
            // path: "C:/ARCGISSERVERFILES/Kernels/Hamedan/Hamedan_kernels.gdb",
            path: "http://172.16.0.14:8080/Kernels/index.php?name=Hamedan",
            layerIds: [14, 29, 6, 23, 16, 10, 4, 39, 19, 26, 13, 5, 25, 2, 22, 43, 18, 28, 20, 37, 42, 41, 30, 12, 9, 17, 15, 31, 35, 38, 36, 40, 33, 8, 32, 27, 1, 24, 34, 11, 21, 7, 0, 3],
            layerEnNames: ["Hamedan_lodging", "Hamedan_Clinics_Pharmacy", "Hamedan_car_repair", "Hamedan_stadium", "Hamedan_taxi_stand", "Hamedan_Parking", "Hamedan_Religious", "Hamedan_car_dealer", "Hamedan_car_wash",
                "Hamedan_embassy", "Hamedan_fire_station", "Hamedan_museum", "Hamedan_gym", "Hamedan_Parks", "Hamedan_local_government_office", "Hamedan_movie_theater", "Hamedan_bus_station", "Hamedan_supermarket", "Hamedan_courthouse",
                "Hamedan_Education", "Hamedan_post_office", "Hamedan_bakery", "Hamedan_gas_station", "Hamedan_storage", "Hamedan_shopping_mall", "Hamedan_police", "Hamedan_hospital", "Hamedan_library", "Hamedan_insurance_agency",
                "Hamedan_hair_care", "Hamedan_beauty_salon", "Hamedan_Amusement_park", "Hamedan_Cafe", "Hamedan_home_goods_store", "Hamedan_real_estate_agency", "Hamedan_city_hall", "Hamedan_furniture_store", "Hamedan_lawyer",
                "Hamedan_Stores", "Hamedan_cemetery", "Hamedan_department_store", "Hamedan_restaurant", "Hamedan_roads", "Hamedan_population",
            ],
            layerWeights: [6.75, 6.75, 7.5, 5, 7.5, 8, 5, 7.75, 9, 5.75, 1.25, 2.5, 5.25, 4.75, 6.25, 6.5, 6, 7, 5.25, 5, 5.25,
                5.75, 6, 1.5, 9, 5.75, 6.5, 5.75, 6.75, 6.75, 6.5, 7.5, 7.25, 8, 6.5, 5.75, 8.5, 5.75, 8, 1.25, 9, 7.5, 8, 8.5],
            layerRadiuses: ['150', '150', '100', '400', '100', '250', '100', '150', '200', '250', '100', '150', '100', '300', '150', '100', '100', '100', '150', '150', '200',
                '100', '120', '150', '300', '200', '250', '100', '100', '100', '100', '500', '100', '200', '150', '300', '250', '100', '200', '350', '250', '150', '30', '30'],
        },
        {
            id: 3,
            name: "اهواز",
            enName:"Ahwaz",
            // path: "http://192.168.100.96:8080/Kernels/Ahwaz/Ahwaz_kernels.gdb",
            path: "http://172.16.0.14:8080/Kernels/index.php?name=Ahwaz",
            layerIds: [24, 28, 9, 41, 21, 44, 29, 23, 17, 32, 30, 4, 12, 40, 5, 45, 10, 6, 27, 37, 25, 46, 35, 39, 8, 11, 15, 43, 0, 19, 16, 42, 3, 2, 31, 26, 33, 13, 34, 38, 22, 1, 14, 7, 20, 18, 36],
            layerEnNames: ['Ahwaz_amusement_park', 'Ahwaz_shopping_mall', 'Ahwaz_furniture_store', 'Ahwaz_Stores', 'Ahwaz_hospital', 'Ahwaz_police', 'Ahwaz_courthouse', 'Ahwaz_bakery', 'Ahwaz_gym', 'Ahwaz_storage',
                'Ahwaz_gas_station', 'Ahwaz_embassy', 'Ahwaz_Parks', 'Ahwaz_Cafe', 'Ahwaz_museum', 'Ahwaz_supermarket', 'Ahwaz_city_hall', 'Ahwaz_lodging', 'Ahwaz_jewelry_store', 'Ahwaz_car_dealer',
                'Ahwaz_fire_station', 'Ahwaz_Religious', 'Ahwaz_subway_station', 'Ahwaz_local_government_office', 'Ahwaz_lawyer', 'Ahwaz_home_goods_store', 'Ahwaz_insurance_agency', 'Ahwaz_hair_care', 'Ahwaz_railway_station',
                'Ahwaz_real_estate_agency', 'Ahwaz_department_store', 'Ahwaz_school', 'Ahwaz_car_wash', 'Ahwaz_library', 'Ahwaz_restaurant', 'Ahwaz_stadium', 'Ahwaz_post_office', 'Ahwaz_Clinics_Pharmacy', 'Ahwaz_beauty_salon',
                'Ahwaz_Parking', 'Ahwaz_bus_station', 'Ahwaz_airport', 'Ahwaz_movie_theater', 'Ahwaz_taxi_stand', 'Ahwaz_car_repair', 'Ahwaz_Roads', 'Ahwaz_population',
            ],
            layerWeights: [7.5, 9, 8.5, 8, 6.5, 5.75, 5.25, 5.75, 5.25, 1.5, 6, 5.75, 4.75, 7.25, 2.5, 7, 5.75, 1.25, 6.75, 8, 7.75, 1.25,
                5, 7.5, 6.25, 5.75, 8, 6.75, 6.75, 7.5, 6.5, 9, 5, 9, 5.75, 7.5, 5, 5.25, 6.75, 6.5, 8, 6, 6.5, 6.5, 7.5, 7.5, 8, 8.5],
            layerRadiuses: ['500', '300', '150', '150', '250', '200', '150', '100', '100', '150', '120', '250', '300', '100', '150', '100', '300', '350', '150', '100', '150', '100', '100',
                '200', '150', '100', '200', '100', '100', '500', '150', '250', '150', '200', '100', '150', '400', '200', '150', '100', '250', '100', '750', '100', '100', '100', '30', '30'],
        },
        {
            id: 3,
            name: "شیراز",
            enName:"Shiraz",
            // path: "http://192.168.100.96:8080/Kernels/Shiraz/Shiraz_kernels.gdb",
            path: "http://172.16.0.14:8080/Kernels/index.php?name=Shiraz",
            layerIds: [30, 24, 2, 41, 7, 20, 44, 45, 42, 14, 38, 23, 46, 26, 0, 34, 35, 12, 22, 17, 19, 27, 36, 28, 4, 11, 43, 32, 5, 15, 9, 6, 21, 16, 18, 25, 13, 1, 29, 3, 40, 37, 33, 10, 8, 31, 39,
            ],
            layerEnNames: ["Shiraz_park", "Shiraz_cafe", "Shiraz_religious", "Shiraz_clinics", "Shiraz_restaurant", "Shiraz_amusement_park", "Shiraz_stores", "Shiraz_bus_station", "Shiraz_car_dealer", "Shiraz_airport",
                "Shiraz_bakery", "Shiraz_beauty_salon", "Shiraz_car_repair", "Shiraz_car_wash", "Shiraz_cemetery", "Shiraz_city_hall", "Shiraz_convenience_store", "Shiraz_courthouse", "Shiraz_department_store",
                "Shiraz_fire_station", "Shiraz_furniture_store", "Shiraz_gas_station", "Shiraz_gym", "Shiraz_hair_care", "Shiraz_hospital", "Shiraz_insurance_agency", "Shiraz_lawyer", "Shiraz_library",
                "Shiraz_local_government_office", "Shiraz_lodging", "Shiraz_movie_theater", "Shiraz_museum", "Shiraz_parking", "Shiraz_police", "Shiraz_post_office", "Shiraz_real_estate_agency", "Shiraz_school", "Shiraz_stadium",
                "Shiraz_shopping_mall", "Shiraz_storage", "Shiraz_subway_station", "Shiraz_supermarket", "Shiraz_taxi_stand", "Shiraz_train_station", "Shiraz_zoo", "Shiraz_population", "Shiraz_roads",
            ],
            layerWeights: [4.5, 7.25, 5, 6.75, 7.5, 7.5, 8, 6, 7.75, 6.5, 5.75, 6.5, 7.5, 9, 1.25, 5.75, 8, 5.25, 9, 6.75, 1.25,
                8.5, 6, 5.25, 6.75, 8, 6.5, 6.75, 5.75, 5.75, 6.25, 6.75, 6.5, 2.5, 8, 5.75, 5.25, 6.5, 5, 5, 9, 1.5, 7.5, 7, 7.5, 7.5, 7.5, 8.5, 8],
            layerRadiuses: ['300', '100', '100', '150', '150', '500', '150', '100', '150', '750', '100', '100', '100', '200', '350', '300', '150', '150', '250', '150', '100', '150', '120',
                '100', '100', '200', '250', '100', '100', '100', '150', '150', '100', '150', '250', '200', '200', '150', '150', '400', '300', '150', '200', '100', '100', '500', '500', '30', '30'],
        }
    ]

});
