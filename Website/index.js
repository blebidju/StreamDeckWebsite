//global vars
var serverURL = "http://192.168.1.111:3000"

//on load run main
window.onload = function() {
    main()
};

//main put anything here for startup
function main () {
    grabNewDataAndRedirect()
}

//grab data continuously and render
function grabNewDataAndRedirect()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", serverURL+"/grabData", false) // false for synchronous request
    xmlHttp.send(null)

    console.log(xmlHttp.responseText)
    document.getElementById("display").innerHTML = xmlHttp.responseText.trim()

    setTimeout(grabNewDataAndRedirect, 1000)
}