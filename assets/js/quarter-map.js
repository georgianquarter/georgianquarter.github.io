document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("quarter-map");

    if (!container || typeof L === "undefined") {
        console.error("Map container or Leaflet library not found");
        return;
    }

    const map = L.map("quarter-map", {
        scrollWheelZoom: false
    }).setView([53.3990, -2.9690], 15);

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


    const bounds = L.latLngBounds([]);

    quarterLandmarks.forEach(function (place) {
        L.marker(place.coords)
            .addTo(map)
            .bindPopup(
                "<strong>" + place.name + "</strong><p>" +
                place.description + "</p>"
            );

        bounds.extend(place.coords);
    });

map.fitBounds(bounds, {
    padding: [25, 25],
    maxZoom: 16
});

});
