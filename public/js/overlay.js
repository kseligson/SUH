/**
 * Initialization
 */
var demographicsData = {};
var incomeData = {};
var dataChart, dataBar;
var regionName = "";
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

  dataBar.load({
    columns: [
      ["Male", region.number_of_males],
      ["Female", region.number_of_females],
    ],
    unload: dataChart.columns,
  });
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

  console.log('dataChart', dataChart);

  // d3.select("svg").append("text")
  //   .attr("x", 100 )
  //   .attr("y", 50)
  //   .style("text-anchor", "middle")
  //   .text("Your chart title goes here");

  // console.log('text', d3.select("svg").attr("innerText"));

  // d3.select("svg").attr("innerText").text("Test");

  // dataChart.donut.title("Test");

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

}

function setAgeFlag() {
  dataFlag = 0;
  async.applyEach(
    [updateAgeData],
    // name,
    function(err, result) {
      if (err)
        alert(err);
    });
}

function setRaceFlag() {
  dataFlag = 1;
  async.applyEach(
    [updateRaceData],
    // name,
    function(err, result) {
      if (err)
        alert(err);
    });
}

function setGenderFlag() {
  dataFlag = 2;
  async.applyEach(
    [updateGenderData],
    // name,
    function(err, result) {
      if (err)
        alert(err);
    });
}

function setIncomeFlag() {
  dataFlag = 3;
  async.applyEach(
    [updateIncomeData],
    // name,
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
        styles: [{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]}]
      });

      map.data.loadGeoJson('./json/county2.json');

      map.data.setStyle(function(feature) {
      //console.log('asdasd', getColor(popData[1]));
      //console.log('prop', feature.getProperty('SRA'));
       return {
       fillColor: getColor(feature.getProperty('total')), // call function to get color for state based on the COLI (Cost of Living Index)
       fillOpacity: 0.8,
       strokeColor: '#b3b3b3',
       strokeWeight: 1,
       zIndex: 1
       };
      });

      map.data.addListener('mouseover', function(event) {
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {fillColor: '#ffffff'});
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
