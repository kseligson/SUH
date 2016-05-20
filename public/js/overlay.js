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
  map.data.setStyle({
    fillColor: 'gray',
    strokeWeight: 1
  });

  map.data.addListener('mouseover', function(event) {
    map.data.revertStyle();
    map.data.overrideStyle(event.feature, {fillColor: 'black'});
  });
}
