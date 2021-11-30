var map;

$(function() {
    var baseLaye
    map = L.map('map').setView([18.967013139608905, 72.84107208251953], 12);
    // var osmLayer = L.tileLayer('https://geo.klp.org.in/osm/{z}/{x}/{y}.png', {
    //     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    //     maxZoom: 18
    // });
    var bingLayer = new L.BingLayer("Ar-SXsfRZ8jqD7u18tYZEtoFOhPYyU4zcwe2_sMbYsAXNvDlwlo1gftifmIXaR0e", {

    }).addTo(map); 
    // var mapboxLayer = L.tileLayer('http://a.tiles.mapbox.com/v4/aj.03e9e12d/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2FuamF5YiIsImEiOiI3NjVvMFY0In0.byn_eCZGAwR1yaPeC-SVKw', {
    //     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    //     maxZoom: 18
    // });

    var warperLayer = L.tileLayer('https://mapwarper.net/maps/tile/' + WARPER_ID + '/{z}/{x}/{y}.png')
        .addTo(map).setOpacity(0.65);
    var geojsonLayer;

    $('#rangeSlider').on('input', function(e) {
        updateOpacity();
    });

    $.getJSON("../data/" + WARPER_ID + ".json", {}, function(geojson) {
        console.log("geojson", geojson);
        geojsonLayer = L.geoJson(geojson, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng);
            },
            onEachFeature: function(feature, layer) {
                console.log("feature", feature);
                layer.bindPopup(getPopupHTML(feature.properties));
                // layer.on('click', function(e) {
                //     showInfo(feature.properties);
                // });
            }
        });
        geojsonLayer.addTo(map);
        instantiateLayerControl();
    });
    

    // var otherLayer = L.tileLayer('http://mapwarper.net/maps/tile/4425/{z}/{x}/{y}.png');

    function instantiateLayerControl() {
        var overlayMaps = {
            "Warper Layer": warperLayer,
            "Vector Layer": geojsonLayer
        };

        var baseMaps = {
            'Mapbox Pencil Map': mapboxLayer,
            'OSM Streets': osmLayer,
            'Bing Satellite': bingLayer
        };

        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false,
            position: 'bottomleft'
        }).addTo(map);
    }
    function updateOpacity() {
        var value = $('#rangeSlider').val();
        map.eachLayer(function (layer) {
            console.log(layer);
            if (layer.hasOwnProperty('_url') && layer._url.indexOf("mapwarper.net") !== -1) {
                layer.setOpacity(value);
            }
        })
    }

    function getPopupHTML(data) {
        var html = '';
        if (data.hasOwnProperty('tittle') && data.tittle) {
            html += '<h3>' + data.tittle + '</h3>';
        }
        if (data.hasOwnProperty('description') && data.description) {
            html += '<p>' + data.description + '</p>';
        }
        if (data.hasOwnProperty('file.jpg') && data['file.jpg']) {
            html += '<a target="_blank" href="../images/' + data['file.jpg'] + '">';
            html += '<img style="display:block;margin:0 auto;" width="200" src="../images/' + data['file.jpg'] + '" />';
            html += '</a>';
        }
        return html;
    }

    // function showInfo(data) {
    //     $('#pointTitle').text(data.title);
    //     $('#pointDescription').text(data.description);
    //     $('#pointImage').attr("src", "../images/" + data.image);
    // }

});

$(function(){
    //menu: off canvas
    $('.nav-trigger').click(function(event){
        event.stopPropagation();
        $(this).toggleClass("nav-trigger-active");
        $('.rightBox').toggleClass('nav-menu-close');
    });

    //active menu link
     $("#linksList a").each(function() {   
           if (this.href == window.location.href) {
               $(this).addClass("selected-menu");
           }
     });
});
