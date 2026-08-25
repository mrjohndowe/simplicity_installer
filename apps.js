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

const appLogos = {
  'Google.Chrome': 'google-chrome.svg', 'Mozilla.Firefox': 'firefox.svg', 'Brave.Brave': 'brave.svg',
  'VideoLAN.VLC': 'vlc-media-player.svg', 'Audacity.Audacity': 'audacity.svg', 'Spotify.Spotify': 'spotify.svg',
  'Discord.Discord': 'discord.svg', 'Zoom.Zoom': 'zoom-workplace.svg', 'SlackTechnologies.Slack': 'slack.svg',
  '7zip.7zip': '7-zip.svg', 'voidtools.Everything': 'everything.svg', 'ShareX.ShareX': 'sharex.svg',
  'Notepad++.Notepad++': 'notepad-plus-plus.svg', 'Microsoft.VisualStudioCode': 'vs-code.svg', 'Git.Git': 'git.svg',
  'Python.Python.3.13': 'python.svg', 'GIMP.GIMP': 'gimp.svg', 'Inkscape.Inkscape': 'inkscape.svg',
  'BlenderFoundation.Blender': 'blender.svg', 'LibreOffice.LibreOffice': 'libreoffice.svg', 'SumatraPDF.SumatraPDF': 'sumatrapdf.svg'
};

const storageKey = 'stacklift-custom-apps';
const readCustomApps = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(stored) ? stored.filter((app) => app && typeof app.id === 'string' && typeof app.name === 'string') : [];
  } catch { return []; }
};
const customApps = readCustomApps();
const allApps = () => [...apps, ...customApps];
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
const saveCustomApps = () => localStorage.setItem(storageKey, JSON.stringify(customApps));
const selected = new Set();
let category = 'All';
const grid = document.querySelector('#app-grid');
const categoryTabs = document.querySelector('#categories');
const selectionList = document.querySelector('#selection-list');
const count = document.querySelector('#selection-count');
const prepareButton = document.querySelector('#prepare');
const dialog = document.querySelector('#build-dialog');
const addAppDialog = document.querySelector('#add-app-dialog');

// On GitHub Pages, convert owner.github.io/repository into the matching
// repository Actions URL. Locally, this remains a useful link to the YAML file.
if (location.hostname.endsWith('.github.io')) {
  const owner = location.hostname.split('.')[0];
  const repository = location.pathname.split('/').filter(Boolean)[0];
  if (repository) document.querySelector('#workflow-link').href = `https://github.com/${owner}/${repository}/actions/workflows/build-installer.yml`;
}

function renderCategories() {
  const categories = ['All', ...new Set(allApps().map((app) => app.category))];
  categoryTabs.innerHTML = categories.map((item) => `<button class="category-tab ${item === category ? 'active' : ''}" data-category="${item}">${item}</button>`).join('');
}
function renderApps() {
  const term = document.querySelector('#search').value.trim().toLowerCase();
  const displayed = allApps().filter((app) => (category === 'All' || app.category === category) && `${app.name} ${app.id}`.toLowerCase().includes(term));
  grid.innerHTML = displayed.map((app) => `<button class="app-card ${selected.has(app.id) ? 'selected' : ''}" data-id="${escapeHtml(app.id)}" type="button">${appLogos[app.id] ? `<span class="app-icon"><img class="app-logo" src="logos/${appLogos[app.id]}" alt="" /></span>` : `<span class="app-icon" style="--accent:${escapeHtml(app.accent)}">${escapeHtml(app.icon)}</span>`}<span class="app-meta"><strong>${escapeHtml(app.name)}</strong><small>${escapeHtml(app.id)}</small></span><span class="check" aria-hidden="true">✓</span></button>`).join('') || '<p class="no-results">No matching apps. Use “Add it” below to create one in this browser.</p>';
}
function renderSelection() {
  const chosen = allApps().filter((app) => selected.has(app.id));
  selectionList.innerHTML = chosen.length ? chosen.map((app) => `<div class="selected-item">${appLogos[app.id] ? `<span class="mini-icon"><img class="app-logo" src="logos/${appLogos[app.id]}" alt="" /></span>` : `<span class="mini-icon" style="--accent:${escapeHtml(app.accent)}">${escapeHtml(app.icon)}</span>`}<span>${escapeHtml(app.name)}</span><button data-remove="${escapeHtml(app.id)}" aria-label="Remove ${escapeHtml(app.name)}">×</button></div>`).join('') : '<p class="empty-state">No apps selected yet.</p>';
  count.textContent = chosen.length;
  prepareButton.disabled = !chosen.length;
}
function render() { renderCategories(); renderApps(); renderSelection(); }

categoryTabs.addEventListener('click', (event) => { if (event.target.dataset.category) { category = event.target.dataset.category; render(); } });
grid.addEventListener('click', (event) => { const card = event.target.closest('[data-id]'); if (!card) return; selected.has(card.dataset.id) ? selected.delete(card.dataset.id) : selected.add(card.dataset.id); render(); });
selectionList.addEventListener('click', (event) => { if (event.target.dataset.remove) { selected.delete(event.target.dataset.remove); render(); } });
document.querySelector('#search').addEventListener('input', renderApps);
document.querySelector('#clear').addEventListener('click', () => { selected.clear(); render(); });
prepareButton.addEventListener('click', () => { document.querySelector('#package-output').value = allApps().filter((app) => selected.has(app.id)).map((app) => app.id).join(','); dialog.showModal(); });
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#copy').addEventListener('click', async () => { await navigator.clipboard.writeText(document.querySelector('#package-output').value); document.querySelector('#copy').textContent = 'Copied!'; setTimeout(() => { document.querySelector('#copy').textContent = 'Copy package IDs'; }, 1600); });
document.querySelector('#add-app').addEventListener('click', () => { document.querySelector('#add-app-form').reset(); document.querySelector('#custom-error').textContent = ''; addAppDialog.showModal(); });
document.querySelector('#close-add-app').addEventListener('click', () => addAppDialog.close());
document.querySelector('#add-app-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#custom-name').value.trim();
  const id = document.querySelector('#custom-id').value.trim();
  const categoryName = document.querySelector('#custom-category').value.trim() || 'Custom';
  const error = document.querySelector('#custom-error');
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(id)) { error.textContent = 'Enter a valid winget package ID (letters, numbers, dots, dashes, and underscores only).'; return; }
  if (allApps().some((app) => app.id.toLowerCase() === id.toLowerCase())) { error.textContent = 'That package ID is already in your catalog.'; return; }
  customApps.push({ id, name, category: categoryName, accent: '#526b6a', icon: name.slice(0, 2).toUpperCase() });
  saveCustomApps();
  selected.add(id);
  category = 'All';
  addAppDialog.close();
  render();
});
render();
