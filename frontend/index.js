// Jacob Burton - Oct 2021

function initMap() {
  const usa = { lat: 39.286777, lng: -101.462366 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: usa,
    disableDefaultUI: true,
    zoomControl: true,
  });

  const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    //'<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
    '<div id="bodyContent">' +
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/qsebzPaSp7E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'+
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
    "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
    "(last visited June 22, 2009).</p>" +
    "</div>" +
    "</div>";

  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });
  const marker = new google.maps.Marker({
    position: usa,
    map,
    title: "USA",
  });

  marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    });
  });

  /*
  map.addListener("dblclick", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
  });
  */
}

/*
function placeMarkerAndPanTo(latLng, map) {
  new google.maps.Marker({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
}
*/
