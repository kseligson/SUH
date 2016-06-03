/**
 * Initialization
 */
var demographicsData = {};
var incomeData = {};
var dataChart, dataBar;
var regionName = "";
var lastClicked = "";
var dataFlag = 0; /* 0 --> Age
                   * 1 --> Race
                   * 2 --> Gender
                   * 3 --> Income
                   */

$(document).ready(function() {

  async.parallel(
    [
      initAgeData,
      initIncomeData
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

// Load income data
function initIncomeData(callback) {
  $.getJSON('/json/income.json', function(items) {
    incomeData = items;
  });
  callback(null, true);
}

/**
 * Load and process age data
 */
function initAgeData(callback) {

  $.getJSON('/json/demographics.json', function(items) {
    console.log('age', items);
    demographicsData = items;
  });

  lastClicked = "Coastal";
  // Initialize age chart
  dataChart = c3.generate({
    bindto: '#dataChart',
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

  dataBar = c3.generate({
    bindto: '#dataBar',
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
        width: 40 // this makes bar width 100px
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

function updateAgeData(name, callback) {
  var ageData = demographicsData;
  var region;

  // get data from demographics JSON
  ageData.map(function (elem) {
    if (elem.Area == name) {
      region = elem;
    }
  });
  console.log('HELLLLLLOO', region);
  dataChart.load({
    columns: [
      ["0-4", region.zero_to_4],
      ["5-14", region.five_to_14],
      ["15-24", region.fifteen_to_24],
      ["25-44", region.twentyfive_to_44],
      ["45-64", region.fortyfive_to_64],
      ["65+", region.sixtyfiveplus],
    ],
    unload: dataChart.columns,
  });
  $('text.c3-chart-arcs-title').text("Ratio for Age");

  dataBar.load({
    columns: [
      ["0-4", region.zero_to_4],
      ["5-14", region.five_to_14],
      ["15-24", region.fifteen_to_24],
      ["25-44", region.twentyfive_to_44],
      ["45-64", region.fortyfive_to_64],
      ["65+", region.sixtyfiveplus],
    ],
    unload: dataChart.columns,
  });
  $('p#bar-title').text("Number of People");
}

function updateRaceData(name, callback) {
  var raceData = demographicsData;
  var region;

  // get data from demographics JSON
  raceData.map(function (elem) {
    if (elem.Area == name) {
      region = elem;
    }
  });
  console.log('TESTTT', region);
  dataChart.load({
    columns: [
      ["White", region.number_of_white],
      ["Hispanic", region.number_of_hispanic],
      ["Black", region.number_of_black],
      ["Asian/Pacific Islander", region.number_of_asian],
      ["Other", region.number_of_other],
    ],
    unload: dataChart.columns,
  });
  $('text.c3-chart-arcs-title').text("Ratio for Race");

  dataBar.load({
    columns: [
      ["White", region.number_of_white],
      ["Hispanic", region.number_of_hispanic],
      ["Black", region.number_of_black],
      ["Asian/Pacific Islander", region.number_of_asian],
      ["Other", region.number_of_other],
    ],
    unload: dataChart.columns,
  });
  $('p#bar-title').text("Number of People");
}

function updateGenderData(name, callback) {
  var genderData = demographicsData;
  var region;

  // get data from demographics JSON
  genderData.map(function (elem) {
    if (elem.Area == name) {
      region = elem;
    }
  });
  console.log('TESTTT', region);
  dataChart.load({
    columns: [
      ["Male", region.number_of_males],
      ["Female", region.number_of_females],
    ],
    unload: dataChart.columns,
  });

  $('text.c3-chart-arcs-title').text("Ratio for Gender");
  dataBar.load({
    columns: [
      ["Male", region.number_of_males],
      ["Female", region.number_of_females],
    ],
    unload: dataChart.columns,
  });
  $('p#bar-title').text("Number of People");
}

function updateIncomeData(name, callback) {
  var incData = incomeData;
  var region;
  console.log('incomeData', incomeData);
  console.log('inc', incData);
  incData.map(function (elem) {
    if (elem.Area == name) {
      region = elem;
    }
  });
  console.log('region', region);
  dataChart.load({
    columns: [
      ["<15K", region.less_than_15k],
      ["15K-35K", region.fifteen_to_35k],
      ["35K-50K", region.thirtyfive_to_50k],
      ["50K-75K", region.fifty_to_75k],
      ["75K-100K", region.seventyfive_to_100k],
      ["100K-150K", region.onehundred_to_150k],
      ["150K-200K", region.onefifty_to_200k],
      [">200K", region.greater_than_200k],
    ],
    unload: dataChart.columns,
  });
  $('text.c3-chart-arcs-title').text("Ratio for Income");

  dataBar.load({
    columns: [
      ["<15K", region.less_than_15k],
      ["15K-35K", region.fifteen_to_35k],
      ["35K-50K", region.thirtyfive_to_50k],
      ["50K-75K", region.fifty_to_75k],
      ["75K-100K", region.seventyfive_to_100k],
      ["100K-150K", region.onehundred_to_150k],
      ["150K-200K", region.onefifty_to_200k],
      [">200K", region.greater_than_200k],
    ],
    unload: dataChart.columns,
  });
  $('p#bar-title').text("Number of Households");
}

function setAgeFlag() {
  dataFlag = 0;
  async.applyEach(
    [updateAgeData],
    lastClicked,
    function(err, result) {
      if (err)
        alert(err);
    });
}

function setRaceFlag() {
  dataFlag = 1;
  async.applyEach(
    [updateRaceData],
    lastClicked,
    function(err, result) {
      if (err)
        alert(err);
    });
}

function setGenderFlag() {
  dataFlag = 2;
  async.applyEach(
    [updateGenderData],
    lastClicked,
    function(err, result) {
      if (err)
        alert(err);
    });
}

function setIncomeFlag() {
  dataFlag = 3;
  async.applyEach(
    [updateIncomeData],
    lastClicked,
    function(err, result) {
      if (err)
        alert(err);
    });}

/**
 * Function to select region data
 */

function selectRegion(name) {
  // Display region name
  $('#chart-title').html(name);

  $.get('/demographics_age', function(items) {
    demographicsData = items;
    console.log('inside!');
  });

  if(dataFlag === 0) { // 0 for age
    async.applyEach(
      [updateAgeData],
      name,
      function(err, result) {
        if (err)
          alert(err);
      });
  } else if (dataFlag === 1) { // 1 for race
    async.applyEach(
      [updateRaceData],
      name,
      function(err, result) {
        if (err)
          alert(err);
      });
  } else if (dataFlag === 2) { // 2 for gender
    async.applyEach(
      [updateGenderData],
      name,
      function(err, result) {
        if (err)
          alert(err);
      });
  } else if (dataFlag === 3) { // 3 for income
    async.applyEach(
      [updateIncomeData],
      name,
      function(err, result) {
        if (err)
          alert(err);
      });
    }
}


function initMap() {
  $.get('./json/demographics.json', function(items) {

      function getColor(totalPop) {
        //console.log(totalPop);
        return totalPop > 150000  ? '#800026' :
               totalPop > 130000  ? '#BD0026' :
               totalPop > 110000  ? '#E31A1C' :
               totalPop > 90000   ? '#FC4E2A' :
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
       strokeColor: '#000',
       strokeWeight: 1,
       zIndex: 1
       };
      });

      map.data.addListener('mouseover', function(event) {
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {
        strokeWeight: 4,
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
        lastClicked = event.feature.getProperty('NAME').toLowerCase().capitalize();
        selectRegion(event.feature.getProperty('NAME').toLowerCase().capitalize());
      });
      var infoWindow = new google.maps.InfoWindow({
        content: ""
      });

      // map.data.addListener('mouseover', function(e) {
      //   console.log(e);
      //   infoWindow.setContent('<div style="line-height:1.00;overflow:hidden;white-space:nowrap;">' +
      //     e.feature.getProperty('NAME').toLowerCase().capitalize() + '</div>');
      //
      //   var anchor = new google.maps.MVCObject();
      //   var position;
      //   console.log('latlng', e.latLng);
      //   anchor.set("position", e.latLng);
      //   infoWindow.open(map, anchor);
      // });

  });

}
