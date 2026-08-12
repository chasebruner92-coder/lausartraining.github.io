const incidents = [
  { id: 'INC-042', title: 'Pine St. Flooding', detail: 'Water rising · 42 people awaiting transport', people: 42, status: 'CRITICAL', type: 'critical', coords: [30.451, -91.187] },
  { id: 'INC-041', title: 'Bridge collapse', detail: 'Access blocked · 12 people trapped', people: 12, status: 'ACTIVE', type: 'active', coords: [30.462, -91.170] },
  { id: 'INC-039', title: 'Shelter East', detail: 'Capacity 64% · 128 people', people: 128, capacity: 200, address: '2250 Florida Blvd, Baton Rouge, Louisiana', status: 'MONITOR', type: 'shelter', coords: [30.440, -91.160] },
  { id: 'INC-037', title: 'Medical staging', detail: 'Medic 04 · 2 available', status: 'RESOURCE', type: 'resource', coords: [30.430, -91.180] }
];

const vehicles = [
  { id: 'USAR 01', type: 'USAR', position: [30.438, -91.204] },
  { id: 'SWIFT 02', type: 'Swift water', position: [30.475, -91.170] },
  { id: 'MEDIC 04', type: 'EMS', position: [30.414, -91.181] }
];

const list = document.querySelector('#incidentList');
const feed = document.querySelector('#activityFeed');
const markers = {};

function addActivity(label, detail, avatar = 'JM', color = 'coral') {
  if (!feed) return;
  const item = document.createElement('article');
  item.className = 'activity-item';
  item.innerHTML = `
    <span class="activity-avatar ${color}">${avatar}</span>
    <div>
      <p><strong>${label}</strong></p>
      <small>Just now · All teams</small>
      <div class="activity-note">${String(detail).replace(/[<>]/g, '')}</div>
    </div>
  `;
  feed.prepend(item);
  updateOperationsBoard();
}

function shelterIncident() {
  return incidents.find((incident) => incident.type === 'shelter');
}

function updateOperationsBoard() {
  const shelter = shelterIncident();
  const openTarget = document.querySelector('#boardOpenIncidents');
  const peopleTarget = document.querySelector('#boardPeopleMoving');
  const capacityTarget = document.querySelector('#boardShelterCapacity');
  const detailTarget = document.querySelector('#boardShelterDetail');
  const unitsTarget = document.querySelector('#boardUnitsField');
  const listTarget = document.querySelector('#boardIncidentList');
  const activityTarget = document.querySelector('#boardActivity');

  if (!openTarget || !peopleTarget || !capacityTarget || !detailTarget || !unitsTarget || !listTarget || !activityTarget) return;

  const openIncidents = incidents.filter((incident) => incident.status !== 'RESOLVED' && incident.type !== 'shelter').length;
  const peopleMoving = incidents.filter((incident) => incident.type !== 'shelter').reduce((total, incident) => total + (incident.people || 0), 0);
  const capacity = shelter ? Math.round((shelter.people / shelter.capacity) * 100) : 0;

  openTarget.textContent = String(openIncidents).padStart(2, '0');
  peopleTarget.textContent = String(peopleMoving).padStart(2, '0');
  capacityTarget.textContent = `${capacity}%`;
  detailTarget.textContent = `${shelter?.people || 0} of ${shelter?.capacity || 0} beds used`;
  unitsTarget.textContent = String(vehicles.length).padStart(2, '0');

  listTarget.innerHTML = incidents.filter((incident) => incident.type !== 'shelter').map((incident) => `
    <div class="board-row">
      <div><strong>${incident.id} · ${incident.title}</strong><small>${incident.detail}</small></div>
      <span class="board-tag ${incident.status === 'RESOLVED' ? 'safe' : ''}">${incident.status}</span>
    </div>
  `).join('');

  const activityItems = feed ? [...feed.querySelectorAll('.activity-item')].slice(0, 6) : [];
  activityTarget.innerHTML = activityItems.map((item) => `
    <div class="board-row">
      <div>
        ${item.querySelector('p')?.innerHTML || ''}
        <small>${item.querySelector('.activity-note')?.textContent || item.querySelector('small')?.textContent || ''}</small>
      </div>
    </div>
  `).join('');
}

function initViewTabs() {
  const viewTabs = document.querySelectorAll('[data-view]');
  const commandBoard = document.querySelector('#commandBoard');
  const mapWorkspace = document.querySelector('#mapWorkspace');

  viewTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      viewTabs.forEach((item) => item.classList.toggle('active', item === tab));
      const isCommandView = tab.dataset.view === 'command';

      if (commandBoard) commandBoard.hidden = !isCommandView;
      if (mapWorkspace) mapWorkspace.hidden = isCommandView;
    });
  });
}

function initRoleSwitch() {
  const roleButtons = document.querySelectorAll('[data-role]');
  const briefingCard = document.querySelector('.briefing-card');

  roleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      roleButtons.forEach((item) => item.classList.toggle('active', item === button));
      const role = button.dataset.role;
      document.body.dataset.role = role;

      if (briefingCard) {
        briefingCard.hidden = role === 'student';
      }
    });
  });
}

function renderIncidents() {
  if (!list) return;

  Object.values(markers).forEach((marker) => marker.remove());

  list.innerHTML = incidents.map((incident, index) => `
    <article class="incident ${incident.type} ${index === 0 ? 'selected' : ''}" data-id="${incident.id}">
      <div class="incident-top">
        <span class="incident-id">${incident.id}</span>
        <span class="status">${incident.status}</span>
      </div>
      <h3>${incident.title}</h3>
      <p>${incident.type === 'shelter' ? `Capacity ${Math.round((incident.people / incident.capacity) * 100)}% · ${incident.people} people` : incident.detail}</p>
      ${incident.type === 'shelter' ? `<div class="location-row"><span>${incident.address || 'Map location'}</span></div>` : ''}
    </article>
  `).join('');

  incidents.forEach((incident) => {
    const marker = L.marker(incident.coords).addTo(map);
    marker.bindPopup(`<strong>${incident.id}</strong><br>${incident.title}<br><small>${incident.detail}${incident.address ? `<br>${incident.address}` : ''}</small>`, { autoPan: false });
    markers[incident.id] = marker;
  });

  list.querySelectorAll('.incident').forEach((card) => {
    card.addEventListener('click', () => {
      list.querySelectorAll('.incident').forEach((item) => item.classList.remove('selected'));
      card.classList.add('selected');
      const target = markers[card.dataset.id];
      if (target) {
        target.openPopup();
        map.flyTo(target.getLatLng(), 15, { duration: 0.6 });
      }
    });
  });
}

function renderVehicleMarkers() {
  vehicles.forEach((vehicle) => {
    const marker = L.marker(vehicle.position).addTo(map);
    marker.bindPopup(`<strong>${vehicle.id}</strong><br>${vehicle.type}`, { autoPan: false });
  });
}

function initClock() {
  const clock = document.querySelector('#clock');
  if (clock) {
    clock.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
    setInterval(() => {
      clock.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
    }, 1000);
  }

  const countdown = document.querySelector('#countdown');
  if (countdown) {
    let remaining = 5272;
    setInterval(() => {
      remaining = Math.max(0, remaining - 1);
      const h = String(Math.floor(remaining / 3600)).padStart(2, '0');
      const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
      const s = String(remaining % 60).padStart(2, '0');
      countdown.textContent = `${h}:${m}:${s}`;
    }, 1000);
  }
}

const map = L.map('map', { zoomControl: false }).setView([30.451, -91.180], 14);
L.control.zoom({ position: 'bottomright' }).addTo(map);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

if (document.querySelector('#addIncidentBtn')) {
  document.querySelector('#addIncidentBtn').addEventListener('click', () => {
    const id = `SITE-${String(incidents.length + 1).padStart(3, '0')}`;
    const title = 'New site';
    const detail = 'New support site added to the response area.';
    incidents.push({ id, title, detail, status: 'ACTIVE', type: 'active', coords: [30.451, -91.180] });
    renderIncidents();
    addActivity('New site added', `${title}: ${detail}`);
  });
}

if (document.querySelector('#recenterBtn')) {
  document.querySelector('#recenterBtn').addEventListener('click', () => map.flyTo([30.451, -91.180], 14, { duration: 0.6 }));
}

if (document.querySelector('#locateBtn')) {
  document.querySelector('#locateBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => map.flyTo([position.coords.latitude, position.coords.longitude], 15));
    }
  });
}

renderIncidents();
renderVehicleMarkers();
initViewTabs();
initRoleSwitch();
initClock();
updateOperationsBoard();
addActivity('Ops Room', 'Beacon map is live and synced.');

if (document.querySelector('#incidentCount')) {
  document.querySelector('#incidentCount').textContent = String(incidents.length).padStart(2, '0');
}

if (document.querySelector('#commandBoard')) { document.querySelector('#commandBoard').hidden = true; }
if (document.querySelector('#mapWorkspace')) { document.querySelector('#mapWorkspace').hidden = false; }
