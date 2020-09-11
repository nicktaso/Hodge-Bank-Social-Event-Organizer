

function initMap() {
   
    $.ajax({
        type: "GET",
        url: "/event-by-id?eventID=" + eventId,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    }).then(event =>{

   
    axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
            address: event.location,
            key: 'AIzaSyBAErOyHT4wjq9z65fPeQzFUHjNEtjjInE'
        }
    }).then(response => {
        console.log(response);

        let location = response.data.results[0].geometry.location;

        let options = {
            zoom: 11,
            center: location
        }

        let map = new google.maps.Map(document.getElementById('map'), options);

        let marker = new google.maps.Marker({ position: location, map: map });

        let infoWindow = new google.maps.InfoWindow({
            content: `<h4>${event.location}</h4>`
        });

        infoWindow.open(map, marker);

        marker.addListener('click', () => {
            infoWindow.open(map, marker)
        });
    }).catch(error => {
        console.log(error);
    })
})
}


