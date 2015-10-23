function myFunction() {
    var mymap = document.getElementById("map");
    var numbPins = 50;
    var pinCollection = '';

    for (var i = 0; i < numbPins; i++) {
        var randomTop = Math.floor((Math.random() * 400) + 1);
        var randomLeft = Math.floor((Math.random() * 300) + 1);
        pinCollection += "<div class='pin'" + "style='top:" + randomTop + "px; left:" + randomLeft + "px;'>" + "<img src='../img/pin.png' height='30px' width='20px'>" + "</div>"
    }
    mymap.innerHTML = pinCollection;
}
