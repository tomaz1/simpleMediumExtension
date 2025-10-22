let DEFAULTS = { defaultHost: "freedium-mirror.cfd" }; // fallback oz. default

// Vedno beri sproti (da se izognemo težavam z lifecycle-om service workerja)
async function getConfig() {
  try {
    const { defaultHost } = await chrome.storage.local.get("defaultHost");
    return { defaultHost: sanitizeHost(defaultHost || DEFAULTS.defaultHost) };
  } catch {
    return { ...DEFAULTS };
  }
}

chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (!tab?.id || !tab?.url) return;
    const cfg = await getConfig();
    const newUrl = rewriteUrl(tab.url, cfg);
    if (newUrl && newUrl !== tab.url) {
      await chrome.tabs.update(tab.id, { url: newUrl }); // isti zavihek
    }
  } catch (e) {
    console.error("URL rewrite failed:", e);
  }
});

// ---- helperji ----
function sanitizeHost(h) {
  if (!h) return "";
  return h.replace(/^https?:\/\//i, "").replace(/\/+$/,"");
}

function rewriteUrl(current, { defaultHost }) {
  try {
    const u = new URL(current);
    // primer tvoje logike:
    u.hostname = defaultHost;                         // prepiši host
    u.pathname = "/" + current.replace(/^https?:\/\//, ""); // v path zapiši original
    return u.toString();
  } catch {
    return current;
  }
}


/*
chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (!tab || !tab.id || !tab.url) return;

    const newUrl = rewriteUrl(tab.url);

    // samo, če je kaj spremenjeno
    if (newUrl && newUrl !== tab.url) {
      await chrome.tabs.update(tab.id, { url: newUrl }); // navigacija v ISTEM zavihku
    }
  } catch (e) {
    console.error("URL rewrite failed:", e);
  }
});
*/

/**
 * Sem napišeš svojo logiko “obdelave” URL-ja.
 * Spodaj je primer: nastavi hl=en in odstrani UTM parametre.
 */

/*
function rewriteUrl(current) {
  try {
    const u = new URL(current);

    // 1) primer: prepiši / dodaj ?hl=en
    //u.searchParams.set("hl", "en");

    // 2) primer: pobriši tracking parametre
    //for (const key of Array.from(u.searchParams.keys())) {
    //  if (key.startsWith("utm_") || key === "fbclid" || key === "gclid") {
    //    u.searchParams.delete(key);
    //  }
    //}

    // 3) (opcijsko) od "m." na "www." ali brez predpone
    // if (u.hostname.startsWith("m.")) u.hostname = u.hostname.slice(2);
    // after https:// add nekaj and add "/" and then original url without https://
    u.hostname =  CONFIG.defaultHost;
    u.pathname = "/" + current.replace(/^https?:\/\//, "");
    
    return u.toString();
  } catch {
    return current; // če URL ni veljaven, pusti pri miru
  }
}
*/