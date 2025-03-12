// app.js

// Exemple de données simulées pour 5 poubelles
let poubelles = [];

for (let i = 1; i <= 50; i++) {
  let latitude = (34 + Math.random() * 0.01).toFixed(4); // Latitude entre 34.0000 et 34.0100
  let longitude = (-7.58 - Math.random() * 0.02).toFixed(4); // Longitude entre -7.5800 et -7.6000
  let pourcentage = Math.floor(Math.random() * 101); // Pourcentage entre 0 et 100
  let nom = `Poubelle ${String.fromCharCode(64 + ((i - 1) % 26) + 1)}${i > 26 ? Math.ceil(i / 26) : ''}`; // Générer des noms uniques

  poubelles.push({
    id: i,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    pourcentage: pourcentage,
    nom: nom
  });
}

// Initialiser la carte
let map = L.map('map').setView([34.0200, -7.5895], 15); // Centre initial de la carte

// Ajouter un fond de carte
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Ajouter des marqueurs pour chaque poubelle
poubelles.forEach(poubelle => {
  let color = poubelle.pourcentage > 75 ? 'green' : (poubelle.pourcentage > 50 ? 'orange' : 'red');
  L.marker([poubelle.latitude, poubelle.longitude])
    .addTo(map)
    .bindPopup(`<b>${poubelle.nom}</b><br>Pourcentage de remplissage: ${poubelle.pourcentage}%`)
    .setIcon(L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }));
});

// Affichage des alertes sur les poubelles pleines ou presque pleines
let alertList = document.getElementById('alert-list');
poubelles.forEach(poubelle => {
  if (poubelle.pourcentage >= 90) {
    let alertItem = document.createElement('li');
    alertItem.textContent = `${poubelle.nom} est presque pleine (${poubelle.pourcentage}%)`;
    alertItem.style.color = 'red';
    alertList.appendChild(alertItem);
  }
});

// Graphique du pourcentage de remplissage des poubelles
let ctx = document.getElementById('pourcentageGraph').getContext('2d');
let labels = poubelles.map(p => p.nom);
let data = poubelles.map(p => p.pourcentage);

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [{
      label: 'Pourcentage de remplissage',
      data: data,
      backgroundColor: data.map(p => p > 75 ? 'green' : (p > 50 ? 'orange' : 'red')),
      borderColor: 'black',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
});
