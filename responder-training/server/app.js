const incidents = [
  { id: 'INC-042', title: 'Pine St. Flooding', detail: 'Water rising · 3 units', status: 'CRITICAL', type: 'critical', coords: [30.451, -91.187] },
  { id: 'INC-041', title: 'Bridge collapse', detail: 'Access blocked · Awaiting team', status: 'ACTIVE', type: 'active', coords: [30.462, -91.170] },
  { id: 'INC-039', title: 'Shelter East', detail: 'Capacity 64% · 128 people', address: '2250 Florida Blvd, Baton Rouge, Louisiana', status: 'MONITOR', type: 'shelter', coords: [30.440, -91.160] },
  { id: 'INC-037', title: 'Medical staging', detail: 'Medic 04 · 2 available', status: 'RESOURCE', type: 'resource', coords: [30.430, -91.180] }
];
const list = document.querySelector('#incidentList');
const feed = document.querySelector('#activityFeed');
const map = L.map('map', { zoomControl: false }).setView([30.451, -91.180], 14);
L.control.zoom({ position: 'bottomright' }).addTo(map);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
const markerStyles = { critical: '#ef725e', active: '#f5ba4d', warning: '#f5ba4d', resource: '#087e7b', shelter: '#8b5bb5', supply: '#c7772d' };
const markers = {};
function markerIcon(type) { return L.divIcon({ className: 'incident-pin', html: `<span style="background:${markerStyles[type]}"></span>`, iconSize: [22, 22], iconAnchor: [11, 11] }); }
const vehicleStyles = { USAR: '#087e7b', 'Swift water': '#2475a8', 'Fire truck': '#ef725e', Police: '#4f5db3', EMS: '#d39a26', Volunteer: '#8b5bb5', 'Transport small': '#6a7d82', 'Transport medium': '#48656a', 'Transport large': '#29494f', 'Helicopter crew': '#c7772d' };
function vehicleIcon(type) { const symbol = type === 'EMS' ? '+' : type === 'Helicopter crew' ? '✦' : type === 'Volunteer' ? '♥' : type.startsWith('Transport') ? '▰' : '▰'; return L.divIcon({ className: 'vehicle-pin', html: `<span style="background:${vehicleStyles[type] || vehicleStyles.USAR}">${symbol}</span>`, iconSize: [24, 24], iconAnchor: [12, 12] }); }
const vehicles = [
  { id: 'USAR 01', type: 'USAR', position: [30.438, -91.204], target: [30.451, -91.187], progress: .22 },
  { id: 'SWIFT 02', type: 'Swift water', position: [30.475, -91.170], target: [30.451, -91.187], progress: .34 },
  { id: 'ENGINE 07', type: 'Fire truck', position: [30.425, -91.158], target: [30.462, -91.170], progress: .12 },
  { id: 'POLICE 12', type: 'Police', position: [30.448, -91.220], target: [30.462, -91.170], progress: .48 },
  { id: 'MEDIC 04', type: 'EMS', position: [30.414, -91.181], target: [30.430, -91.180], progress: .62 },
  { id: 'VOLUNTEER 08', type: 'Volunteer', position: [30.432, -91.198], target: [30.440, -91.160], progress: .18 },
  { id: 'SHUTTLE 12', type: 'Transport small', position: [30.440, -91.160], target: [30.451, -91.187], progress: .40 },
  { id: 'BUS 03', type: 'Transport medium', position: [30.440, -91.160], target: [30.430, -91.180], progress: .26 },
  { id: 'COACH 01', type: 'Transport large', position: [30.440, -91.160], target: [30.462, -91.170], progress: .12 },
  { id: 'AIR 01', type: 'Helicopter crew', position: [30.485, -91.205], target: [30.451, -91.187], progress: .55 }
];
vehicles.forEach((vehicle) => { vehicle.staging = [...vehicle.position]; vehicle.marker = L.marker(vehicle.position, { icon: vehicleIcon(vehicle.type) }).addTo(map).bindTooltip(`${vehicle.id} · en route`, { direction: 'top', offset: [0, -10] }); });
setInterval(() => { vehicles.forEach((vehicle) => { vehicle.progress += .003; if (vehicle.progress > 1) vehicle.progress = 0; const start = vehicle.routeStart || vehicle.position; const latitude = start[0] + (vehicle.target[0] - start[0]) * vehicle.progress; const longitude = start[1] + (vehicle.target[1] - start[1]) * vehicle.progress; vehicle.marker.setLatLng([latitude, longitude]); }); }, 1000);
function renderIncidents() {
  Object.values(markers).forEach((marker) => marker.remove());
  list.innerHTML = incidents.map((incident, index) => `<article class="incident ${incident.type} ${index === 0 ? 'selected' : ''}" data-id="${incident.id}"><div class="incident-top"><span class="incident-id">${incident.id}</span><span class="status ${incident.type === 'warning' ? 'amber' : incident.type === 'resource' ? 'green' : ''}">${incident.status}</span></div><h3>${incident.title}</h3><p>${incident.detail}</p>${incident.type === 'shelter' ? `<div class="location-row"><span>${incident.address || 'Map location'}</span><button class="move-location" data-id="${incident.id}">Move</button></div>` : ''}</article>`).join('');
  incidents.forEach((incident) => {
    const marker = L.marker(incident.coords, { icon: markerIcon(incident.type) }).addTo(map).bindPopup(`<strong>${incident.id}</strong><br>${incident.title}<br><small>${incident.detail}${incident.address ? `<br>${incident.address}` : ''}</small>`);
    markers[incident.id] = marker;
  });
  list.querySelectorAll('.incident').forEach((card) => card.addEventListener('click', (event) => { if (event.target.closest('.move-location')) return; list.querySelectorAll('.incident').forEach((item) => item.classList.remove('selected')); card.classList.add('selected'); markers[card.dataset.id].openPopup(); map.flyTo(markers[card.dataset.id].getLatLng(), 15, { duration: .6 }); }));
  list.querySelectorAll('.move-location').forEach((button) => button.addEventListener('click', () => { const incident = incidents.find((item) => item.id === button.dataset.id); document.body.classList.add('moving-location'); map.once('click', (event) => { incident.coords = [event.latlng.lat, event.latlng.lng]; incident.address = 'Map position updated'; renderIncidents(); addActivity('Shelter moved', `${incident.title} moved to a new map position.`, 'JM', 'coral'); }); }));
}
renderIncidents();
document.querySelector('#addIncidentBtn').addEventListener('click', () => {
  const modal = document.createElement('div');
  modal.className = 'location-modal';
  modal.innerHTML = '<form class="location-form"><span class="eyebrow">ADD TO LIVE MAP</span><h2>New incident or site</h2><label>LOCATION TYPE<select id="newLocationType"><option value="incident">Incident</option><option value="shelter">Shelter</option><option value="supply">Supply site</option></select></label><label>NAME<input id="newLocationName" required placeholder="e.g. North parish shelter"></label><label>ADDRESS <span class="optional">(optional)</span><input id="newLocationAddress" placeholder="Street, city, Louisiana"></label><label>DETAILS<input id="newLocationDetail" required placeholder="What should teams know?"></label><label>MAP POSITION<select id="newLocationPosition"><option value="center">Use current map center</option><option value="shelter">Shelter East area</option><option value="flood">Pine St. Flooding area</option><option value="medical">Medical staging area</option></select></label><div class="location-form-actions"><button type="button" class="location-cancel">Cancel</button><button class="location-save">Add to map</button></div></form>';
  document.body.append(modal);
  modal.querySelector('.location-cancel').addEventListener('click', () => modal.remove());
  modal.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const type = modal.querySelector('#newLocationType').value;
    const positionChoice = modal.querySelector('#newLocationPosition').value;
    const positionMap = { center: map.getCenter(), shelter: incidents.find((item) => item.id === 'INC-039').coords, flood: incidents.find((item) => item.id === 'INC-042').coords, medical: incidents.find((item) => item.id === 'INC-037').coords };
    let position = positionMap[positionChoice];
    const id = `SITE-${String(incidents.length + 1).padStart(3, '0')}`;
    const title = modal.querySelector('#newLocationName').value.trim();
    const detail = modal.querySelector('#newLocationDetail').value.trim();
    const typeLabel = type === 'incident' ? 'ACTIVE' : type === 'shelter' ? 'SHELTER' : 'SUPPLY';
    const address = modal.querySelector('#newLocationAddress').value.trim();
    if (address) { try { const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`); const results = await response.json(); if (results[0]) position = [Number(results[0].lat), Number(results[0].lon)]; } catch (error) { /* Keep the selected fallback position when geocoding is unavailable. */ } }
    incidents.push({ id, title, detail, address, status: typeLabel, type: type === 'incident' ? 'active' : type, coords: [position.lat || position[0], position.lng || position[1]] });
    renderIncidents();
    document.querySelector('#incidentCount').textContent = String(incidents.length).padStart(2, '0');
    addActivity('New ' + type + ' added', `${title}: ${detail}`, 'JM', 'coral');
    modal.remove();
  });
});
const unitDispatch = document.createElement('div');
unitDispatch.className = 'unit-dispatch';
unitDispatch.innerHTML = '<div class="dispatch-title"><label>STUDENT DISPATCH</label><span>ASSIGN A UNIT</span></div><div class="unit-types"><button class="unit-type selected" data-unit="USAR"><span>▣</span>USAR</button><button class="unit-type" data-unit="Swift water"><span>≈</span>SWIFT WATER</button><button class="unit-type" data-unit="Fire truck"><span>◇</span>FIRE</button><button class="unit-type" data-unit="Police"><span>⌁</span>POLICE</button><button class="unit-type" data-unit="EMS"><span>+</span>EMS</button><button class="unit-type" data-unit="Volunteer"><span>♥</span>VOLUNTEER</button><button class="unit-type" data-unit="Transport small"><span>▱</span>SMALL TRANSIT</button><button class="unit-type" data-unit="Transport medium"><span>▰</span>MEDIUM BUS</button><button class="unit-type" data-unit="Transport large"><span>▰</span>LARGE BUS</button><button class="unit-type" data-unit="Helicopter crew"><span>✦</span>HELICOPTER</button></div><div class="dispatch-fields"><label>DESTINATION<select id="unitDestination"><option value="INC-042">INC-042 · Pine St. Flooding</option><option value="INC-041">INC-041 · Bridge collapse</option><option value="INC-039">INC-039 · Shelter East</option><option value="INC-037">INC-037 · Medical staging</option></select></label><label>TEAM SIZE<select id="teamSize"><option>1 unit</option><option>2 units</option><option>3 units</option><option>4 units</option></select></label></div><button class="assign-button" id="assignBtn">Dispatch selected team <span>↗</span></button>';
document.querySelector('.dispatch-box').before(unitDispatch);
unitDispatch.hidden = true;
const instructorControls = document.createElement('div');
instructorControls.className = 'scenario-controls';
instructorControls.innerHTML = '<div class="dispatch-title"><label>INSTRUCTOR UPDATE</label><span>SCENARIO CONTROL</span></div><div class="dispatch-fields"><label>INCIDENT<select id="updateDestination"><option value="INC-042">INC-042 · Pine St. Flooding</option><option value="INC-041">INC-041 · Bridge collapse</option><option value="INC-039">INC-039 · Shelter East</option><option value="INC-037">INC-037 · Medical staging</option></select></label><label>STATUS<select id="updateStatus"><option value="WORSENING">WORSENING</option><option value="STABILIZING">STABILIZING</option><option value="RESOLVED">RESOLVED</option></select></label></div><textarea id="instructorNote" rows="2" placeholder="What changed at the scene?"></textarea><button class="assign-button" id="postUpdateBtn">Post scenario update <span>↗</span></button><div class="map-tools-title">MAP HAZARDS</div><div class="map-tools"><button class="map-action" id="closeStreetBtn">╳ Place street closure</button><button class="map-action" id="highWaterBtn">≈ Draw high water</button></div><p class="map-tool-hint" id="mapToolHint">Choose a tool, then click the map.</p>';
document.querySelector('.dispatch-box').before(instructorControls);
const studentRequest = document.createElement('div');
studentRequest.className = 'student-request';
studentRequest.hidden = true;
studentRequest.innerHTML = '<div class="dispatch-title"><label>NEED MORE SUPPORT?</label><span>REQUEST FROM INSTRUCTOR</span></div><div class="dispatch-fields"><label>UNIT TYPE<select id="requestUnit"><option>USAR</option><option>Swift water</option><option>Fire truck</option><option>Police</option><option>EMS</option><option>Volunteer</option><option>Transport small</option><option>Transport medium</option><option>Transport large</option><option>Helicopter crew</option></select></label><label>AMOUNT<select id="requestAmount"><option>1 unit</option><option>2 units</option><option>3 units</option><option>4 units</option></select></label></div><textarea id="requestNote" rows="2" placeholder="Why does your team need support?"></textarea><button class="send-button" id="requestBtn">Request additional units <span>↗</span></button>';
document.querySelector('.dispatch-box').before(studentRequest);
const unitMovement = document.createElement('div');
unitMovement.className = 'unit-movement';
unitMovement.hidden = true;
unitMovement.innerHTML = '<div class="dispatch-title"><label>UNIT MOVEMENT</label><span>SCENE ↔ STAGING</span></div><label class="movement-label">SELECT LIVE UNIT<select id="movementUnit"></select></label><div class="dispatch-fields"><label>MOVE TO SCENE<select id="movementDestination"><option value="INC-042">INC-042 · Pine St. Flooding</option><option value="INC-041">INC-041 · Bridge collapse</option><option value="INC-039">INC-039 · Shelter East</option><option value="INC-037">INC-037 · Medical staging</option></select></label><button class="return-button" id="returnStagingBtn">↩ Return to staging</button></div><button class="assign-button" id="sendSceneBtn">Send unit to scene <span>↗</span></button>';
document.querySelector('.dispatch-box').before(unitMovement);
const injectedStyles = document.createElement('style');
injectedStyles.textContent = '.scenario-controls,.student-request,.unit-movement{border-top:1px solid var(--line);padding:14px 0 13px}.scenario-controls textarea,.student-request textarea{margin:0 0 8px}.scenario-controls .dispatch-fields,.student-request .dispatch-fields,.unit-movement .dispatch-fields{margin:8px 0}.scenario-controls .assign-button{background:var(--teal)}.scenario-controls .assign-button:hover{background:var(--teal-dark)}.student-request .send-button{width:100%}.movement-label{display:block;color:var(--muted);font-size:8px;letter-spacing:1px;font-weight:700}.movement-label select,.unit-movement .dispatch-fields select{display:block;width:100%;border:1px solid var(--line);background:white;color:var(--ink);padding:7px 4px;margin-top:4px;font:10px "DM Sans"}.return-button{border:1px solid var(--teal);background:white;color:var(--teal);font-size:9px;font-weight:700;cursor:pointer;margin-top:15px;padding:7px 5px}.return-button:hover{background:#eaf5f1}.map-tools-title{border-top:1px solid var(--line);margin-top:13px;padding-top:12px;color:var(--muted);font-size:8px;letter-spacing:1px;font-weight:700}.map-tools{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:8px}.map-action{border:1px solid var(--line);background:white;color:var(--teal);padding:8px 4px;font-size:9px;font-weight:700;cursor:pointer}.map-action.active{background:#eaf5f1;border-color:var(--teal)}.map-tool-hint{color:var(--muted);font-size:9px;margin:7px 0 0}.closure-pin span{display:grid;place-items:center;width:24px;height:24px;background:#273b40;border:2px solid white;border-radius:50%;color:white;font-weight:700}.water-zone{fill:#338eaf;fill-opacity:.28;stroke:#2475a8;stroke-width:3;stroke-dasharray:8 5}.water-handle,.water-resize-handle{display:grid;place-items:center;width:24px;height:24px;border:2px solid white;border-radius:50%;color:white;font-weight:700}.water-handle{background:#2475a8}.water-resize-handle{background:#075e61;cursor:nwse-resize}';
document.head.append(injectedStyles);
function addActivity(label, detail, avatar = 'JM', color = 'coral') { const item = document.createElement('article'); item.className = 'activity-item'; item.innerHTML = `<span class="activity-avatar ${color}">${avatar}</span><div><p><strong>${label}</strong></p><small>Just now · All teams</small><div class="activity-note">${detail.replace(/[<>]/g, '')}</div></div>`; feed.prepend(item); }
let activeMapTool = null;
let highWaterZone = null;
let highWaterMoveHandle = null;
let highWaterResizeHandle = null;
function armMapTool(tool, button, hint) { activeMapTool = tool; document.querySelectorAll('.map-action').forEach((item) => item.classList.remove('active')); button.classList.add('active'); document.querySelector('#mapToolHint').textContent = hint; }
document.querySelector('#closeStreetBtn').addEventListener('click', (event) => armMapTool('closure', event.currentTarget, 'Click the map where the street is closed.'));
document.querySelector('#highWaterBtn').addEventListener('click', (event) => armMapTool('water', event.currentTarget, 'Click the map to place a movable high-water zone.'));
map.on('click', (event) => {
  if (activeMapTool === 'closure') {
    const marker = L.marker(event.latlng, { icon: L.divIcon({ className: 'closure-pin', html: '<span>╳</span>', iconSize: [24, 24], iconAnchor: [12, 12] }) }).addTo(map).bindPopup('<strong>STREET CLOSED</strong><br>Instructor hazard marker').openPopup();
    addActivity('Instructor placed street closure', `Road closed at ${event.latlng.lat.toFixed(4)}, ${event.latlng.lng.toFixed(4)}.`, 'JM', 'coral');
  }
  if (activeMapTool === 'water') {
    if (highWaterZone) highWaterZone.remove();
    if (highWaterMoveHandle) highWaterMoveHandle.remove();
    if (highWaterResizeHandle) highWaterResizeHandle.remove();
    const size = .0025;
    highWaterZone = L.rectangle([[event.latlng.lat - size, event.latlng.lng - size], [event.latlng.lat + size, event.latlng.lng + size]], { className: 'water-zone', color: '#2475a8', fillColor: '#338eaf', fillOpacity: .28, weight: 3, dashArray: '8 5' }).addTo(map).bindPopup('<strong>HIGH WATER</strong><br>Drag the center handle to move it. Drag the corner handle to resize it.').openPopup();
    highWaterMoveHandle = L.marker(event.latlng, { icon: L.divIcon({ className: 'water-handle', html: '<span>≈</span>', iconSize: [24, 24], iconAnchor: [12, 12] }), draggable: true }).addTo(map);
    highWaterResizeHandle = L.marker([event.latlng.lat + size, event.latlng.lng + size], { icon: L.divIcon({ className: 'water-resize-handle', html: '<span>↘</span>', iconSize: [24, 24], iconAnchor: [12, 12] }), draggable: true }).addTo(map);
    highWaterMoveHandle.on('drag', (dragEvent) => { const center = highWaterMoveHandle.getLatLng(); const bounds = highWaterZone.getBounds(); const oldCenter = bounds.getCenter(); const deltaLat = center.lat - oldCenter.lat; const deltaLng = center.lng - oldCenter.lng; highWaterZone.setBounds([[bounds.getSouth() + deltaLat, bounds.getWest() + deltaLng], [bounds.getNorth() + deltaLat, bounds.getEast() + deltaLng]]); highWaterResizeHandle.setLatLng([highWaterResizeHandle.getLatLng().lat + deltaLat, highWaterResizeHandle.getLatLng().lng + deltaLng]); });
    highWaterMoveHandle.on('dragend', () => { const finalPosition = highWaterMoveHandle.getLatLng(); addActivity('Instructor moved high-water zone', `High water moved to ${finalPosition.lat.toFixed(4)}, ${finalPosition.lng.toFixed(4)}.`, 'JM', 'coral'); });
    highWaterResizeHandle.on('drag', () => { const center = highWaterMoveHandle.getLatLng(); const corner = highWaterResizeHandle.getLatLng(); const height = Math.max(.0008, Math.abs(corner.lat - center.lat)); const width = Math.max(.0008, Math.abs(corner.lng - center.lng)); highWaterZone.setBounds([[center.lat - height, center.lng - width], [center.lat + height, center.lng + width]]); });
    highWaterResizeHandle.on('dragend', () => { const bounds = highWaterZone.getBounds(); addActivity('Instructor resized high-water zone', `High water area is now ${(bounds.getNorth() - bounds.getSouth()).toFixed(4)}° tall by ${(bounds.getEast() - bounds.getWest()).toFixed(4)}° wide.`, 'JM', 'coral'); });
    addActivity('Instructor marked high water', 'A movable high-water zone was added to the map.', 'JM', 'coral');
  }
  if (activeMapTool) { activeMapTool = null; document.querySelectorAll('.map-action').forEach((item) => item.classList.remove('active')); document.querySelector('#mapToolHint').textContent = 'Choose a tool, then click the map.'; }
});
const movementUnit = document.querySelector('#movementUnit');
movementUnit.innerHTML = vehicles.map((vehicle) => `<option value="${vehicle.id}">${vehicle.id} · ${vehicle.type}</option>`).join('');
function moveUnit(target, label) { const vehicle = vehicles.find((item) => item.id === movementUnit.value); const current = vehicle.marker.getLatLng(); vehicle.routeStart = [current.lat, current.lng]; vehicle.target = target; vehicle.progress = 0; vehicle.marker.setTooltipContent(`${vehicle.id} · ${label}`); addActivity('Student moved unit', `${vehicle.id} is ${label}.`, 'ST', 'teal'); }
document.querySelector('#sendSceneBtn').addEventListener('click', () => { const incident = incidents.find((item) => item.id === document.querySelector('#movementDestination').value); moveUnit(incident.coords, `moving to ${incident.title}`); });
document.querySelector('#returnStagingBtn').addEventListener('click', () => moveUnit([30.440, -91.160], 'returning to Shelter East staging'));
document.querySelector('#postUpdateBtn').addEventListener('click', () => { const incident = incidents.find((item) => item.id === document.querySelector('#updateDestination').value); const status = document.querySelector('#updateStatus').value; const note = document.querySelector('#instructorNote').value.trim() || `Conditions ${status.toLowerCase()} at the scene.`; incident.status = status; incident.detail = note; const card = list.querySelector(`[data-id="${incident.id}"]`); card.querySelector('.status').textContent = status; card.querySelector('p').textContent = note; markers[incident.id].setPopupContent(`<strong>${incident.id}</strong><br>${incident.title}<br><small>${note}</small>`); addActivity('Instructor updated ' + incident.title, `${status}: ${note}`); document.querySelector('#instructorNote').value = ''; });
document.querySelector('#requestBtn').addEventListener('click', () => { const unit = document.querySelector('#requestUnit').value; const amount = document.querySelector('#requestAmount').value; const incident = incidents.find((item) => item.id === document.querySelector('#unitDestination').value); const note = document.querySelector('#requestNote').value.trim() || 'Additional support requested at the scene.'; addActivity('Student requested support', `${amount} ${unit} requested for ${incident.title}. ${note}`, 'ST', 'teal'); document.querySelector('#requestNote').value = ''; });
let selectedUnit = 'USAR';
document.querySelectorAll('.unit-type').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.unit-type').forEach((item) => item.classList.remove('selected')); button.classList.add('selected'); selectedUnit = button.dataset.unit; }));
document.querySelector('#assignBtn').addEventListener('click', () => { const destination = document.querySelector('#unitDestination'); const teamSize = document.querySelector('#teamSize').value; const incident = incidents.find((item) => item.id === destination.value); const item = document.createElement('article'); item.className = 'activity-item'; item.innerHTML = `<span class="activity-avatar teal">ST</span><div><p><strong>Student team</strong> dispatched ${teamSize} ${selectedUnit}</p><small>Just now · ${incident.id}</small><div class="activity-note">${selectedUnit} en route to ${incident.title}.</div></div>`; feed.prepend(item); L.marker(incident.coords, { icon: markerIcon('resource') }).addTo(map).bindPopup(`<strong>${selectedUnit}</strong><br>En route to ${incident.title}`).openPopup(); });
document.querySelectorAll('[data-role]').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('[data-role]').forEach((item) => item.classList.remove('active')); button.classList.add('active'); const isStudent = button.dataset.role === 'student'; unitDispatch.hidden = !isStudent; studentRequest.hidden = !isStudent; unitMovement.hidden = !isStudent; instructorControls.hidden = isStudent; document.querySelector('.briefing-card p').textContent = isStudent ? 'Select an incident to review its objectives, then acknowledge your team dispatch.' : 'Move teams through the flood corridor. Keep the east shelter below 80% capacity.'; }));
document.querySelector('#sendBtn').addEventListener('click', () => { const input = document.querySelector('#dispatchInput'); const text = input.value.trim(); if (!text) return; const item = document.createElement('article'); item.className = 'activity-item'; item.innerHTML = `<span class="activity-avatar coral">JM</span><div><p><strong>Jules Morgan</strong> sent a dispatch</p><small>Just now · All teams</small><div class="activity-note">${text.replace(/[<>]/g, '')}</div></div>`; feed.prepend(item); input.value = ''; });
document.querySelector('#recenterBtn').addEventListener('click', () => map.flyTo([30.451, -91.180], 14, { duration: .6 }));
document.querySelector('#locateBtn').addEventListener('click', () => { if (navigator.geolocation) navigator.geolocation.getCurrentPosition((position) => map.flyTo([position.coords.latitude, position.coords.longitude], 15)); });
setInterval(() => { document.querySelector('#clock').textContent = new Date().toLocaleTimeString('en-US', { hour12: false }); }, 1000);
let remaining = 5272; setInterval(() => { remaining = Math.max(0, remaining - 1); const h = String(Math.floor(remaining / 3600)).padStart(2, '0'); const m = String(Math.floor(remaining % 3600 / 60)).padStart(2, '0'); const s = String(remaining % 60).padStart(2, '0'); document.querySelector('#countdown').textContent = `${h}:${m}:${s}`; }, 1000);
