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


    const poiColours = {
        landmarks: "#D6C4A5",   // Sandstone
        pubs: "#A45D4B",        // Brick
        theatres: "#7952A3",    // Purple
        restaurants: "#43865C", // Green
        hotels: "#3978A8",      // Blue
        community: "#358B91"    // Teal
    };

    /*
    function poiIcon(category) {
        return L.divIcon({
            className: "gq-poi-icon",
            html: `<span style="background-color: ${poiColours[category]}"></span>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -12]
        });
    }
    */


    function poiIcon(category) {
        const colour = poiColours[category] || "#66777D";

        return L.divIcon({
            className: "gq-poi-icon",
            html: `<span class="gq-poi-marker"
                         style="background-color: ${colour};"></span>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -12]
        });
    }


    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[character];
        });
    }

    function addPOIs(places, layer, category) {
        places.forEach(function (place) {
            if (
                !Array.isArray(place.coords) ||
                place.coords.length !== 2 ||
                !place.coords.every(Number.isFinite)
            ) {
                console.warn("Invalid POI coordinates:", place);
                return;
            }

            let popup = `<strong>${escapeHTML(place.name)}</strong>`;

            if (place.description) {
                popup += `<p>${escapeHTML(place.description)}</p>`;
            }

            if (place.url) {
                try {
                    const url = new URL(place.url, window.location.origin);

                    if (["http:", "https:"].includes(url.protocol)) {
                        popup += `<p><a href="${escapeHTML(url.href)}"
                            target="_blank" rel="noopener noreferrer">
                            Read more →</a></p>`;
                    }
                } catch (error) {
                    console.warn("Invalid POI URL:", place.url);
                }
            }

            L.marker(place.coords, {
                icon: poiIcon(category),
                title: place.name
            }).addTo(layer).bindPopup(popup);

        });
    }


    addPOIs(quarterLandmarks, poiLayers.landmarks, "landmarks");
    addPOIs(quarterPubs, poiLayers.pubs, "pubs");
    //addPOIs(quarterTheatres, poiLayers.theatres, "theatres");
    //addPOIs(quarterRestaurants, poiLayers.restaurants, "restaurants");
    //addPOIs(quarterHotels, poiLayers.hotels, "hotels");
    //addPOIs(quarterCommunity, poiLayers.community, "community");

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