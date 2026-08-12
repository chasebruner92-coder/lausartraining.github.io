const busCapacityMap = {
  Mini: 10,
  Shuttle: 20,
  Transit: 35,
  Coach: 55
};

const quickAddCatalog = {
  unit: { kind: 'unit', label: 'Add Unit', idPrefix: 'UNIT', type: 'Support', station: 'HQ Command' },
  volunteer: { kind: 'volunteer', label: 'Add Volunteer', idPrefix: 'VOL', type: 'Volunteer', station: 'Shelter East' },
  shelter: { kind: 'incident', label: 'Shelter', idPrefix: 'SHEL', type: 'shelter', title: 'Shelter Open', detail: 'Shelter opened for displaced residents.', status: 'MONITOR' },
  'road-block': { kind: 'incident', label: 'Road Block', idPrefix: 'RB', type: 'active', title: 'Road Block', detail: 'Road blocked by debris or emergency closure.', status: 'ACTIVE' },
  'power-line': { kind: 'incident', label: 'Power Line Down', idPrefix: 'PL', type: 'critical', title: 'Power Line Down', detail: 'Power line down and creating a hazard area.', status: 'CRITICAL' },
  flood: { kind: 'incident', label: 'Flood Area', idPrefix: 'FLD', type: 'critical', title: 'Flooding', detail: 'Flooded area affecting access and evacuations.', status: 'CRITICAL' },
  fire: { kind: 'incident', label: 'Fire / Smoke', idPrefix: 'FIR', type: 'critical', title: 'Fire / Smoke', detail: 'Active fire or smoke condition in the area.', status: 'CRITICAL' },
  medical: { kind: 'incident', label: 'Medical Site', idPrefix: 'MED', type: 'resource', title: 'Medical Site', detail: 'Treatment point opened for injuries and triage.', status: 'RESOURCE' },
  evac: { kind: 'incident', label: 'Evac Route', idPrefix: 'EVA', type: 'active', title: 'Evacuation Route', detail: 'Evacuation route established for residents.', status: 'ACTIVE' },
  command: { kind: 'incident', label: 'Command Post', idPrefix: 'CMD', type: 'resource', title: 'Command Post', detail: 'Command and coordination point activated.', status: 'RESOURCE' },
  boo: { kind: 'incident', label: 'BOO', idPrefix: 'BOO', type: 'resource', title: 'Base of Operations', detail: 'Base of operations established for response teams.', status: 'RESOURCE' },
  fob: { kind: 'incident', label: 'FOB', idPrefix: 'FOB', type: 'resource', title: 'Forward Operating Base', detail: 'Forward operating base established for field support.', status: 'RESOURCE' },
  supply: { kind: 'incident', label: 'Supply Cache', idPrefix: 'SUP', type: 'resource', title: 'Supply Cache', detail: 'Supplies staged for response teams.', status: 'RESOURCE' },
  debris: { kind: 'incident', label: 'Debris Zone', idPrefix: 'DBR', type: 'active', title: 'Debris Zone', detail: 'Debris field blocking access or movement.', status: 'ACTIVE' },
  utility: { kind: 'incident', label: 'Utility Issue', idPrefix: 'UTL', type: 'active', title: 'Utility Issue', detail: 'Power, water, gas, or sewer issue affecting operations.', status: 'ACTIVE' }
};

const scenarioPresets = {
  louisiana: {
    title: 'LOUISIANA // MAJOR DISASTER',
    unitsConnected: 18,
    incidents: [
      { id: 'INC-042', title: 'Pine St. Flooding', detail: 'Water rising · 42 people awaiting transport', people: 42, status: 'CRITICAL', type: 'critical', coords: [30.451, -91.187] },
      { id: 'INC-041', title: 'Bridge collapse', detail: 'Access blocked · 12 people trapped', people: 12, status: 'ACTIVE', type: 'active', coords: [30.462, -91.170] },
      { id: 'INC-039', title: 'Shelter East', detail: 'Capacity 64% · 128 people', people: 128, capacity: 200, address: '2250 Florida Blvd, Baton Rouge, Louisiana', status: 'MONITOR', type: 'shelter', coords: [30.440, -91.160] },
      { id: 'INC-037', title: 'Medical staging', detail: 'Medic 04 · 2 available', status: 'RESOURCE', type: 'resource', coords: [30.430, -91.180] }
    ],
    vehicles: [
      { id: 'USAR 01', type: 'USAR', position: [30.438, -91.204], route: [[30.438, -91.204], [30.445, -91.198], [30.451, -91.187], [30.460, -91.178]], step: 0 },
      { id: 'SWIFT 02', type: 'Swift water', position: [30.475, -91.170], route: [[30.475, -91.170], [30.470, -91.176], [30.462, -91.170], [30.455, -91.166]], step: 0 },
      { id: 'MEDIC 04', type: 'EMS', position: [30.414, -91.181], route: [[30.414, -91.181], [30.420, -91.180], [30.430, -91.180], [30.440, -91.160]], step: 0 }
    ]
  },
  coastal: {
    title: 'COASTAL STORM // EVACUATION',
    unitsConnected: 16,
    incidents: [
      { id: 'INC-051', title: 'Harbor surge', detail: 'Road washout · 30 families moving north', people: 30, status: 'CRITICAL', type: 'critical', coords: [29.950, -90.070] },
      { id: 'INC-048', title: 'Route 90 closure', detail: 'Traffic reroute in effect · 8 crews blocked', people: 8, status: 'ACTIVE', type: 'active', coords: [29.965, -90.110] },
      { id: 'INC-046', title: 'Shelter North', detail: 'Capacity 72% · 180 people', people: 180, capacity: 250, address: '1804 Gulf Coast Hwy', status: 'MONITOR', type: 'shelter', coords: [29.975, -90.120] },
      { id: 'INC-044', title: 'Utility staging', detail: 'Generator crew ready', status: 'RESOURCE', type: 'resource', coords: [29.960, -90.145] }
    ],
    vehicles: [
      { id: 'EVA 07', type: 'Evac', position: [29.955, -90.088], route: [[29.955, -90.088], [29.960, -90.095], [29.970, -90.110], [29.975, -90.120]], step: 0 },
      { id: 'RES 12', type: 'Utility', position: [29.940, -90.150], route: [[29.940, -90.150], [29.945, -90.140], [29.950, -90.130], [29.960, -90.120]], step: 0 },
      { id: 'MEDIC 02', type: 'EMS', position: [29.980, -90.105], route: [[29.980, -90.105], [29.970, -90.110], [29.965, -90.120], [29.960, -90.130]], step: 0 }
    ]
  },
  urban: {
    title: 'URBAN FIRE // SHELTER RESPONSE',
    unitsConnected: 14,
    incidents: [
      { id: 'INC-060', title: 'Warehouse fire', detail: 'Heavy smoke · 21 trapped', people: 21, status: 'CRITICAL', type: 'critical', coords: [30.521, -91.081] },
      { id: 'INC-058', title: 'Downtown feeder line', detail: 'Grid loss · power outage', people: 6, status: 'ACTIVE', type: 'active', coords: [30.510, -91.086] },
      { id: 'INC-054', title: 'Shelter Civic Center', detail: 'Capacity 59% · 148 people', people: 148, capacity: 250, address: '701 Main St, Baton Rouge', status: 'MONITOR', type: 'shelter', coords: [30.513, -91.097] },
      { id: 'INC-052', title: 'Supply cache', detail: 'Water and food packages staged', status: 'RESOURCE', type: 'resource', coords: [30.530, -91.075] }
    ],
    vehicles: [
      { id: 'FIRE 06', type: 'Fire', position: [30.518, -91.084], route: [[30.518, -91.084], [30.517, -91.088], [30.516, -91.092], [30.513, -91.097]], step: 0 },
      { id: 'RES 09', type: 'Support', position: [30.528, -91.072], route: [[30.528, -91.072], [30.527, -91.077], [30.523, -91.081], [30.519, -91.086]], step: 0 },
      { id: 'MEDIC 11', type: 'EMS', position: [30.505, -91.090], route: [[30.505, -91.090], [30.510, -91.090], [30.514, -91.094], [30.517, -91.098]], step: 0 }
    ]
  },
  wildfire: {
    title: 'WILDFIRE // RIDGE RESPONSE',
    unitsConnected: 13,
    incidents: [
      { id: 'INC-071', title: 'Ridge flare-up', detail: 'Wind shift · 14 homes at risk', people: 14, status: 'CRITICAL', type: 'critical', coords: [31.290, -92.530] },
      { id: 'INC-069', title: 'Road access', detail: 'Ash clearing in progress', people: 5, status: 'ACTIVE', type: 'active', coords: [31.316, -92.530] },
      { id: 'INC-065', title: 'Shelter Ridge', detail: 'Capacity 68% · 170 people', people: 170, capacity: 250, address: '1420 Forest View Rd', status: 'MONITOR', type: 'shelter', coords: [31.320, -92.540] },
      { id: 'INC-063', title: 'Air support', detail: 'Helicopter crew on standby', status: 'RESOURCE', type: 'resource', coords: [31.305, -92.520] }
    ],
    vehicles: [
      { id: 'AIR 01', type: 'Air', position: [31.300, -92.525], route: [[31.300, -92.525], [31.302, -92.530], [31.306, -92.532], [31.312, -92.530]], step: 0 },
      { id: 'RIG 04', type: 'Fire', position: [31.318, -92.540], route: [[31.318, -92.540], [31.315, -92.535], [31.310, -92.530], [31.306, -92.528]], step: 0 },
      { id: 'MEDIC 08', type: 'EMS', position: [31.288, -92.518], route: [[31.288, -92.518], [31.292, -92.520], [31.298, -92.525], [31.302, -92.530]], step: 0 }
    ]
  }
};

let incidents = [...scenarioPresets.louisiana.incidents];
let vehicles = [...scenarioPresets.louisiana.vehicles];
let scenarioName = scenarioPresets.louisiana.title;
let activeUnitEditId = null;
let callsEnabled = true;
let callQueue = [];
let gridDrawMode = false;
let activeGridLine = null;
let gridSegments = [];

const defaultCommandPoints = {
  BOO: { label: 'HQ Command', coords: [30.451, -91.180] },
  FOB: { label: 'Bridge Access', coords: [30.462, -91.170] }
};
let commandPoints = { ...defaultCommandPoints };

const list = document.querySelector('#incidentList');
const feed = document.querySelector('#activityFeed');
const markers = {};
const vehicleMarkers = {};
const commandPointMarkers = {};
const incidentOverlays = {};

function isFloodIncident(incident) {
  if (!incident) return false;
  const summary = `${incident.title || ''} ${incident.detail || ''}`.toLowerCase();
  return summary.includes('flood') || summary.includes('water rise') || summary.includes('flooded');
}

function buildFloodShape(coords, radiusLat = 0.006, radiusLng = 0.01) {
  const [lat, lng] = coords;
  return [
    [lat + radiusLat, lng],
    [lat + radiusLat * 0.55, lng + radiusLng],
    [lat, lng + radiusLng * 1.4],
    [lat - radiusLat * 0.7, lng + radiusLng * 1.1],
    [lat - radiusLat, lng],
    [lat - radiusLat * 0.5, lng - radiusLng * 1.2],
    [lat + radiusLat * 0.35, lng - radiusLng * 1.1]
  ];
}

function getActiveFloodIncident() {
  const selectedId = document.querySelector('.incident.selected')?.dataset.id;
  if (selectedId) {
    const selected = incidents.find((incident) => incident.id === selectedId);
    if (selected && isFloodIncident(selected)) return selected;
  }
  return incidents.find((incident) => isFloodIncident(incident)) || null;
}

function completeGridDraw() {
  if (!activeGridLine) return;

  const latlngs = activeGridLine.getLatLngs();
  if (!Array.isArray(latlngs) || latlngs.length < 2) {
    activeGridLine.remove();
    activeGridLine = null;
    return;
  }

  const name = document.querySelector('#gridNameInput')?.value.trim() || 'Grid route';
  activeGridLine.setStyle({ color: '#123d42', weight: 3, opacity: 0.9, dashArray: '8 8' });
  activeGridLine.bindPopup(`<strong>${name}</strong>`, { autoPan: false });
  gridSegments.push({ name, latlngs: [...latlngs] });
  activeGridLine = null;
}

function toggleMapGrid() {
  gridDrawMode = !gridDrawMode;
  const mapContainer = document.querySelector('#map');
  if (mapContainer) {
    mapContainer.style.cursor = gridDrawMode ? 'crosshair' : '';
  }
  addActivity('Grid drawing', gridDrawMode ? 'Click and drag on the map to draw a route. Add a name in the field first.' : 'Grid drawing mode off.');
}

function adjustFloodSize(delta) {
  const incident = getActiveFloodIncident();
  if (!incident || !isFloodIncident(incident)) return;

  const current = Number(incident.floodRadius || 0.006);
  const next = Math.min(0.02, Math.max(0.0025, current + delta));
  incident.floodRadius = Number(next.toFixed(4));

  if (incidentOverlays[incident.id]) {
    const floodLayer = incidentOverlays[incident.id];
    floodLayer.setLatLngs(buildFloodShape(incident.coords, incident.floodRadius, incident.floodRadius * 1.65));
  }

  renderIncidents();
  persistScenarioState();
  addActivity('Flood zone updated', `${incident.id} flood area ${delta > 0 ? 'expanded' : 'reduced'} to ${incident.floodRadius.toFixed(4)} lat units.`);
}

function handleQuickAdd(action) {
  const preset = quickAddCatalog[action];
  if (!preset) return;

  if (preset.kind === 'unit') {
    const nextIndex = vehicles.filter((vehicle) => vehicle.id.startsWith(preset.idPrefix)).length + 1;
    const newId = `${preset.idPrefix} ${String(nextIndex).padStart(2, '0')}`;
    vehicles.push({
      id: newId,
      type: preset.type,
      station: preset.station,
      position: [30.451 + (Math.random() * 0.03 - 0.015), -91.180 + (Math.random() * 0.03 - 0.015)],
      route: [[30.451, -91.180], [30.452, -91.178], [30.454, -91.176]],
      step: 0
    });
    renderUnitList();
    renderVehicleMarkers();
    addActivity('Unit added', `${newId} was assigned to ${preset.station}.`);
  }

  if (preset.kind === 'volunteer') {
    const nextIndex = vehicles.filter((vehicle) => vehicle.id.startsWith(preset.idPrefix)).length + 1;
    const newId = `${preset.idPrefix} ${String(nextIndex).padStart(2, '0')}`;
    vehicles.push({
      id: newId,
      type: preset.type,
      station: preset.station,
      position: [30.448, -91.170],
      route: [[30.448, -91.170], [30.452, -91.176], [30.455, -91.180]],
      step: 0
    });
    renderUnitList();
    renderVehicleMarkers();
    addActivity('Volunteer added', `${newId} checked in at ${preset.station}.`);
  }

  if (preset.kind === 'incident') {
    const nextIndex = incidents.filter((incident) => incident.id.startsWith(preset.idPrefix)).length + 1;
    const newId = `${preset.idPrefix}-${String(nextIndex).padStart(3, '0')}`;
    incidents.push({
      id: newId,
      title: preset.title,
      detail: preset.detail,
      status: preset.status,
      type: preset.type,
      people: preset.type === 'shelter' ? 25 : 12,
      coords: [30.451 + (Math.random() * 0.04 - 0.02), -91.180 + (Math.random() * 0.04 - 0.02)]
    });
    renderIncidents();
    updateOperationsBoard();
    persistScenarioState();
    addActivity('Quick add', `${preset.label} created and posted to the map.`);
    const incidentCount = document.querySelector('#incidentCount');
    if (incidentCount) incidentCount.textContent = String(incidents.length).padStart(2, '0');
  }
}

function persistScenarioState() {
  const payload = {
    scenarioName,
    incidents,
    vehicles,
    commandPoints
  };

  try {
    localStorage.setItem('beaconScenarioState', JSON.stringify(payload));
  } catch (error) {
    console.warn('Unable to save scenario state:', error);
  }
}

function loadSavedScenarioState() {
  try {
    const raw = localStorage.getItem('beaconScenarioState');
    if (!raw) return false;

    const saved = JSON.parse(raw);
    if (!saved || !Array.isArray(saved.incidents) || !Array.isArray(saved.vehicles)) return false;

    incidents = saved.incidents;
    vehicles = saved.vehicles;
    scenarioName = saved.scenarioName || saved.scenarioName || scenarioName;
    commandPoints = saved.commandPoints || { ...defaultCommandPoints };

    const scenarioTitle = document.querySelector('#scenarioTitle');
    const scenarioNameInput = document.querySelector('#scenarioNameInput');
    if (scenarioTitle) scenarioTitle.textContent = scenarioName;
    if (scenarioNameInput) scenarioNameInput.value = scenarioName;
    const booLocation = document.querySelector('#booLocation');
    const fobLocation = document.querySelector('#fobLocation');
    if (booLocation) booLocation.textContent = commandPoints.BOO?.label || 'HQ Command';
    if (fobLocation) fobLocation.textContent = commandPoints.FOB?.label || 'Bridge Access';
    return true;
  } catch (error) {
    console.warn('Unable to restore saved scenario state:', error);
    return false;
  }
}

function renderCallFeed() {
  const callFeedList = document.querySelector('#callFeedList');
  if (!callFeedList) return;

  if (!callsEnabled) {
    callFeedList.innerHTML = '<div class="call-item"><div class="call-tag">OFF</div><div class="call-meta"><strong>911 feed paused</strong><small>Instructor disabled incoming calls.</small></div><span class="call-time">--:--</span></div>';
    return;
  }

  callFeedList.innerHTML = callQueue.slice(0, 6).map((call) => `
    <div class="call-item">
      <div class="call-tag">${call.code}</div>
      <div class="call-meta">
        <strong>${call.label}</strong>
        <small>${call.summary}</small>
      </div>
      <span class="call-time">${call.time}</span>
    </div>
  `).join('') || '<div class="call-item"><div class="call-tag">OK</div><div class="call-meta"><strong>No active calls</strong><small>Dispatch queue is clear.</small></div><span class="call-time">--:--</span></div>';
}

function add911Call(label, summary, code = '911') {
  if (!callsEnabled) return;
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  callQueue.unshift({ label, summary, code, time });
  callQueue = callQueue.slice(0, 8);
  renderCallFeed();
}

function initCallFeed() {
  const toggle = document.querySelector('#callFeedToggle');
  if (!toggle) return;

  toggle.addEventListener('change', () => {
    callsEnabled = toggle.checked;
    renderCallFeed();
    addActivity('911 feed', callsEnabled ? 'Incoming 911 calls enabled.' : 'Incoming 911 calls paused by instructor.');
  });

  const templates = [
    ['Flooded Road', 'Caller reports water over roadway near Pine St. and 3rd Ave.', 'FLOOD'],
    ['Power Line Down', 'Downed wire reported near the shelter access road.', 'UTIL'],
    ['Medical Emergency', 'Adult male trapped in home with breathing difficulty.', 'MED'],
    ['Structure Fire', 'Smoke and fire reported from a residential block.', 'FIRE'],
    ['Road Block', 'Vehicle pile-up and debris affecting eastbound traffic.', 'ROAD'],
    ['Evacuation Request', 'Multiple families need transport to the nearest shelter.', 'EVA'],
    ['Gas Leak', 'Strong odor of gas reported near the bridge corridor.', 'GAS'],
    ['Shelter Overflow', 'Shelter at capacity and requesting additional support.', 'SHEL']
  ];

  setInterval(() => {
    if (!callsEnabled) return;
    const [label, summary, code] = templates[Math.floor(Math.random() * templates.length)];
    add911Call(label, summary, code);
  }, 45000);

  renderCallFeed();
}

function getVehicleBusCapacity(vehicle) {
  if (!vehicle) return 0;
  const busType = vehicle.busType || 'Shuttle';
  return busCapacityMap[busType] || busCapacityMap.Shuttle;
}

function updateStudentDispatchControls() {
  const unitSelect = document.querySelector('#studentUnitSelect');
  const incidentSelect = document.querySelector('#studentIncidentSelect');
  const passengerInput = document.querySelector('#passengerCountInput');
  const busSelect = document.querySelector('#busSizeSelect');
  if (!unitSelect || !incidentSelect || !passengerInput || !busSelect) return;

  const activeUnits = vehicles.filter((vehicle) => vehicle.id && !vehicle.id.toLowerCase().includes('vol'));
  const unitOptions = activeUnits.length ? activeUnits : vehicles;
  unitSelect.innerHTML = unitOptions.map((vehicle) => `
    <option value="${vehicle.id}">${vehicle.id}${vehicle.assignedIncidentId ? ' · dispatched' : ''}</option>
  `).join('') || '<option value="">No units available</option>';

  incidentSelect.innerHTML = incidents.map((incident) => `<option value="${incident.id}">${incident.title}</option>`).join('') || '<option value="">No incidents</option>';

  const selectedUnit = unitOptions.find((vehicle) => vehicle.id === unitSelect.value) || unitOptions[0];
  if (selectedUnit) {
    const capacity = getVehicleBusCapacity(selectedUnit);
    const currentBus = selectedUnit.busType || 'Shuttle';
    busSelect.value = currentBus;
    passengerInput.value = Math.min(String(selectedUnit.passengers || Math.min(12, capacity)), String(capacity));
    passengerInput.max = String(capacity);
  }
}

function renderUnitList() {
  const unitList = document.querySelector('#unitList');
  if (!unitList) return;

  unitList.innerHTML = vehicles.map((vehicle) => `
    <div class="unit-item" data-unit-id="${vehicle.id}">
      <div>
        <strong>${vehicle.id}</strong>
        <small>${vehicle.type} · ${vehicle.assignedIncidentId ? `Dispatch: ${vehicle.assignedIncidentId} · ${vehicle.busType || 'Shuttle'} bus` : vehicle.position ? vehicle.position.join(', ') : 'stationed'}</small>
      </div>
      <div class="unit-item-actions">
        <button type="button" data-edit-unit="${vehicle.id}">Edit</button>
        <button type="button" data-delete-unit="${vehicle.id}">Del</button>
      </div>
    </div>
  `).join('');

  unitList.querySelectorAll('[data-edit-unit]').forEach((button) => {
    button.addEventListener('click', () => {
      const unit = vehicles.find((item) => item.id === button.dataset.editUnit);
      const unitNameInput = document.querySelector('#unitNameInput');
      const unitStationSelect = document.querySelector('#unitStationSelect');
      if (!unit || !unitNameInput || !unitStationSelect) return;

      activeUnitEditId = unit.id;
      unitNameInput.value = unit.id;
      unitStationSelect.value = unit.station || 'HQ Command';
      unitNameInput.focus();
    });
  });

  unitList.querySelectorAll('[data-delete-unit]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.deleteUnit;
      vehicles = vehicles.filter((vehicle) => vehicle.id !== id);
      renderUnitList();
      renderVehicleMarkers();
      updateOperationsBoard();
      persistScenarioState();
      addActivity('Unit update', `${id} removed from the active roster.`);
    });
  });
}

function applyScenarioName() {
  const scenarioTitle = document.querySelector('#scenarioTitle');
  const scenarioInput = document.querySelector('#scenarioNameInput');
  if (scenarioTitle && scenarioInput) {
    scenarioTitle.textContent = scenarioInput.value.trim() || scenarioName;
    scenarioName = scenarioTitle.textContent.trim() || scenarioName;
    persistScenarioState();
  }
}

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
  Object.keys(markers).forEach((key) => delete markers[key]);
  Object.values(incidentOverlays).forEach((layer) => layer.remove());
  Object.keys(incidentOverlays).forEach((key) => delete incidentOverlays[key]);

  list.innerHTML = incidents.map((incident, index) => `
    <article class="incident ${incident.type} ${index === 0 ? 'selected' : ''}" data-id="${incident.id}">
      <div class="incident-top">
        <span class="incident-id">${incident.id}</span>
        <span class="status">${incident.status}</span>
      </div>
      <h3>${incident.title}</h3>
      <p>${incident.type === 'shelter' ? `Capacity ${Math.round((incident.people / incident.capacity) * 100)}% · ${incident.people} people` : incident.detail}</p>
      ${incident.type === 'shelter' ? `<div class="location-row"><span>${incident.address || 'Map location'}</span></div>` : ''}
      <div class="incident-actions">
        <button type="button" class="resolve-incident" data-incident-id="${incident.id}">${incident.status === 'RESOLVED' ? 'Reopen' : 'Resolve'}</button>
        <button type="button" class="remove-incident" data-incident-id="${incident.id}">Delete</button>
      </div>
    </article>
  `).join('');

  incidents.forEach((incident) => {
    const marker = L.marker(incident.coords, { draggable: true }).addTo(map);
    marker.bindPopup(`<strong>${incident.id}</strong><br>${incident.title}<br><small>${incident.detail}${incident.address ? `<br>${incident.address}` : ''}</small>`, { autoPan: false });
    marker.on('dragend', () => {
      const latLng = marker.getLatLng();
      incident.coords = [latLng.lat, latLng.lng];

      if (incidentOverlays[incident.id]) {
        const floodRadius = Number(incident.floodRadius || 0.006);
        const nextShape = buildFloodShape(incident.coords, floodRadius, floodRadius * 1.65);
        incidentOverlays[incident.id].setLatLngs(nextShape);
      }

      persistScenarioState();
      addActivity('Incident moved', `${incident.id} was repositioned on the map.`);
    });
    markers[incident.id] = marker;

    if (isFloodIncident(incident)) {
      const floodRadius = Number(incident.floodRadius || 0.006);
      const floodLayer = L.polygon(buildFloodShape(incident.coords, floodRadius, floodRadius * 1.65), {
        color: '#3fa9ff',
        fillColor: '#5ec4ff',
        fillOpacity: 0.28,
        weight: 2,
        opacity: 0.8
      }).addTo(map);
      floodLayer.bindPopup(`<strong>${incident.id}</strong><br>${incident.title}<br><small>Flooded zone shown for student briefing.</small>`, { autoPan: false });
      incidentOverlays[incident.id] = floodLayer;
    }
  });

  list.querySelectorAll('.incident').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('.remove-incident')) return;
      list.querySelectorAll('.incident').forEach((item) => item.classList.remove('selected'));
      card.classList.add('selected');
      const target = markers[card.dataset.id];
      if (target) {
        target.openPopup();
        map.flyTo(target.getLatLng(), 15, { duration: 0.6 });
      }
    });
  });

  list.querySelectorAll('.resolve-incident').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = button.dataset.incidentId;
      const incident = incidents.find((item) => item.id === id);
      if (!incident) return;

      if (incident.status === 'RESOLVED') {
        incident.status = incident.lastStatus || 'ACTIVE';
        addActivity('Incident reopened', `${id} was returned to the active queue.`);
      } else {
        incident.lastStatus = incident.status || 'ACTIVE';
        incident.status = 'RESOLVED';
        addActivity('Incident resolved', `${id} was marked resolved.`);
      }

      renderIncidents();
      updateOperationsBoard();
      persistScenarioState();
      const incidentCount = document.querySelector('#incidentCount');
      if (incidentCount) incidentCount.textContent = String(incidents.length).padStart(2, '0');
    });
  });

  list.querySelectorAll('.remove-incident').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = button.dataset.incidentId;
      incidents = incidents.filter((incident) => incident.id !== id);
      renderIncidents();
      updateOperationsBoard();
      persistScenarioState();
      addActivity('Incident removed', `${id} was removed from the scenario.`);
      const incidentCount = document.querySelector('#incidentCount');
      if (incidentCount) incidentCount.textContent = String(incidents.length).padStart(2, '0');
    });
  });
}

function renderVehicleMarkers() {
  Object.values(vehicleMarkers).forEach((marker) => marker.remove());
  Object.keys(vehicleMarkers).forEach((key) => delete vehicleMarkers[key]);

  vehicles.forEach((vehicle) => {
    const marker = L.marker(vehicle.position).addTo(map);
    const color = vehicle.type.toLowerCase().includes('ems') || vehicle.type.toLowerCase().includes('medic') ? '#0d8b8b' : '#ef725e';
    marker.setIcon(L.divIcon({
      className: 'vehicle-pin',
      html: `<span style="background:${color}">${vehicle.id.split(' ')[0].slice(0, 2).toUpperCase()}</span>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    }));
    marker.bindPopup(`<strong>${vehicle.id}</strong><br>${vehicle.type}`, { autoPan: false });
    vehicleMarkers[vehicle.id] = marker;
  });
}

function renderCommandPointMarkers() {
  Object.values(commandPointMarkers).forEach((marker) => marker.remove());
  Object.keys(commandPointMarkers).forEach((key) => delete commandPointMarkers[key]);

  Object.entries(commandPoints).forEach(([key, point]) => {
    const marker = L.marker(point.coords).addTo(map);
    marker.bindPopup(`<strong>${key}</strong><br>${point.label}`, { autoPan: false });
    marker.setIcon(L.divIcon({
      className: 'vehicle-pin',
      html: `<span style="background:#123d42">${key}</span>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    }));
    commandPointMarkers[key] = marker;
  });

  const booLocation = document.querySelector('#booLocation');
  const fobLocation = document.querySelector('#fobLocation');
  if (booLocation) booLocation.textContent = commandPoints.BOO?.label || 'HQ Command';
  if (fobLocation) fobLocation.textContent = commandPoints.FOB?.label || 'Bridge Access';
}

function initCommandPoints() {
  const setBooBtn = document.querySelector('#setBooBtn');
  const setFobBtn = document.querySelector('#setFobBtn');

  if (!setBooBtn || !setFobBtn) return;

  setBooBtn.addEventListener('click', () => {
    const center = map.getCenter();
    commandPoints.BOO = { label: 'HQ Command', coords: [center.lat, center.lng] };
    renderCommandPointMarkers();
    persistScenarioState();
    addActivity('BOO updated', `Base of operations moved to ${center.lat.toFixed(3)}, ${center.lng.toFixed(3)}.`);
  });

  setFobBtn.addEventListener('click', () => {
    const center = map.getCenter();
    commandPoints.FOB = { label: 'Bridge Access', coords: [center.lat, center.lng] };
    renderCommandPointMarkers();
    persistScenarioState();
    addActivity('FOB updated', `Forward operating base moved to ${center.lat.toFixed(3)}, ${center.lng.toFixed(3)}.`);
  });
}

function tickVehicleMovement() {
  vehicles.forEach((vehicle) => {
    if (!vehicle.route || vehicle.route.length < 2) return;

    const nextStep = (vehicle.step + 1) % vehicle.route.length;
    vehicle.step = nextStep;
    vehicle.position = [...vehicle.route[nextStep]];

    if (vehicleMarkers[vehicle.id]) {
      vehicleMarkers[vehicle.id].setLatLng(vehicle.position);
    }
  });

  updateOperationsBoard();
}

function initScenarioControls() {
  const quickAddButtons = document.querySelectorAll('[data-quick-add]');
  quickAddButtons.forEach((button) => {
    button.addEventListener('click', () => handleQuickAdd(button.dataset.quickAdd));
  });

  const scenarioBtn = document.querySelector('#scenarioBtn');
  const modal = document.querySelector('#scenarioModal');
  const cancelBtn = document.querySelector('#cancelScenarioBtn');
  const applyBtn = document.querySelector('#applyScenarioBtn');
  const scenarioSelect = document.querySelector('#scenarioSelect');
  const addScenarioIncidentBtn = document.querySelector('#addScenarioIncidentBtn');
  const saveUnitBtn = document.querySelector('#saveUnitBtn');
  const clearUnitBtn = document.querySelector('#clearUnitBtn');
  const incidentNameInput = document.querySelector('#incidentNameInput');
  const unitNameInput = document.querySelector('#unitNameInput');
  const unitStationSelect = document.querySelector('#unitStationSelect');
  const scenarioNameInput = document.querySelector('#scenarioNameInput');
  const incidentStageSelect = document.querySelector('#incidentStageSelect');
  const applyIncidentStageBtn = document.querySelector('#applyIncidentStageBtn');
  const toggleGridBtn = document.querySelector('#toggleGridBtn');
  const saveGridBtn = document.querySelector('#saveGridBtn');
  const shrinkFloodBtn = document.querySelector('#shrinkFloodBtn');
  const growFloodBtn = document.querySelector('#growFloodBtn');
  const rapidGridBtn = document.querySelector('[data-grid-toggle="toggle"]');

  if (scenarioNameInput) {
    scenarioNameInput.addEventListener('input', applyScenarioName);
  }

  if (applyIncidentStageBtn && incidentStageSelect) {
    applyIncidentStageBtn.addEventListener('click', () => {
      const selected = document.querySelector('.incident.selected');
      if (!selected) return;
      const id = selected.dataset.id;
      const incident = incidents.find((item) => item.id === id);
      if (!incident) return;

      incident.lastStatus = incident.status || 'ACTIVE';
      incident.status = incidentStageSelect.value;
      if (incident.status === 'RESOLVED' && incident.lastStatus === 'RESOLVED') {
        incident.status = 'ACTIVE';
      }

      renderIncidents();
      updateOperationsBoard();
      persistScenarioState();
      addActivity('Incident stage', `${incident.id} moved to ${incident.status}.`);
    });
  }

  if (toggleGridBtn) toggleGridBtn.addEventListener('click', toggleMapGrid);
  if (rapidGridBtn) rapidGridBtn.addEventListener('click', toggleMapGrid);
  if (saveGridBtn) {
    saveGridBtn.addEventListener('click', () => {
      if (activeGridLine) {
        completeGridDraw();
      }
      addActivity('Grid saved', 'The current grid line has been saved to the map.');
      gridDrawMode = false;
      const mapContainer = document.querySelector('#map');
      if (mapContainer) mapContainer.style.cursor = '';
    });
  }
  if (shrinkFloodBtn) shrinkFloodBtn.addEventListener('click', () => adjustFloodSize(-0.0015));
  if (growFloodBtn) growFloodBtn.addEventListener('click', () => adjustFloodSize(0.0015));

  if (addScenarioIncidentBtn && incidentNameInput) {
    addScenarioIncidentBtn.addEventListener('click', () => {
      const name = incidentNameInput.value.trim();
      if (!name) return;

      incidents.push({
        id: `SCN-${String(incidents.length + 1).padStart(3, '0')}`,
        title: name,
        detail: `${name} added to the exercise area.`,
        status: 'ACTIVE',
        type: 'active',
        coords: [30.451 + (Math.random() * 0.04 - 0.02), -91.180 + (Math.random() * 0.04 - 0.02)]
      });

      incidentNameInput.value = '';
      renderIncidents();
      updateOperationsBoard();
      persistScenarioState();
      addActivity('Scenario update', `${name} was added to the active exercise.`);
      document.querySelector('#incidentCount').textContent = String(incidents.length).padStart(2, '0');
    });
  }

  if (saveUnitBtn && unitNameInput && unitStationSelect) {
    saveUnitBtn.addEventListener('click', () => {
      const value = unitNameInput.value.trim();
      if (!value) return;

      if (activeUnitEditId) {
        const target = vehicles.find((vehicle) => vehicle.id === activeUnitEditId);
        if (target) {
          target.id = value;
          target.station = unitStationSelect.value;
          target.type = target.type || 'Support';
          addActivity('Unit updated', `${target.id} moved to ${target.station}.`);
        }
      } else {
        vehicles.push({
          id: value,
          type: 'Support',
          station: unitStationSelect.value,
          position: [30.451, -91.180],
          route: [[30.451, -91.180], [30.452, -91.178], [30.454, -91.176]],
          step: 0
        });
        addActivity('Unit added', `${value} added to ${unitStationSelect.value}.`);
      }

      activeUnitEditId = null;
      unitNameInput.value = '';
      unitStationSelect.value = 'HQ Command';
      renderUnitList();
      renderVehicleMarkers();
      updateOperationsBoard();
      persistScenarioState();
    });
  }

  if (clearUnitBtn && unitNameInput && unitStationSelect) {
    clearUnitBtn.addEventListener('click', () => {
      activeUnitEditId = null;
      unitNameInput.value = '';
      unitStationSelect.value = 'HQ Command';
    });
  }

  const studentUnitSelect = document.querySelector('#studentUnitSelect');
  const studentIncidentSelect = document.querySelector('#studentIncidentSelect');
  const busSizeSelect = document.querySelector('#busSizeSelect');
  const passengerCountInput = document.querySelector('#passengerCountInput');
  const studentAssignBtn = document.querySelector('#studentAssignBtn');
  const returnUnitBtn = document.querySelector('#returnUnitBtn');

  if (studentAssignBtn && studentUnitSelect && studentIncidentSelect && busSizeSelect && passengerCountInput) {
    studentAssignBtn.addEventListener('click', () => {
      const unit = vehicles.find((item) => item.id === studentUnitSelect.value);
      const incident = incidents.find((item) => item.id === studentIncidentSelect.value);
      if (!unit || !incident) return;

      const busType = busSizeSelect.value;
      const maxCapacity = busCapacityMap[busType] || 20;
      const passengers = Math.min(Math.max(Number(passengerCountInput.value) || 0, 0), maxCapacity);
      unit.busType = busType;
      unit.passengers = passengers;
      unit.assignedIncidentId = incident.id;
      unit.status = 'Dispatched';
      unit.position = [...incident.coords];
      unit.route = [unit.position, [incident.coords[0] + 0.002, incident.coords[1]], [incident.coords[0] + 0.004, incident.coords[1]]];
      unit.step = 0;
      renderUnitList();
      renderVehicleMarkers();
      updateStudentDispatchControls();
      persistScenarioState();
      addActivity('Student dispatch', `${unit.id} sent to ${incident.title} with ${passengers} passengers on a ${busType} bus.`);
    });
  }

  if (returnUnitBtn && studentUnitSelect) {
    returnUnitBtn.addEventListener('click', () => {
      const unit = vehicles.find((item) => item.id === studentUnitSelect.value);
      if (!unit) return;

      unit.assignedIncidentId = null;
      unit.status = 'Available';
      unit.position = [30.451, -91.180];
      unit.route = [[30.451, -91.180], [30.452, -91.178], [30.454, -91.176]];
      unit.step = 0;
      unit.passengers = 0;
      renderUnitList();
      renderVehicleMarkers();
      updateStudentDispatchControls();
      persistScenarioState();
      addActivity('Unit return', `${unit.id} returned to base and is available again.`);
    });
  }

  if (studentUnitSelect) {
    studentUnitSelect.addEventListener('change', updateStudentDispatchControls);
  }

  if (busSizeSelect) {
    busSizeSelect.addEventListener('change', () => {
      const selectedUnit = vehicles.find((vehicle) => vehicle.id === studentUnitSelect?.value);
      const capacity = busCapacityMap[busSizeSelect.value] || 20;
      if (passengerCountInput) {
        passengerCountInput.max = String(capacity);
        if (Number(passengerCountInput.value) > capacity) passengerCountInput.value = String(capacity);
      }
      if (selectedUnit) {
        selectedUnit.busType = busSizeSelect.value;
      }
    });
  }

  updateStudentDispatchControls();

  if (!scenarioBtn || !modal || !cancelBtn || !applyBtn || !scenarioSelect) return;

  const openModal = () => {
    modal.hidden = false;
    scenarioSelect.value = Object.keys(scenarioPresets).find((key) => scenarioPresets[key].title === document.querySelector('#scenarioTitle')?.textContent.trim()) || 'louisiana';
  };

  const closeModal = () => {
    modal.hidden = true;
  };

  scenarioBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });

  applyBtn.addEventListener('click', () => {
    const nextPreset = scenarioPresets[scenarioSelect.value];
    if (!nextPreset) return;

    incidents = [...nextPreset.incidents];
    vehicles = [...nextPreset.vehicles];
    scenarioName = nextPreset.title;
    document.querySelector('#scenarioTitle').textContent = nextPreset.title;
    document.querySelector('#unitsConnectedLabel').textContent = String(nextPreset.unitsConnected);
    if (scenarioNameInput) scenarioNameInput.value = nextPreset.title;
    closeModal();
    renderIncidents();
    renderVehicleMarkers();
    renderUnitList();
    updateOperationsBoard();
    persistScenarioState();
    addActivity('Scenario update', `${nextPreset.title} is now active.`);
    document.querySelector('#incidentCount').textContent = String(incidents.length).padStart(2, '0');
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

map.on('mousedown', (event) => {
  if (!gridDrawMode) return;
  if (activeGridLine) return;

  const name = document.querySelector('#gridNameInput')?.value.trim() || 'Grid route';
  activeGridLine = L.polyline([event.latlng, event.latlng], {
    color: '#123d42',
    weight: 3,
    opacity: 0.9,
    dashArray: '8 8'
  }).addTo(map);
  activeGridLine.bindPopup(`<strong>${name}</strong>`, { autoPan: false });
});

map.on('mousemove', (event) => {
  if (!gridDrawMode || !activeGridLine) return;
  const points = activeGridLine.getLatLngs();
  if (!points || points.length === 0) return;
  const current = points[0];
  activeGridLine.setLatLngs([current, event.latlng]);
});

map.on('mouseup', () => {
  if (!gridDrawMode) return;
  completeGridDraw();
});

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

if (loadSavedScenarioState()) {
  scenarioName = document.querySelector('#scenarioNameInput')?.value || scenarioName;
}

if (document.querySelector('[data-grid-toggle="toggle"]')) {
  document.querySelector('[data-grid-toggle="toggle"]').dataset.gridToggle = 'toggle';
}

renderIncidents();
renderVehicleMarkers();
renderCommandPointMarkers();
renderUnitList();
initViewTabs();
initRoleSwitch();
initScenarioControls();
initCommandPoints();
initCallFeed();
initClock();
updateOperationsBoard();
persistScenarioState();
addActivity('Ops Room', 'Beacon map is live and synced.');

if (document.querySelector('#incidentCount')) {
  document.querySelector('#incidentCount').textContent = String(incidents.length).padStart(2, '0');
}

if (document.querySelector('#commandBoard')) { document.querySelector('#commandBoard').hidden = true; }
if (document.querySelector('#mapWorkspace')) { document.querySelector('#mapWorkspace').hidden = false; }

setInterval(() => {
  if (document.hidden) return;
  tickVehicleMovement();
  const syncTime = document.querySelector('#syncTime');
  if (syncTime) {
    const seconds = Number(syncTime.dataset.seconds || 12);
    const nextValue = Math.max(3, Math.min(42, seconds + 4));
    syncTime.dataset.seconds = String(nextValue);
    syncTime.textContent = `${nextValue} sec ago`;
  }
}, 3500);
