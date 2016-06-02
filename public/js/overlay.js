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
  var map = new google.maps.Map(d3.select("#map").node(), {
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng(33, -117.000),
    streetViewControl: false,
    draggable: false,
    styles: [{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]}]
  });

  map.data.loadGeoJson('./json/county2.json');
  map.data.setStyle({
    fillColor: 'gray',
    strokeWeight: 1
  });

  map.data.addListener('mouseover', function(event) {
    map.data.revertStyle();
    map.data.overrideStyle(event.feature, {fillColor: 'black'});
    $("#location-name").text(event.feature.getProperty('NAME').toLowerCase().capitalize());
  });

  map.data.addListener('mouseout', function(event) {
    //map.data.revertStyle();
  });

  map.data.addListener('click', function(event) {
    console.log('event', event.feature.getProperty('NAME'));
    console.log('event-lowercase', event.feature.getProperty('NAME').toLowerCase().capitalize());
    selectRegion(event.feature.getProperty('NAME').toLowerCase().capitalize());
  });
}
