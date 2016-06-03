/**
 * Initialization
 */
var ageData = {};
var ageChart, ageBar;
var regionName = "";

$(document).ready(function() {

  async.parallel(
    [
      initAgeData
    ],
  function(err, results) {
    if (err)
      alert(err);

    // Only initialize once everything is loaded.
    initMap();
  });
});

// Capitalize the first letter of each word
String.prototype.capitalize = function(){
      //  return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
       return this.replace(/([^ -])([^ -]*)/gi,function(v,v1,v2){ return v1.toUpperCase()+v2; } );
      };

/**
 * Load and process age data
 */
function initAgeData(callback) {

  $.getJSON('/json/demographics.json', function(items) {
    console.log('age', items);
    ageData = items;
  });

  // Initialize age chart
  ageChart = c3.generate({
    bindto: '#ageChart',
    // size: {
    //   height: 400,
    //   width: 400
    // },
    data: {
      // iris data from R
      columns: [ // default data is Coastal
        ["0-4", 2489],
        ["5-14", 5171],
        ["15-24", 11046],
        ["25-44", 27951],
        ["45-64", 16501],
        ["65+", 12735],
      ],
      type : 'donut',
      transition: null
    },
    donut: {
      title: "Ratio for Population Age"
    }
  });

  ageBar = c3.generate({
    bindto: '#ageBar',
    data: {
        columns: [
          ["0-4", 2489],
          ["5-14", 5171],
          ["15-24", 11046],
          ["25-44", 27951],
          ["45-64", 16501],
          ["65+", 12735],
        ],
        type: 'bar'
    },
    bar: {
        width: 50 // this makes bar width 100px
    },
    axis: {
        x: {
            type: 'category',
            categories: ['']
        },
        y: {
            label: 'Number of People'
        }
    }
  });

  callback(null, true);
}

function getRegionName(region) {
  regionName = region;
}

function updateAgeData(name, callback) {
  var regionData = ageData;
  var region;

  // get data from demographics JSON
  ageData.map(function (elem) {
    if (elem.Area == name) {
      region = elem;
    }
  });
  console.log('HELLLLLLOO', region);
  ageChart.load({
    columns: [
      ["0-4", region.zero_to_4],
      ["5-14", region.five_to_14],
      ["15-24", region.fifteen_to_24],
      ["25-44", region.twentyfive_to_44],
      ["45-64", region.fortyfive_to_64],
      ["65+", region.sixtyfiveplus],
    ],
    unload: ageChart.columns,
  });

  ageBar.load({
    columns: [
      ["0-4", region.zero_to_4],
      ["5-14", region.five_to_14],
      ["15-24", region.fifteen_to_24],
      ["25-44", region.twentyfive_to_44],
      ["45-64", region.fortyfive_to_64],
      ["65+", region.sixtyfiveplus],
    ],
    unload: ageChart.columns,
  });
}

/**
 * Function to select region data
 */

function selectRegion(name) {
  // Display region name
  $('#chart-title').html(name);

  $.get('/demographics_age', function(items) {
    ageData = items;
    console.log('inside!');
  });

  async.applyEach(
    [updateAgeData],
    name,
    function(err, result) {
      if (err)
        alert(err);
    });
}


function initMap() {
  $.get('./json/demographics.json', function(items) {

      function getColor(totalPop) {
        //console.log(totalPop);
        return totalPop > 150000 ? '#800026' :
               totalPop > 130000  ? '#BD0026' :
               totalPop > 110000  ? '#E31A1C' :
               totalPop > 90000  ? '#FC4E2A' :
               totalPop > 70000   ? '#FD8D3C' :
               totalPop > 50000   ? '#FEB24C' :
               totalPop > 10000   ? '#FED976' :
                          '#FFEDA0';
      }

      var map = new google.maps.Map(d3.select("#map").node(), {
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(33, -117.000),
        streetViewControl: false,
        styles: [
          {
              "elementType": "labels.text",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "landscape.natural",
              "elementType": "geometry.fill",
              "stylers": [
                  {
                      "color": "#f5f5f2"
                  },
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "administrative",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "transit",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.attraction",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "landscape.man_made",
              "elementType": "geometry.fill",
              "stylers": [
                  {
                      "color": "#ffffff"
                  },
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "poi.business",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.medical",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.place_of_worship",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.school",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.sports_complex",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                  {
                      "color": "#ffffff"
                  },
                  {
                      "visibility": "simplified"
                  }
              ]
          },
          {
              "featureType": "road.arterial",
              "stylers": [
                  {
                      "visibility": "simplified"
                  },
                  {
                      "color": "#ffffff"
                  }
              ]
          },
          {
              "featureType": "road.highway",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "color": "#ffffff"
                  },
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "road.highway",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "road.arterial",
              "stylers": [
                  {
                      "color": "#ffffff"
                  }
              ]
          },
          {
              "featureType": "road.local",
              "stylers": [
                  {
                      "color": "#ffffff"
                  }
              ]
          },
          {
              "featureType": "poi.park",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "landscape",
              "stylers": [
                  {
                      "color": "#e5e8e7"
                  }
              ]
          },
          {
              "featureType": "poi.park",
              "stylers": [
                  {
                      "color": "#8ba129"
                  }
              ]
          },
          {
              "featureType": "road",
              "stylers": [
                  {
                      "color": "#ffffff"
                  }
              ]
          },
          {
              "featureType": "poi.sports_complex",
              "elementType": "geometry",
              "stylers": [
                  {
                      "color": "#c7c7c7"
                  },
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.park",
              "stylers": [
                  {
                      "color": "#91b65d"
                  }
              ]
          },
          {
              "featureType": "poi.park",
              "stylers": [
                  {
                      "gamma": 1.51
                  }
              ]
          },
          {
              "featureType": "road.local",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "road.local",
              "elementType": "geometry",
              "stylers": [
                  {
                      "visibility": "on"
                  }
              ]
          },
          {
              "featureType": "poi.government",
              "elementType": "geometry",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "landscape",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "road",
              "elementType": "labels",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [
                  {
                      "visibility": "simplified"
                  }
              ]
          },
          {
              "featureType": "road.local",
              "stylers": [
                  {
                      "visibility": "simplified"
                  }
              ]
          },
          {
              "featureType": "road"
          },
          {
              "featureType": "road"
          },
          {},
          {
              "featureType": "road.highway"
          }
      ]
      });

      map.data.loadGeoJson('./json/county2.json');

      map.data.setStyle(function(feature) {
      //console.log('asdasd', getColor(popData[1]));
      //console.log('prop', feature.getProperty('SRA'));
       return {
       fillColor: getColor(feature.getProperty('total')), // call function to get color for state based on the COLI (Cost of Living Index)
       fillOpacity: 1,
       strokeColor: '#ffffff',
       strokeWeight: 1,
       zIndex: 1
       };
      });

      map.data.addListener('mouseover', function(event) {
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {
        strokeWeight: 3,
        zIndex: 2,
        });
        $("#location-name").text(event.feature.getProperty('NAME').toLowerCase().capitalize());
      });

      map.data.addListener('mouseout', function(event) {
        //map.data.revertStyle();
      });

      map.data.addListener('click', function(event) {
        //console.log('event', event.feature.getProperty('NAME'));
        //console.log('event-lowercase', event.feature.getProperty('NAME').toLowerCase().capitalize());
        selectRegion(event.feature.getProperty('NAME').toLowerCase().capitalize());
      });
  });

}
