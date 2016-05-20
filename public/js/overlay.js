function initMap() {
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {
    center: {lat: 32.9185, lng: -117.266},
      //{lat: 32.7157, lng: -117.1611},
      //32.987052, -117.275426
      //32.949346, -117.266761
      //32.9185, -117.1382
    zoom: 10
  });

  map.data.loadGeoJson('./json/county2.json');
  // map.data.setStyle({
  //   fillColor: 'gray',
  //   strokeWeight: 1
  // });

  map.data.addListener('mouseover', function(event) {
    // document.getElementById('info-box').textContent =
    //     event.feature.getProperty('letter');
    map.data.overrideStyle(event.feature.setProperty({
      fillColor: 'red'
    }));
  });

  // Color each letter gray. Change the color when the isColorful property
  // is set to true.
  map.data.setStyle(function(feature) {
    var color = 'gray';
    if (feature.getProperty('isColorful')) {
      color = feature.getProperty('color');
    }
    return /** @type {google.maps.Data.StyleOptions} */({
      fillColor: color,
      strokeColor: color,
      strokeWeight: 2
    });
  });

  // Reference: https://developers.google.com/maps/documentation/javascript/datalayer#change_appearance_dynamically

  // When the user clicks, set 'isColorful', changing the color of the letters.
  map.data.addListener('click', function(event) {
    event.feature.setProperty('isColorful', true);
  });

  // When the user hovers, tempt them to click by outlining the letters.
  // Call revertStyle() to remove all overrides. This will use the style rules
  // defined in the function passed to setStyle()
  map.data.addListener('mouseover', function(event) {
    map.data.revertStyle();
    map.data.overrideStyle(event.feature, {strokeWeight: 8});
  });

  map.data.addListener('mouseout', function(event) {
    map.data.revertStyle();
  });
}
