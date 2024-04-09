
function populateMap() {
  mapboxgl.accessToken = token;
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL -- we can change how a  map looks - check docs for different styles
    center: coordinates, // starting position [lng, lat]
    zoom: 7, // starting zoom
  });

  map.addControl(new mapboxgl.NavigationControl())

  var marker = new mapboxgl.Marker()
    .setLngLat(coordinates)
    //to set a popup on map marker
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(
          `<h3>${title}</h3>`
        )
    )
    .addTo(map)
}
populateMap()


//to popolate popup map on click

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".popup-map").setAttribute("id", "map");
  document.querySelector(".popup-map-button").addEventListener("click",()=>{
    populateMap()
  })
})



