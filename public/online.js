// Reports this visit to the guest counter and fills in the "who's online" box, if the page has one.
(() => {
  const api = new URL(document.currentScript.dataset.api, location.href);
  const box = document.getElementById("online-count");
  let id = localStorage.getItem("online-id");
  if (!id) localStorage.setItem("online-id", (id = crypto.randomUUID()));
  api.searchParams.set("id", id);

  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  let timer;

  async function ping() {
    clearTimeout(timer);
    try {
      const { guests } = await (await fetch(api, { method: "POST" })).json();
      if (box) box.textContent = `${plural(1 + guests, "user")} online: 1 member and ${plural(guests, "guest")}`;
    } catch {}
    if (document.visibilityState === "visible") timer = setTimeout(ping, 60_000);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") ping();
    else clearTimeout(timer);
  });
  addEventListener("pagehide", () => {
    const leave = new URL(api);
    leave.searchParams.set("leave", "1");
    navigator.sendBeacon(leave);
  });
  addEventListener("pageshow", (e) => { if (e.persisted) ping(); });
  ping();
})();
