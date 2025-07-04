const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

export async function fetchTotalPages() {
  const res = await fetch(`${API_BASE}/users-statement/total-pages`);
  if (!res.ok) throw new Error("Failed to fetch total pages");
  const data = await res.json();
  return data.count;
}

export async function incrementTotalPages(count: number = 1) {
  const res = await fetch(`${API_BASE}/users-statement/total-pages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ totalPages: count }),
  });
  if (!res.ok) throw new Error("Failed to increment total pages");
  const data = await res.json();
  return data.count;
}

export async function fetchDailyPages() {
  const res = await fetch(`${API_BASE}/users-statement/daily-pages`);
  if (!res.ok) throw new Error("Failed to fetch daily pages");
  const data = await res.json();
  return data.count;
}

export async function incrementDailyPages(count: number = 1) {
  const res = await fetch(`${API_BASE}/users-statement/daily-pages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dailyPages: count }),
  });
  if (!res.ok) throw new Error("Failed to increment daily pages");
  const data = await res.json();
  return data.count;
}
