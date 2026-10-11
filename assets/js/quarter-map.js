document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("quarter-map");

    if (!container || typeof L === "undefined") {
        console.error("Map container or Leaflet library not found");
        return;
    }

    // Initialise the Leaflet map
    const map = L.map("quarter-map", {
        scrollWheelZoom: false,
        zoomSnap: 0.1
    });

    // OpenStreetMap tiles
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);

    // Illustrative Georgian Quarter boundary
    const boundaryLayer = L.polygon(quarterBoundary, {
        color: "#A45D4B",
        weight: 3,
        opacity: 0.9,
        fillColor: "#D6C4A5",
        fillOpacity: 0.15
    }).addTo(map);

    boundaryLayer.bindPopup(
        "<strong>Liverpool's Georgian Quarter</strong>" +
        "<p>Illustrative neighbourhood boundary, " +
        "not a statutory conservation-area designation.</p>"
    );

    // Points-of-interest layers
    const poiLayers = {
        landmarks: L.layerGroup().addTo(map),
        pubs: L.layerGroup(),
        theatres: L.layerGroup(),
        restaurants: L.layerGroup(),
        hotels: L.layerGroup(),
        community: L.layerGroup()
    };

    function addPOIs(places, layer) {
        places.forEach(function (place) {
            let popup =
                "<strong>" + place.name + "</strong>" +
                "<p>" + place.description + "</p>";

            if (place.url) {
                popup +=
                    '<p><a href="' + place.url +
                    '">Read more →</a></p>';
            }

            L.marker(place.coords)
                .addTo(layer)
                .bindPopup(popup);
        });
    }

    // Historic landmarks
    addPOIs(quarterLandmarks, poiLayers.landmarks);

    // Pubs
    addPOIs(quarterPubs, poiLayers.pubs);

    // Leaflet layer selector
    L.control.layers(null, {
        "Historic landmarks": poiLayers.landmarks,
        "Pubs & bars": poiLayers.pubs,
        "Theatres & arts": poiLayers.theatres,
        "Restaurants & cafés": poiLayers.restaurants,
        "Hotels": poiLayers.hotels,
        "Community facilities": poiLayers.community
    }, {
        collapsed: false,
        position: "topright"
    }).addTo(map);

    // Automatically centre and zoom to the Georgian Quarter boundary
    map.fitBounds(boundaryLayer.getBounds(), {
        padding: [20, 20]
    });

    // Increase the initial zoom by half a level
    map.setZoom(map.getZoom() + 0.1);

});