const getToken = () => localStorage.getItem("token");

async function api(path, method = "GET", body) {
  const res = await fetch("/api" + path, {
    method,
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + getToken() },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) { localStorage.clear(); location.href = "login.html"; }
  if (!res.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

// Redirect away if not logged in as the expected role (convenience only; server enforces the real check)
function guard(role) {
  if (!getToken() || localStorage.getItem("role") !== role) location.href = "login.html";
}

function logout() { localStorage.clear(); location.href = "login.html"; }

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const fmt = d => new Date(d).toLocaleString();
const badge = s => `<span class="badge ${esc(s).replace(/ /g, "")}">${esc(s)}</span>`;
