// Rules for the home page's two tabs. This is the page-level switch carried
// in the address as ?tab=; it is unrelated to the garment category filter.
export const HOME_TABS = ["official", "community"];

export function parseHomeTab(value) {
  return HOME_TABS.includes(value) ? value : HOME_TABS[0];
}

export function getHomeTabHref(tab) {
  return tab === "community" ? "/?tab=community" : "/";
}

export function moveHomeTab(current, key) {
  const index = HOME_TABS.indexOf(current);
  if (key === "ArrowRight") return HOME_TABS[(index + 1) % HOME_TABS.length];
  if (key === "ArrowLeft") return HOME_TABS[(index - 1 + HOME_TABS.length) % HOME_TABS.length];
  if (key === "Home") return HOME_TABS[0];
  if (key === "End") return HOME_TABS[HOME_TABS.length - 1];
  return null;
}
