/*** Global object that contains the app ***/
var app = app || {};

// keep our map stuff in a part of the app object as to not pollute the global name space
app.map = (function (w, d, $, _) {

    /*** local variables for map parts and layers ***/
    var el = {
        map: null,
        cdbURL: null,
        styles: null,
        sql: null,
        tonerLite: null,
        satellite: true,
        taxLots: null,
        dobPermits: null,
        dobPermitsA1: null,
        dobPermitsA2A3: null,
        dobPermitsNB: null
    };

    // reference cartocss styles from mapStyles.js
    el.styles = app.mapStyles;
    // url to cartodb bushwick community map viz json
    el.cdbURL = "https://jdelrojo1927.cartodb.com/api/v2/viz/cda1aad8-db27-11e5-8353-0e5db1731f59/viz.json";

    // queries for map pluto tax lots
    // sent to cartodb when layer buttons clicked
    el.sql = {
        zona0: "SELECT * FROM ciclovia where name = 'Atn'",
        zona1: "SELECT * FROM ciclovia where name = 'Axxa colpatr\u00EDa'",
        zona2: "SELECT * FROM ciclovia where name = 'Conexi\u00F3n'",
        zona3: "SELECT * FROM ciclovia where name = 'Formaci\u00F3n'",
        zona4: "SELECT * FROM ciclovia where name = 'Gasolina'",
        zona5: "SELECT * FROM ciclovia where name = 'Informaci\u00F3n '",
        zona6: "SELECT * FROM ciclovia where name = 'Juegos'",
        zona7: "SELECT * FROM ciclovia where name = 'Modulos'",
        zona8: "SELECT * FROM ciclovia where name = 'Recreovia'",
        zona9: "SELECT * FROM ciclovia where name = 'Sitio de interes'",
    };

    // set up the map
    var initMap = function () {
        // map paramaters
        var params = {
            center: [4.720624, -74.074859],
            minZoom: 13,
//      maxZoom : 20,
            zoom: 13,
//      maxBounds : L.latLngBounds([40.670809,-73.952579],[40.713565,-73.870354]),
            cartodb_logo: false,
            legends: true
        }
        // instantiate the Leaflet map
        // el.map = L.map('map', params);
        // el.tonerLite = new L.StamenTileLayer('toner-lite');
        // add stamen toner layer as default base layer
        // el.map.addLayer(el.tonerLite);
        // add the tax lot layer from cartodb
        getCDBData(params);

    }

    // function to load map pluto tax lot layer and dob permit layer 
    // from CartoDB 
    var getCDBData = function (mapOptions) {
        cartodb.createVis('map', el.cdbURL, mapOptions, {
            cartodb_logo: false,
            legends: false
        },
        function (vis, layers) {
            // store the map pluto tax lot sublayer
            layer = layers[1];
            // layer.getSubLayer(0).setCartoCSS(el.styles.regular);
            //layer.getSubLayer(0).setSQL(el.sql.all);
            el.taxLots = layer.getSubLayer(0);

            // store the dob permits a1 sublayer
            el.dobPermitsA1 = layer.createSubLayer({
                sql: "SELECT * FROM vereda_merge where zona = 'Zona 0'",
                cartocss: '#exp_codedjobs_a1 {marker-width: 7; marker-fill: hsl(0,0%,35%); marker-line-color: white; marker-line-width: 0;}',
                interactivity: ['address']
            });

            // store the dob permits a2a3 sublayer
            el.dobPermitsA2A3 = layer.createSubLayer({
                sql: "SELECT * FROM vereda_merge where zona = 'Zona 1'",
                cartocss: '#exp_codedjobs_a1 {marker-width: 7; marker-fill: hsl(100,0%,60%); marker-line-color: white; marker-line-width: 0;}',
                interactivity: 'address'
            });

            // store the dob permits nb sublayer
            el.dobPermitsNB = layer.createSubLayer({
                sql: "SELECT * FROM vereda_merge where zona = 'Zona 2'",
                cartocss: '#exp_codedjobs_a1 {marker-width: 7; marker-fill: hsl(350,0%,10%); marker-line-color: white; marker-line-width: 0;}',
                interactivity: 'address'
            });

            var event = function (e) {
                $('#tool-tip').css({
                    left: e.pageX,
                    top: e.pageY
                });
            };

            // vis.addOverlay({
            //   type: 'tooltip',
            //   position : 'top|center',
            //   template : '<p>{{address}}</p>'
            // });                      

            // hide sublayers for dob permits
            var num_sublayers = layer.getSubLayerCount();
            for (var i = 1; i < num_sublayers; i++) {
                //console.log('sublayers: ', layer.getSubLayer(i)); 
                layer.getSubLayer(i).setInteraction(true);
                layer.getSubLayer(i).infowindow.set('template', $('#infowindow_template').html())
                        .on('error', function (err) {
                            console.log('infowindow error: ', err);
                        });

                layer.getSubLayer(i).on('featureOver', function (e, pos, latlng, data) {
                    $('#tool-tip').html('<p>' + data.address + '</p>');
                    $(document).bind('mousemove', event);
                    $('#tool-tip').show();
                });

                layer.getSubLayer(i).on('featureOut', function (e, pos, latlng, data) {
                    //Make the tooltip go away when off cities
                    $('#tool-tip').hide();
                    $(document).unbind('mousemove', event, false);
                });

                layer.getSubLayer(i).hide();

            }

        });//.addTo(el.map);    
    };

    // change the cartoCSS of a layer
    var changeCartoCSS = function (layer, css) {
        layer.setCartoCSS(css);
    };

    // change SQL query of a layer
    var changeSQL = function (layer, sql) {
        layer.setSQL(sql);
    }

    // corresponding cartoCSS changes to tax lot layer buttons
    var taxLotActions = {
        zona0: function () {
            changeSQL(el.taxLots, el.sql.zona0);
            return true;
        },
        zona1: function () {
            changeSQL(el.taxLots, el.sql.zona1);
            return true;
        },
        zona2: function () {
            changeSQL(el.taxLots, el.sql.zona2);
            return true;
        },
        zona3: function () {
            changeSQL(el.taxLots, el.sql.zona3);
            return true;
        },
        zona4: function () {
            changeSQL(el.taxLots, el.sql.zona4);
            return true;
        },
        zona5: function () {
            changeSQL(el.taxLots, el.sql.zona5);
            return true;
        },
        zona6: function () {
            changeSQL(el.taxLots, el.sql.zona6);
            return true;
        },
        zona7: function () {
            changeSQL(el.taxLots, el.sql.zona7);
        },
        zona8: function () {
            changeSQL(el.taxLots, el.sql.zona8);
            return true;
        },
        zona9: function () {
            changeSQL(el.taxLots, el.sql.zona9);
        },
    };

    // add tax lot layer button event listeners
    var initButtons = function () {
        $('.button').click(function () {
            $('.button').removeClass('selected');
            $(this).addClass('selected');
            taxLotActions[$(this).attr('id')]();
        });
    }

    // change dob permit layer sql based on check box boolean
    var initCheckboxesTwo = function () {
        // checkboxes for dob permit layer
        var checkboxDOB = $('input.dob:checkbox'),
                $a1 = $('#a1'),
                $a2a3 = $('#a2a3'),
                $nb = $('#nb');

        // toggle A1 major alterations
        $a1.change(function () {
            if ($a1.is(':checked')) {
                el.dobPermitsA1.show();
                // el.dobPermitsA1.setInteraction(true);
                el.dobPermitsA1.setInteractivity('address');
            } else {
                el.dobPermitsA1.hide();
            }
            ;
        });

        // toggle A2, A3 minor alterations
        $a2a3.change(function () {
            if ($a2a3.is(':checked')) {
                el.dobPermitsA2A3.show();
                // el.dobPermitsA2A3.setInteraction(true);
                //el.dobPermitsA2A3.setInteractivity('address, job, initialcos, jt_description, ownerphone, ownername, ownertype');
            } else {
                el.dobPermitsA2A3.hide();
            }
            ;
        });

        // toggle NB new buildings
        $nb.change(function () {
            if ($nb.is(':checked')) {
                el.dobPermitsNB.show();
                // el.dobPermitsNB.setInteraction(true);
                // el.dobPermitsNB.setInteractivity('address, job, initialcos, jt_description, ownerphone, ownername, ownertype'); 
            } else {
                el.dobPermitsNB.hide();
            }
            ;
        });
    }

    // get it going!
    var init = function () {
        initMap();
        initButtons();
        initCheckboxesTwo();
    }

    // only return init() and the stuff in the el object
    return {
        init: init,
        el: el
    }

})(window, document, jQuery, _);

// call app.map.init() once the dom is loaded
window.addEventListener('DOMContentLoaded', function () {
    app.map.init();
    timerangeUI();
});