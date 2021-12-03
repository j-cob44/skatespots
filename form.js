// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()



function enableTimestamps() {
  if(document.getElementById("SwitchCheck").checked == true){
    document.getElementById("Timestamps").removeAttribute("disabled");
  }
  else{
    document.getElementById("Timestamps").setAttribute("disabled", "disabled");
  }
}

function youtube_parser(url){
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[1].length==11)? match[1] : false;
}

function getYoutubeData(youtube_code){
  var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + youtube_code + '&key=AIzaSyBisw8qFsJpG_pKja7zHohsxkyVK7oOGDg';
  var dataResponse;

  $.ajax({
      async: false,
      type: "GET",
      url: url,
      data: dataResponse,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response) {
          dataResponse = response;
      }
  });

  return dataResponse;
}

function getLatLongFrom(str_address){
  var addressResponse;
  var placesURL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + str_address + '&inputtype=textquery&fields=formatted_address,geometry&key=AIzaSyBisw8qFsJpG_pKja7zHohsxkyVK7oOGDg';
  $.ajax({
      async: false,
      type: "GET",
      url: placesURL,
      data: addressResponse,
      success: function (response) {
          addressResponse = response;
      }
  });

  return addressResponse.candidates;
}

/* depreciated post function
function submitData(newData){
  $.getJSON("./backend/unverified.json", function(data) {
    data.location_pins.push(newData);

    var dataUp = JSON.stringify(data);
    $.ajax({
        async: false,
        type: "POST",
        url: "./backend/unverified.json",
        data: dataUp,
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        success: function (response) {
            console.log(response);
        }
    });
  });
}
*/

// Upload Spot Submission
function submitData(newData){
  var dataUp = JSON.stringify(newData);
  $.ajax({
      async: false,
      type: "PUT",
      data: dataUp,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      success: function (response) {
          console.log(response);
      }
  });
}

// Upload Video Submission for Exisiting Spot
function submitVideo(newData){
  var dataUp = JSON.stringify(newData);
  $.ajax({
      async: false,
      type: "PUT",
      data: dataUp,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      success: function (response) {
          console.log(response);
      }
  });
}

function onUserSubmission() {
  var youtube_id = youtube_parser(document.getElementById("YoutubeURL").value);

  var youtube_data = getYoutubeData(youtube_id);

  if(youtube_data.items.length == 1) {
    var video_data = youtube_data.items[0]

    var lat = parseFloat(document.getElementById("input_lat").value);
    var long = parseFloat(document.getElementById("input_lng").value);

    console.log(lat);
    console.log(long);

    var formatted_addr;

    var startStamp;
    var stopStamp;

    var address = "";
    if(document.getElementById("KnownAddress").value.length != 0){
      address = document.getElementById("KnownAddress").value;
    }

    var skater = "";
    if(document.getElementById("SkatersName").value.length != 0){
      address = document.getElementById("SkatersName").value;
    }

    if(address != ""){
      var data = getLatLongFrom(address);
      if(data.length != 0){
        // success
        if(lat == ""){
          lat = data[0].geometry.location.lat;
        }

        if(long == ""){
          long = data[0].geometry.location.lng;
        }
        formatted_addr = data[0].formatted_address;
      }
      else {
        // bad address
        // fallback to get info from user map pin
      }
    }
    else {
      // no optional address, get info from user map pin
      formatted_addr = "Address not Specified."
    }

    if(skater == ""){
      skater = "Not Specified.";
    }
    //else Use User input provided above

    var postData;

    if(document.getElementById("SwitchCheck").checked == true) {
      // Specific Timestamp
      // Starting Timestamp
      var startSeconds;
      var startMinutes;
      var startHours;
      startStamp = 0;

      if(document.getElementById("StartTimestampHH").value != 0) {
        startHours = document.getElementById("StartTimestampHH").value;
      }
      else {
        // error
        startHours = 0;
      }

      if(document.getElementById("StartTimestampMM").value != 0) {
        startMinutes = document.getElementById("StartTimestampMM").value;
      }
      else {
        // error
        startMinutes = 0;
      }

      if(document.getElementById("StartTimestampSS").value != 0) {
        startSeconds = document.getElementById("StartTimestampSS").value;
      }
      else {
        // error
        startSeconds = 0;
      }

      // tally up the values
      startStamp = parseInt(startHours * 60 * 60) + parseInt(startMinutes * 60) + parseInt(startSeconds);

      // Stop Timestamp
      var stopSeconds;
      var stopMinutes;
      var stopHours;
      stopStamp = 0;

      if(document.getElementById("StopTimestampHH").value != 0) {
        stopHours = document.getElementById("StopTimestampHH").value;
      }
      else {
        // error
        stopHours = 0;
      }

      if(document.getElementById("StopTimestampMM").value != 0) {
        stopMinutes = document.getElementById("StopTimestampMM").value;
      }
      else {
        // error
        stopMinutes = 0;
      }

      if(document.getElementById("StopTimestampSS").value.length != 0) {
        stopSeconds = document.getElementById("StopTimestampSS").value;
      }
      else {
        // error
        stopSeconds = 0;
      }

      // tally up the values
      stopStamp = parseInt(stopHours * 60 * 60) + parseInt(stopMinutes * 60) + parseInt(stopSeconds);

      console.log("POST");
      postData = {
        'lat': lat,
        'long': long,
        'formatted_Address': formatted_addr,
        'videos': [{
          'youtubeCode': video_data.id,
          'youtubeTitle': video_data.snippet.title,
          'uploadDate': video_data.snippet.publishedAt,
          'skatersName': skater,
          'timestamped': true,
          'StartTimestamp': startStamp,
          'StopTimestamp': stopStamp
       }]
     };

     submitData(postData); // Success

    }
    else {
      console.log("POST");
      postData = {
        'lat': lat,
        'long': long,
        'formatted_Address': formatted_addr,
        'videos': [{
          'youtubeCode': video_data.id,
          'youtubeTitle': video_data.snippet.title,
          'uploadDate': video_data.snippet.publishedAt,
          'skatersName': skater,
          'timestamped': true,
          'StartTimestamp': startStamp,
          'StopTimestamp': stopStamp
        }]
      };

      submitData(postData); // Success
    }

    // exit
    document.getElementById("AddMarkerForm").reset(); // reset form
    alert("Spot Submitted!");
  }
  else{
    //pushback bad youtube Link
    //error
  }
}

function onExistingSpotSubmission() {
  var youtube_id = youtube_parser(document.getElementById("existingspot_YoutubeURL").value);

  var youtube_data = getYoutubeData(youtube_id);

  if(youtube_data.items.length == 1) {
    var video_data = youtube_data.items[0]

    var lat = parseFloat(document.getElementById("existingspot_lat").value);
    var long = parseFloat(document.getElementById("existingspot_lng").value);
    var spotID = document.getElementById("input_spotID").value;

    console.log(lat);
    console.log(long);

    var formatted_addr;

    var startStamp;
    var stopStamp;


    var skater = "";
    if(document.getElementById("existingspot_SkatersName").value.length != 0){
      address = document.getElementById("existingspot_SkatersName").value;
    }

    if(skater == ""){
      skater = "Not Specified.";
    }
    //else Use User input provided above

    var postData;

    if(document.getElementById("existingspot_SwitchCheck").checked == true) {
      // Specific Timestamp
      // Starting Timestamp
      var startSeconds;
      var startMinutes;
      var startHours;
      startStamp = 0;

      if(document.getElementById("existingspot_StartTimestampHH").value != 0) {
        startHours = document.getElementById("existingspot_StartTimestampHH").value;
      }
      else {
        // error
        startHours = 0;
      }

      if(document.getElementById("existingspot_StartTimestampMM").value != 0) {
        startMinutes = document.getElementById("existingspot_StartTimestampMM").value;
      }
      else {
        // error
        startMinutes = 0;
      }

      if(document.getElementById("existingspot_StartTimestampSS").value != 0) {
        startSeconds = document.getElementById("existingspot_StartTimestampSS").value;
      }
      else {
        // error
        startSeconds = 0;
      }

      // tally up the values
      startStamp = parseInt(startHours * 60 * 60) + parseInt(startMinutes * 60) + parseInt(startSeconds);

      // Stop Timestamp
      var stopSeconds;
      var stopMinutes;
      var stopHours;
      stopStamp = 0;

      if(document.getElementById("existingspot_StopTimestampHH").value != 0) {
        stopHours = document.getElementById("existingspot_StopTimestampHH").value;
      }
      else {
        // error
        stopHours = 0;
      }

      if(document.getElementById("existingspot_StopTimestampMM").value != 0) {
        stopMinutes = document.getElementById("existingspot_StopTimestampMM").value;
      }
      else {
        // error
        stopMinutes = 0;
      }

      if(document.getElementById("existingspot_StopTimestampSS").value.length != 0) {
        stopSeconds = document.getElementById("existingspot_StopTimestampSS").value;
      }
      else {
        // error
        stopSeconds = 0;
      }

      // tally up the values
      stopStamp = parseInt(stopHours * 60 * 60) + parseInt(stopMinutes * 60) + parseInt(stopSeconds);

      console.log("POST");
      postData = {
        'id': spotID,
        'video': {
          'youtubeCode': video_data.id,
          'youtubeTitle': video_data.snippet.title,
          'uploadDate': video_data.snippet.publishedAt,
          'skatersName': skater,
          'timestamped': true,
          'StartTimestamp': startStamp,
          'StopTimestamp': stopStamp
        }
     };

     submitVideo(postData); // Success

    }
    else {

      console.log("POST");
       postData = {
         'id': spotID,
         'video': {
           'youtubeCode': video_data.id,
           'youtubeTitle': video_data.snippet.title,
           'uploadDate': video_data.snippet.publishedAt,
           'skatersName': skater,
           'timestamped': false
         }
      };

      submitVideo(postData); // Success
    }

    // exit
    document.getElementById("AddVideoForm").reset(); // reset form
    alert("Video Submitted!");
  }
  else{
    //pushback bad youtube Link
    //error
  }
}
