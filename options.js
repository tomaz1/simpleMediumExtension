function sanitizeHost(h) {
  return (h || "").trim().replace(/^https?:\/\//i,"").replace(/\/+$/,"");
}

async function load() {
  const { defaultHost } = await chrome.storage.local.get("defaultHost");
  document.getElementById('host').value = defaultHost || "google.com";
}

async function save() {
  const cleaned = sanitizeHost(document.getElementById('host').value);
  await chrome.storage.local.set({ defaultHost: cleaned });
  const s = document.getElementById('status');
  s.textContent = '✔ shranjeno';
  s.className = 'ok';
  setTimeout(() => { s.textContent = ''; s.className=''; }, 1200);
}

// Brez inline onload/onClick — vse prek addEventListener
document.addEventListener('DOMContentLoaded', () => {
  load();
  document.getElementById('save').addEventListener('click', save);
});
