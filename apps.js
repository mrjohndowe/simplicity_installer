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
  grid.innerHTML = displayed.map((app) => `<button class="app-card ${selected.has(app.id) ? 'selected' : ''}" data-id="${app.id}" type="button"><span class="app-icon" style="--accent:${app.accent}">${app.icon}</span><span class="app-meta"><strong>${app.name}</strong><small>${app.id}</small></span><span class="check" aria-hidden="true">✓</span></button>`).join('') || '<p class="no-results">No matching apps. Add new entries in <code>apps.js</code>.</p>';
}
function renderSelection() {
  const chosen = apps.filter((app) => selected.has(app.id));
  selectionList.innerHTML = chosen.length ? chosen.map((app) => `<div class="selected-item"><span class="mini-icon" style="--accent:${app.accent}">${app.icon}</span><span>${app.name}</span><button data-remove="${app.id}" aria-label="Remove ${app.name}">×</button></div>`).join('') : '<p class="empty-state">No apps selected yet.</p>';
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
