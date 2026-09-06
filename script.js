// --- 1. LOAD THE DATA ---
// players.json now has two kinds of entries, marked by "type":
//   "legend" -> career totals for retired/all-time greats (rough estimates)
//   "epl"    -> real 2025-26 Premier League season stats
// They don't share every stat field, so the table shows "—" for whatever
// a given player's type doesn't track.
let players = [];

// Union of every stat either data type might have. If a player object
// doesn't have that key, we just render a dash for it.
const statRows = [
  { key: "team", label: "Team" },
  { key: "position", label: "Position" },
  { key: "goals", label: "Goals" },
  { key: "assists", label: "Assists" },
  { key: "appearances", label: "Appearances / Starts" },
  { key: "goalsPerGame", label: "Goals per Game" },
  { key: "minutes", label: "Minutes Played" },
  { key: "cleanSheets", label: "Clean Sheets" },
  { key: "points", label: "Fantasy Points" },
  { key: "yellowCards", label: "Yellow Cards" },
  { key: "redCards", label: "Red Cards" },
  { key: "trophies", label: "Team Trophies" },
  { key: "internationalGoals", label: "International Goals" },
  { key: "ballonDor", label: "Ballon d'Or Wins" },
  { key: "worldCups", label: "World Cups Won" },
];

const TYPE_LABEL = {
  legend: "All-time career stats",
  epl: "2025-26 Premier League season",
};

// --- 2. GRAB THE HTML ELEMENTS WE'LL NEED ---
const inputA = document.getElementById("playerA");
const inputB = document.getElementById("playerB");
const listA = document.getElementById("playerListA");
const listB = document.getElementById("playerListB");
const nameA = document.getElementById("nameA");
const nameB = document.getElementById("nameB");
const tagA = document.getElementById("tagA");
const tagB = document.getElementById("tagB");
const statsBody = document.getElementById("statsBody");
const statsTable = document.getElementById("statsTable");
const emptyState = document.getElementById("emptyState");
const mismatchWarning = document.getElementById("mismatchWarning");

// --- 3. FETCH THE PLAYER DATA, THEN SET EVERYTHING UP ---
fetch("players.json")
  .then(response => response.json())
  .then(data => {
    players = data;
    populateDatalist(listA);
    populateDatalist(listB);
  })
  .catch(error => {
    console.error("Couldn't load player data:", error);
    emptyState.textContent = "Couldn't load player data. Check players.json exists.";
  });

function populateDatalist(datalist) {
  players.forEach(player => {
    const option = document.createElement("option");
    option.value = player.name;
    datalist.appendChild(option);
  });
}

// --- 4. FIND A PLAYER BY EXACT NAME MATCH ---
function findPlayer(name) {
  return players.find(p => p.name.toLowerCase() === name.trim().toLowerCase());
}

// --- 5. RENDER THE COMPARISON TABLE ---
function render() {
  const playerA = findPlayer(inputA.value);
  const playerB = findPlayer(inputB.value);

  if (!playerA || !playerB) {
    statsTable.classList.add("hidden");
    mismatchWarning.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  statsTable.classList.remove("hidden");
  emptyState.classList.add("hidden");

  nameA.textContent = playerA.name;
  nameB.textContent = playerB.name;
  tagA.textContent = TYPE_LABEL[playerA.type] || "";
  tagB.textContent = TYPE_LABEL[playerB.type] || "";

  // Warn when comparing across the two data types — career totals vs.
  // a single season aren't a fair fight, and the person should know that.
  mismatchWarning.classList.toggle("hidden", playerA.type === playerB.type);

  statsBody.innerHTML = "";

  statRows.forEach(stat => {
    const valueA = playerA[stat.key];
    const valueB = playerB[stat.key];

    // Skip rows where NEITHER player has this stat at all.
    if (valueA === undefined && valueB === undefined) return;

    const row = document.createElement("tr");

    const cellA = document.createElement("td");
    cellA.textContent = valueA === undefined ? "—" : valueA;

    const cellLabel = document.createElement("td");
    cellLabel.textContent = stat.label;
    cellLabel.className = "stat-name";

    const cellB = document.createElement("td");
    cellB.textContent = valueB === undefined ? "—" : valueB;

    if (typeof valueA === "number" && typeof valueB === "number") {
      if (valueA > valueB) cellA.classList.add("winner");
      if (valueB > valueA) cellB.classList.add("winner");
    }

    row.appendChild(cellA);
    row.appendChild(cellLabel);
    row.appendChild(cellB);
    statsBody.appendChild(row);
  });
}

// --- 6. RE-RENDER WHENEVER SOMEONE TYPES ---
inputA.addEventListener("input", render);
inputB.addEventListener("input", render);
