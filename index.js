// Jacob Burton - Oct 2021
let infowindows = new Array();
let markerArray = new Array();

function initMap() {
  const usa = { lat: 39.286777, lng: -101.462366 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: usa,
    disableDefaultUI: true,
    zoomControl: true,
  });

  var filePath = './backend/pins.json';

  var data;

  $.ajax({
      async: false,
      type: "GET",
      url: filePath,
      data: data,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response) {
          data = response;
      }
  });

  for(let i = 0; i < data.pins.length; i++){
    var string = CreateContentString(data.pins[i]);
    var position = {lat: data.pins[i].lat, lng: data.pins[i].long};

    infowindow = new google.maps.InfoWindow({
      content: string,
    });

    marker = new google.maps.Marker({
      position: position,
      map,
      title: "#" + i,
    });

    newListener(marker, infowindow)
  }

  /* // add something
  map.addListener("dblclick", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
  });
  */
}

function newListener(f_marker, f_infowindow){
  infowindows.push(f_infowindow);
  markerArray.push(f_marker);
  f_marker.addListener("click", () => {
    for(let i = 0; i < infowindows.length; i++){
      infowindows[i].close();
    }
    f_infowindow.open({
      anchor: f_marker,
      map,
      shouldFocus: true,
    });
  });
}

function CreateContentString(PinObj) {
  var string =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    //'<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
    '<div id="bodyContent">' +
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + PinObj.youtubeCode + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'+
    '<p>Watch on Youtube: <a href="https://www.youtube.com/watch?v=' + PinObj.youtubeCode + '">' +
    "https://www.youtube.com/watch?v=" + PinObj.youtubeCode + "</a> " +
    "</p>" +
    "</div>" +
    "</div>";
  return string;
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
