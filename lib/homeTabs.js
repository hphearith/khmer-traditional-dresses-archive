// Rules for the home page's two tabs. This is the page-level switch carried
// in the address as ?tab=; it is unrelated to the garment category filter.
export const HOME_TABS = ["official", "community"];

export function parseHomeTab(value) {
  return HOME_TABS.includes(value) ? value : HOME_TABS[0];
}

// Inside the Community tab, which entries to show. Carried in the address as
// ?view= next to ?tab=community; "all" is the default and has no ?view=.
export const HOME_VIEWS = ["all", "mine"];

export function parseHomeView(value) {
  return HOME_VIEWS.includes(value) ? value : HOME_VIEWS[0];
}

// The address of a tab. Only the Community tab has views, so any other tab
// leaves the view out, and the default view needs no ?view= at all.
export function getHomeTabHref(tab, view = HOME_VIEWS[0]) {
  if (tab !== "community") return "/";
  return view === "mine" ? "/?tab=community&view=mine" : "/?tab=community";
}

export function moveHomeTab(current, key) {
  const index = HOME_TABS.indexOf(current);
  if (key === "ArrowRight") return HOME_TABS[(index + 1) % HOME_TABS.length];
  if (key === "ArrowLeft") return HOME_TABS[(index - 1 + HOME_TABS.length) % HOME_TABS.length];
  if (key === "Home") return HOME_TABS[0];
  if (key === "End") return HOME_TABS[HOME_TABS.length - 1];
  return null;
}
