/**
 * Initialization
 */
var ageData = {};
var ageChart;

$(document).ready(function() {
  // Add loading animation
  $('.right-form')
      .before('<div class="loading">' +
      '<div class="sk-spinner sk-spinner-three-bounce">' +
      '<div class="sk-bounce1"></div>' +
      '<div class="sk-bounce2"></div>' +
      '<div class="sk-bounce3"></div>' +
      '</div>' +
      '</div>');

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

/**
 * Load and process age data
 */
function initAgeData(callback) {
  $.get('/demographics_age', function(items) {
    ageData = items;
  });

  // Initialize age chart
  ageChart = c3.generate({
    bindto: '#ageChart',
    data: {
      // iris data from R
      columns: [
      ],
      type : 'pie',
      transition: null
    }
  });

  callback(null, true);
}

/**
 * Fetch age data
 * @param name
 * @returns {*}
 */
function getAgeData(name) {
  return _.filter(ageData, function(item) {
    if(item.neighborhoods instanceof Array) {
      for (var i = 0; i < item.neighborhoods.length; i++) {
        if (item.neighborhoods[i] === name)
          return true;
      }
    }
    return false;
  });
}

/**
 * Update age data chart
 */
function updateAgeData(name, callback) {
  var regions = getAgeData(name);

  if(!regions)
  {
    ageChart.unload();
    ageChart.load({ columns: ['Data Unavailable', 1]});
  }

  // Get populations of each age group and average
  var segments = ['0-4', '5-14', '15-24', '25-44', '45-64', '65+'];
  var segmentAvg = [];
  for (var i = 0; i < segments.length; i++) {
    // Select the segment
    var segment = _.filter(regions, {Age: segments[i]});

    // Define the segment
    var result = [];
    result.push(segments[i]);

    for (var j = 0; j < segment.length; j++) {
      result.push(segment[j].Population);
    }

    segmentAvg.push(result);
  }

  // Switch out data
  ageChart.load({
    columns: segmentAvg
  });

  callback(null);
}

/**
 * Function to select region data
 */
function selectRegion(name) {
  // Display region name
  $('#chart-title').html(name);
  console.log('ageChart', ageChart);

  $.get('/demographics_age', function(items) {
    ageData = items;
    console.log('inside!');
  });

  console.log('ageData', JSON.stringify(ageData));

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
    zoom: 9,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng(32.9185, -117.266),
    streetViewControl: false,
    styles: [{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]}]
  });

  map.data.loadGeoJson('./json/county2.json');
  map.data.setStyle({
    fillColor: 'gray',
    strokeWeight: 1
  });

  var infoWindow = new google.maps.InfoWindow();

  map.data.addListener('mouseover', function(event) {
    map.data.revertStyle();
    map.data.overrideStyle(event.feature, {fillColor: 'black'});

    selectRegion(event.feature.getProperty('NAME'));

    infoWindow.setContent("<div>" + event.feature.H.NAME + "</div>");
    infoWindow.setPosition(event.latLng);
    infoWindow.open(map);
  });

  map.data.addListener('mouseout', function(event) {
    map.data.revertStyle();
  });

  map.data.addListener('click', function(event) {
    console.log(event);
  });
}
