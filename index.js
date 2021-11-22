// Jacob Burton - Oct 2021
let infowindows = new Array();
let markerArray = new Array();
var data;

var g_map;
var g_clusterer;

// Youtube Player API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var playerConfig;

var player_videoId;
var player_startTime;
var player_stopTime;

var user_added_marker = null;
var user_lat;
var user_lng;

function initMap() {
  const usa = { lat: 39.286777, lng: -101.462366 };
  const styles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [
            { visibility: "off" }
      ]
    }
  ]

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: usa,
    disableDefaultUI: false,
    zoomControl: true,
    styles: styles,
  });

  registerMap(map);

  var filePath = './backend/pins.json';

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

  /* // depreciated unclustered markers
  for(let i = 0; i < data.pins.length; i++){
    var string = CreateContentString(data.pins[i]);
    var position = {lat: data.pins[i].lat, lng: data.pins[i].long};

    infowindow = new google.maps.InfoWindow({
      content: string,
    });

    marker = new google.maps.Marker({
      position: position,
      map: map,
      title: "#" + i,
    });

    markerArray.push(marker);
    newListener(marker, infowindow);
  }
  */

  // const for clustered markers
  const markers = data.pins.map((location, i) => {
    var string = CreateContentString(data.pins[i]);
    var position = {lat: data.pins[i].lat, lng: data.pins[i].long};

    infowindow = new google.maps.InfoWindow({
      content: string,
    });
    infowindows.push(infowindow);

    return new google.maps.Marker({
      position: position,
      //label: "#" + i,
    });
  });

  // Add info window listeners to clustered markers
  for(var i = 0; i < markers.length; i++){
    newListener(markers[i], infowindows[i]);
  }


  // user 'Add Marker' listener
  map.addListener("dblclick", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
  });



  // close info windows on click
  map.addListener("click", (e) => {
    for(let i = 0; i < infowindows.length; i++){
      infowindows[i].close();
    }

    if(user_added_marker != null){
      clearUserMarker();
    }
  });



  // Marker Clusterer
  var options = {
    imagePath: 'images/m'
  }
  const markerCluster = new markerClusterer.MarkerClusterer({ map, markers, options });
  registerClusterer(markerCluster);

} // end of map init

function registerClusterer(f_clusterer){
  g_clusterer = f_clusterer;
}

function registerMap(f_map){
  g_map = f_map;
}

function newListener(f_marker, f_infowindow){
  infowindows.push(f_infowindow);
  f_marker.addListener("click", () => {
    for(let i = 0; i < infowindows.length; i++){
      infowindows[i].close();
    }
    f_infowindow.open({
      anchor: f_marker,
      g_map,
      shouldFocus: true,
    });
  });
}

// Handles User Search for Youtube Link, Skater Name, or Year
function MarkerSearch(){
  var user_input = document.getElementById("UserSearch").value;

  if(user_input == ""){
    //$("#UserSearch").addClass('is-invalid'); // show feedback
    return;
  }

  g_clusterer.clearMarkers();

  var count = 0;
  // youtube Link
  var youtube_id = youtube_parser(user_input);
  for(var i = 0; i < data.pins.length; i++){
    if(data.pins[i].youtubeCode == youtube_id) {
      console.log("here");
      var string = CreateContentString(data.pins[i]);
      var position = {lat: data.pins[i].lat, lng: data.pins[i].long};

      infowindow = new google.maps.InfoWindow({
        content: string,
      });

      marker = new google.maps.Marker({
        position: position,
        g_map,
        title: "#" + count,
      });

      newListener(marker, infowindow);
      count++;

      marker.setMap(g_map);
      g_clusterer.addMarker(marker);
    }
  }
}

// Reset Search Filters
function ResetSearch(){
  g_clusterer.clearMarkers();

  var count = 0;
  for(var i = 0; i < data.pins.length; i++){
    var string = CreateContentString(data.pins[i]);
    var position = {lat: data.pins[i].lat, lng: data.pins[i].long};

    infowindow = new google.maps.InfoWindow({
      content: string,
    });

    marker = new google.maps.Marker({
      position: position,
      g_map,
      title: "#" + count,
    });

    newListener(marker, infowindow);
    count++;

    marker.setMap(g_map);
    g_clusterer.addMarker(marker);
  }
}

// Youtube Parser Made by "jeffreypriebe"
function youtube_parser(url){
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[1].length==11)? match[1] : false;
}


function CreateContentString(PinObj) {
  var string;
  if(PinObj.timestamped){
    string =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<p class="lead">' + PinObj.youtubeTitle + '</p>' +
      '<div id="bodyContent">' +
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + PinObj.youtubeCode + '?start=' + PinObj.StartTimestamp + '&end=' + PinObj.StopTimestamp + '&rel=0" frameborder="0" gesture="media" allow="autoplay; encrypted-media" allowfullscreen></iframe>'+
      '<p>Watch on Youtube: <a href="https://www.youtube.com/watch?v=' + PinObj.youtubeCode + '">' +
      "https://www.youtube.com/watch?v=" + PinObj.youtubeCode + "</a> " +
      "</p>" +
      "</div>" +
      "</div>";
  }
  else {
    string =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<p class="lead">' + PinObj.youtubeTitle + '</p>' +
      '<div id="bodyContent">' +
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + PinObj.youtubeCode + '?rel=0" frameborder="0" gesture="media" allow="autoplay; encrypted-media" allowfullscreen></iframe>'+
      '<p>Watch on Youtube: <a href="https://www.youtube.com/watch?v=' + PinObj.youtubeCode + '">' +
      "https://www.youtube.com/watch?v=" + PinObj.youtubeCode + "</a> " +
      "</p>" +
      "</div>" +
      "</div>";
  }


  return string;
}

function createAdditionInfoWindow(latLng){
  user_lat = latLng.lat();
  user_lng = latLng.lng();

  document.getElementById("input_lat").value = user_lat;
  document.getElementById("input_lng").value = user_lng;

  var string;
  string =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<p class="lead">' + user_lat + ', ' + user_lng + '</p>' +
    '<div id="bodyContent">' +
    '<center><button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#formModal">Add Spot Here</button></center>' +
    "<p></p>" +
    "</div>" +
    "</div>";

  infowindow = new google.maps.InfoWindow({
    content: string,
  });
  return infowindow;
}

function createAdditionMarker(latLng, map) {
  return new google.maps.Marker({
    position: latLng,
    map: map,
  });
}

function clearUserMarker(){
  user_added_marker.setMap(null);
  user_added_marker = null;
  user_lat = null;
  user_lng = null;
}

function placeMarkerAndPanTo(latLng, map) {
  var addInfoWindow = createAdditionInfoWindow(latLng);

  user_added_marker = createAdditionMarker(latLng, map);
  map.panTo(latLng);

  addInfoWindow.open({
    anchor: user_added_marker,
    map,
    shouldFocus: true,
  });
}
