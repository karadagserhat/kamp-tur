/* eslint-disable */

export const displayMap = (locations) => {
  var map = L.map('map', { zoomControl: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const points = [];
  locations.forEach((loc) => {
    points.push([loc.coordinates[1], loc.coordinates[0]]);

    const icon = L.icon({
      iconUrl: '/img/pin.png',
      className: 'marker',
    });

    L.marker([loc.coordinates[1], loc.coordinates[0]], { icon })
      .addTo(map)
      // .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, { autoClose: false })
      .bindPopup(`<p>Gün ${loc.day}: ${loc.description}</p>`, {
        className: 'custom-popup',
        autoClose: false,
        closeOnClick: false,
      })
      .openPopup();
  });

  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);

  map.scrollWheelZoom.disable();
};
