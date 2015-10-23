//function myFunction() {
//
//}
var redirectURI = document.URL;
var clientID = "a88e7b45-fa45-4d05-829e-975681adc580";
var accessToken = getUrlVars().access_token;
var swingBySwing = "https://api.swingbyswing.com/v2/oauth/authorize?scope=read&redirect_uri=" + encodeURI(redirectURI) + "&response_type=token&client_id=" + clientID;
if(accessToken == null) {
    location.replace(swingBySwing);
}
else {
    accessToken = accessToken.replace("\n","");
    model = getCourse(51763);
}



function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        });
    return vars;
}

var map;
var infowindow;

function initMap() {
    var oldAndrews = {lat: 56.357552, lng: -2.818553};

    map = new google.maps.Map(document.getElementById('map'), {
        center: oldAndrews,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });
    var marker = new google.maps.Marker({
        position: oldAndrews,
        map: map,
        title: "Old St. Andrews"
    });

}
function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.swingbyswing.com/v2/courses/51763?includes=practice_area,nearby_courses,recent_media,recent_comments,recent_rounds,best_rounds,current_rounds,course_stats_month,course_stats_year&access_token=" + accessToken, false);
    xhttp.send();
    document.getElementById("courseInfo").innerHTML = xhttp.responseText;
}
//    function Map () {
//        //takes in a hole and displays it
//        this.showLocation(){
//
//        }
//    }

