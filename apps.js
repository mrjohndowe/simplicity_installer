const apps = [
  { id: 'Google.Chrome', name: 'Google Chrome', category: 'Browsers', accent: '#ea4335', icon: 'C' },
  { id: 'Mozilla.Firefox', name: 'Firefox', category: 'Browsers', accent: '#ff7139', icon: 'F' },
  { id: 'Brave.Brave', name: 'Brave', category: 'Browsers', accent: '#fb542b', icon: 'B' },
  { id: 'VideoLAN.VLC', name: 'VLC media player', category: 'Media', accent: '#ff8a00', icon: '▶' },
  { id: 'Audacity.Audacity', name: 'Audacity', category: 'Media', accent: '#486a9c', icon: 'A' },
  { id: 'Spotify.Spotify', name: 'Spotify', category: 'Media', accent: '#1db954', icon: '●' },
  { id: 'Discord.Discord', name: 'Discord', category: 'Communication', accent: '#5865f2', icon: '☻' },
  { id: 'Zoom.Zoom', name: 'Zoom Workplace', category: 'Communication', accent: '#2d8cff', icon: 'Z' },
  { id: 'SlackTechnologies.Slack', name: 'Slack', category: 'Communication', accent: '#4a154b', icon: 'S' },
  { id: '7zip.7zip', name: '7-Zip', category: 'Utilities', accent: '#608d35', icon: '7z' },
  { id: 'voidtools.Everything', name: 'Everything', category: 'Utilities', accent: '#7a4a92', icon: 'E' },
  { id: 'ShareX.ShareX', name: 'ShareX', category: 'Utilities', accent: '#2d88d8', icon: '⇧' },
  { id: 'Notepad++.Notepad++', name: 'Notepad++', category: 'Developer', accent: '#7dbb00', icon: 'N+' },
  { id: 'Microsoft.VisualStudioCode', name: 'VS Code', category: 'Developer', accent: '#007acc', icon: '⌘' },
  { id: 'Git.Git', name: 'Git', category: 'Developer', accent: '#f05133', icon: 'G' },
  { id: 'Python.Python.3.13', name: 'Python 3.13', category: 'Developer', accent: '#3776ab', icon: 'Py' },
  { id: 'GIMP.GIMP', name: 'GIMP', category: 'Creative', accent: '#645b54', icon: 'G' },
  { id: 'Inkscape.Inkscape', name: 'Inkscape', category: 'Creative', accent: '#111', icon: '◒' },
  { id: 'BlenderFoundation.Blender', name: 'Blender', category: 'Creative', accent: '#ea7600', icon: '◉' },
  { id: 'LibreOffice.LibreOffice', name: 'LibreOffice', category: 'Office', accent: '#18a303', icon: 'LO' },
  { id: 'SumatraPDF.SumatraPDF', name: 'SumatraPDF', category: 'Office', accent: '#cf4a36', icon: 'Σ' }
];

// Device utilities comparable to the HORI Device Manager utility shown in the
// reference. Only packages available from winget can be selected for builds.
apps.push(
  { id: 'HORI.DeviceManager.Vol2', name: 'HORI Device Manager VOL.2', category: 'Device & RGB', accent: '#ed1c24', icon: 'H', note: 'Version 1.0.28.13 — interactive administrator install' },
  { id: 'Logitech.GHUB', name: 'Logitech G HUB', category: 'Device & RGB', accent: '#00b8fc', icon: 'LG' },
  { id: 'Corsair.iCUE.5', name: 'Corsair iCUE', category: 'Device & RGB', accent: '#f6b700', icon: 'C' },
  { id: 'SteelSeries.GG', name: 'SteelSeries GG', category: 'Device & RGB', accent: '#f04f23', icon: 'GG' },
  { id: 'WhirlwindFX.SignalRgb', name: 'SignalRGB', category: 'Device & RGB', accent: '#7556ff', icon: 'SR' },
  { id: 'OpenRGB.OpenRGB', name: 'OpenRGB', category: 'Device & RGB', accent: '#00aa88', icon: 'OR' },
  { id: 'Elgato.StreamDeck', name: 'Elgato Stream Deck', category: 'Device & RGB', accent: '#111111', icon: 'ED' }
);

const appLogos = {
  'Google.Chrome': 'google-chrome.svg',
  'Mozilla.Firefox': 'firefox.svg',
  'Brave.Brave': 'brave.svg',
  'VideoLAN.VLC': 'vlc-media-player.svg',
  'Audacity.Audacity': 'audacity.svg',
  'Spotify.Spotify': 'spotify.svg',
  'Discord.Discord': 'discord.svg',
  'Zoom.Zoom': 'zoom-workplace.svg',
  'SlackTechnologies.Slack': 'slack.svg',
  '7zip.7zip': '7-zip.svg',
  'voidtools.Everything': 'everything.svg',
  'ShareX.ShareX': 'sharex.svg',
  'Notepad++.Notepad++': 'notepad-plus-plus.svg',
  'Microsoft.VisualStudioCode': 'vs-code.svg',
  'Git.Git': 'git.svg',
  'Python.Python.3.13': 'python.svg',
  'GIMP.GIMP': 'gimp.svg',
  'Inkscape.Inkscape': 'inkscape.svg',
  'BlenderFoundation.Blender': 'blender.svg',
  'LibreOffice.LibreOffice': 'libreoffice.svg',
  'SumatraPDF.SumatraPDF': 'sumatrapdf.svg',
  'Corsair.iCUE.5': 'corsair-icue.svg',
  'SteelSeries.GG': 'steelseries-gg.svg',
  'WhirlwindFX.SignalRgb': 'signalrgb.ico',
  'Elgato.StreamDeck': 'elgato-stream-deck.svg'
};

function appIcon(app) {
  const logo = appLogos[app.id];
  if (!logo) return `<span class="app-icon" style="--accent:${app.accent}">${app.icon}</span>`;
  return `<span class="app-icon app-icon-image" style="--accent:${app.accent}"><img class="app-logo" src="logos/${logo}" alt="" onerror="this.remove();" /><span class="icon-fallback">${app.icon}</span></span>`;
}

const selected = new Set();
let category = 'All';
const categories = ['All', ...new Set(apps.map((app) => app.category))];
const grid = document.querySelector('#app-grid');
const categoryTabs = document.querySelector('#categories');
const selectionList = document.querySelector('#selection-list');
const count = document.querySelector('#selection-count');
const prepareButton = document.querySelector('#prepare');
const dialog = document.querySelector('#build-dialog');

// On GitHub Pages, convert owner.github.io/repository into the matching
// repository Actions URL. Locally, this remains a useful link to the YAML file.
if (location.hostname.endsWith('.github.io')) {
  const owner = location.hostname.split('.')[0];
  const repository = location.pathname.split('/').filter(Boolean)[0];
  if (repository) document.querySelector('#workflow-link').href = `https://github.com/${owner}/${repository}/actions/workflows/build-installer.yml`;
}

function renderCategories() {
  categoryTabs.innerHTML = categories.map((item) => `<button class="category-tab ${item === category ? 'active' : ''}" data-category="${item}">${item}</button>`).join('');
}
function renderApps() {
  const term = document.querySelector('#search').value.trim().toLowerCase();
  const displayed = apps.filter((app) => (category === 'All' || app.category === category) && `${app.name} ${app.id}`.toLowerCase().includes(term));
  grid.innerHTML = displayed.map((app) => `<button class="app-card ${selected.has(app.id) ? 'selected' : ''} ${app.unavailable ? 'unavailable' : ''}" data-id="${app.id}" type="button" ${app.unavailable ? 'disabled title="This program is not currently available through winget"' : ''}>${appIcon(app)}<span class="app-meta"><strong>${app.name}</strong><small>${app.note || app.id}</small></span><span class="check" aria-hidden="true">✓</span></button>`).join('') || '<p class="no-results">No matching apps. Add new entries in <code>apps.js</code>.</p>';
}
function renderSelection() {
  const chosen = apps.filter((app) => selected.has(app.id));
  selectionList.innerHTML = chosen.length ? chosen.map((app) => `<div class="selected-item">${appIcon(app)}<span>${app.name}</span><button data-remove="${app.id}" aria-label="Remove ${app.name}">×</button></div>`).join('') : '<p class="empty-state">No apps selected yet.</p>';
  count.textContent = chosen.length;
  prepareButton.disabled = !chosen.length;
}
function render() { renderCategories(); renderApps(); renderSelection(); }

categoryTabs.addEventListener('click', (event) => { if (event.target.dataset.category) { category = event.target.dataset.category; render(); } });
grid.addEventListener('click', (event) => { const card = event.target.closest('[data-id]'); if (!card) return; selected.has(card.dataset.id) ? selected.delete(card.dataset.id) : selected.add(card.dataset.id); render(); });
selectionList.addEventListener('click', (event) => { if (event.target.dataset.remove) { selected.delete(event.target.dataset.remove); render(); } });
document.querySelector('#search').addEventListener('input', renderApps);
document.querySelector('#clear').addEventListener('click', () => { selected.clear(); render(); });
prepareButton.addEventListener('click', () => { document.querySelector('#package-output').value = apps.filter((app) => selected.has(app.id)).map((app) => app.id).join(','); dialog.showModal(); });
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#copy').addEventListener('click', async () => { await navigator.clipboard.writeText(document.querySelector('#package-output').value); document.querySelector('#copy').textContent = 'Copied!'; setTimeout(() => { document.querySelector('#copy').textContent = 'Copy package IDs'; }, 1600); });
render();
