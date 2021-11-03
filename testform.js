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

function youtube_parser(url){
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[1].length==11)? match[1] : false;
}

function getYoutubeData(youtube_code){
  var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + youtube_code + '&key=*googleapikey*';
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
  var placesURL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + str_address + '&inputtype=textquery&fields=formatted_address,geometry&key=*googleapikey*';
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

function submitData(newData){
  $.getJSON("./backend/unverified.json", function(data) {
    data.pins.push(newData);

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

function onUserSubmission() {
  var youtube_id = youtube_parser(document.getElementById("YoutubeURL").value);

  var youtube_data = getYoutubeData(youtube_id);

  if(youtube_data.items.length == 1) {
    var video_data = youtube_data.items[0]
    var lat;
    var long;
    var formatted_addr;

    var address = document.getElementById("KnownAddress").value;
    var skater = document.getElementById("SkatersName").value;

    if(address != ""){
      var data = getLatLongFrom(address);
      if(data.length != 0){
        // success
        lat = data[0].geometry.location.lat;
        long = data[0].geometry.location.lng;
        formatted_addr = data[0].formatted_address;
      }
      else {
        // bad address
        // fallback to get info from user map pin
      }


    }
    else {
      // no optional address, get info from user map pin

    }

    if(skater == ""){
      skater = "Not Specified.";
    }
    //else Use User input provided above


    var postData = {
      'lat': lat,
      'long': long,
      'youtubeCode': video_data.id,
      'youtubeTitle': video_data.snippet.title,
      'uploadDate': video_data.snippet.publishedAt,
      'formatted_Address': formatted_addr,
      'skatersName': skater
    }

    submitData(postData);
  }
  else{
    //pushback bad youtube Link
    //error
  }
}
