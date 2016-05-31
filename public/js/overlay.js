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

    var contentString = event.feature.H.NAME.toLowerCase();
    console.log($(".over-map"));
    $(".over-map").text(event.feature.H.NAME);
    infoWindow.setContent(contentString);
    infoWindow.setPosition(new google.maps.LatLng(event.latLng.lat() + .005, event.latLng.lng()));
    infoWindow.open(map);
  });

  map.data.addListener('mouseout', function(event) {
    map.data.revertStyle();
  });

  map.data.addListener('click', function(event) {
    console.log(event);
  });
}
