const api_array = [
  // waifu.pics — response: { url: "..." }
  /*{ url: 'https://api.waifu.pics/nsfw/waifu',   name: 'WAIFU',    type: 'pics' },
  { url: 'https://api.waifu.pics/nsfw/neko',    name: 'NEKO',     type: 'pics' },
  { url: 'https://api.waifu.pics/nsfw/blowjob', name: 'SPICY',    type: 'pics' },*/

  // waifu.im — response: { items: [{ url: "..." }] }
  { url: 'https://api.waifu.im/images?IncludedTags=raiden-shogun&IsNsfw=True',   name: 'RAIDEN',   type: 'im' },
  { url: 'https://api.waifu.im/images?IncludedTags=genshin-impact&IsNsfw=True',  name: 'GENSHIN',  type: 'im' },
  { url: 'https://api.waifu.im/images?IncludedTags=marin-kitagawa&IsNsfw=True',  name: 'MARIN',    type: 'im' },
  { url: 'https://api.waifu.im/images?IncludedTags=kamisato-ayaka&IsNsfw=True',  name: 'AYAKA',    type: 'im' },
  { url: 'https://api.waifu.im/images?IncludedTags=mori-calliope&IsNsfw=True',   name: 'CALLIOPE', type: 'im' },
  { url: 'https://api.waifu.im/images?IncludedTags=selfies&IsNsfw=True',         name: 'SELFIE',   type: 'im' },
  { url: 'https://api.waifu.im/images?IncludedTags=maid&IsNsfw=True',            name: 'MAID',     type: 'im' },
  { url: 'https://api.waifu.im/images?IncludedTags=uniform&IsNsfw=True',         name: 'UNIFORM',  type: 'im' },
  { url: 'https://api.waifu.im/images?IncludedTags=oppai&IsNsfw=All',           name: 'OPPAI',    type: 'im' },
  { url: 'https://api.waifu.im/images?IncludedTags=waifu&IsNsfw=True',           name: 'WAIFU',    type: 'im' },
  { url: 'https://api.waifu.im/images?IncludedTags=milf&IsNsfw=True',           name: 'MILF',    type: 'im' },
  { url: 'https://api.waifu.im/images?IsNsfw=True',           name: 'RANDOM',    type: 'im' },
];

let loadCount = 0;

function setStatus(text) {
  const el = document.getElementById('stat-status');
  if (el) el.textContent = text;
}

function setSource(name) {
  const el = document.getElementById('stat-source');
  const tag = document.getElementById('api-tag');
  if (el) el.textContent = name;
  if (tag) tag.textContent = name;
}

function setCount(n) {
  const el = document.getElementById('stat-count');
  if (el) el.textContent = n;
}

// Extract the image URL from whichever API format was returned
function extractImageUrl(data, type) {
  if (type === 'im') {
    return data?.items?.[0]?.url ?? null;
  }
  // waifu.pics
  return data?.url ?? null;
}

async function getISS() {
  const loader    = document.getElementById('loader');
  const container = document.getElementById('img-container');
  const footer    = document.getElementById('card-footer');
  const card      = document.getElementById('card');

  // Reset state
  container.innerHTML = '';
  if (loader) loader.style.display = 'flex';
  if (footer) footer.classList.remove('show');
  if (card)   card.classList.remove('revealed');
  setStatus('LOADING');

  // Pick a random entry
  const entry = api_array[Math.floor(Math.random() * api_array.length)];
  console.log('Fetching:', entry.url);
  setSource(entry.name);

  try {
    const response = await fetch(entry.url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = extractImageUrl(data, entry.type);

    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    const img = new Image();
    img.setAttribute('class', 'image');

    img.onload = () => {
      if (loader) loader.style.display = 'none';
      container.appendChild(img);

      requestAnimationFrame(() => img.classList.add('loaded'));

      if (footer) footer.classList.add('show');
      if (card)   card.classList.add('revealed');

      loadCount++;
      setCount(loadCount);
      setStatus('OK');
      console.log('Loaded:', imageUrl);
    };

    img.onerror = () => {
      if (loader) loader.style.display = 'none';
      setStatus('ERR');
      container.innerHTML = errorHTML('IMAGE LOAD FAILED');
    };

    img.src = imageUrl;

  } catch (err) {
    if (loader) loader.style.display = 'none';
    setStatus('ERR');
    container.innerHTML = errorHTML('FETCH ERROR: ' + err.message);
    console.error(err);
  }
}

function errorHTML(msg) {
  return `<div style="padding:40px;color:#ff4b4b;font-family:Orbitron,sans-serif;font-size:11px;letter-spacing:3px;">${msg}</div>`;
}

function reloadImage() {
  const btn = document.getElementById('refresh-btn');
  if (btn) {
    btn.classList.add('spinning');
    setTimeout(() => btn.classList.remove('spinning'), 500);
  }
  getISS();
}

// Initial load
getISS();
