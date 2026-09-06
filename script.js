// --- 1. THE DATA ---
// This is the whole "database" for now: just an array of objects.
// Swap in real numbers or fetch from an API later — the rest of the code doesn't care.
const players = [
  { name: "Lionel Messi", goals: 922, assists: 424, appearances: 1080, goalsPerGame: 0.85, ballonDor: 8 },
  { name: "Cristiano Ronaldo", goals: 976, assists: 260, appearances: 1240, goalsPerGame: 0.79, ballonDor: 5 },
  { name: "Kylian Mbappé", goals: 368, assists: 168, appearances: 470, goalsPerGame: 0.78, ballonDor: 0 },
  { name: "Erling Haaland", goals: 320, assists: 62, appearances: 370, goalsPerGame: 0.86, ballonDor: 0 },
  { name: "Neymar Jr", goals: 466, assists: 268, appearances: 810, goalsPerGame: 0.58, ballonDor: 0 },
  { name: "Mohamed Salah", goals: 264, assists: 122, appearances: 480, goalsPerGame: 0.55, ballonDor: 0 },
  { name: "Kevin De Bruyne", goals: 128, assists: 220, appearances: 620, goalsPerGame: 0.21, ballonDor: 0 },
  { name: "Robert Lewandowski", goals: 640, assists: 152, appearances: 830, goalsPerGame: 0.77, ballonDor: 0 },
];

// The stats we'll show as rows, in order.
// "key" must match a property name in the player objects above.
const statRows = [
  { key: "goals", label: "Career Goals" },
  { key: "assists", label: "Career Assists" },
  { key: "appearances", label: "Appearances" },
  { key: "goalsPerGame", label: "Goals per Game" },
  { key: "ballonDor", label: "Ballon d'Or Wins" },
];

// --- 2. GRAB THE HTML ELEMENTS WE'LL NEED ---
const selectA = document.getElementById("playerA");
const selectB = document.getElementById("playerB");
const nameA = document.getElementById("nameA");
const nameB = document.getElementById("nameB");
const statsBody = document.getElementById("statsBody");

// --- 3. FILL THE TWO DROPDOWNS WITH PLAYER NAMES ---
function populateDropdown(select) {
  players.forEach((player, index) => {
    const option = document.createElement("option");
    option.value = index;       // we store the array index, not the name
    option.textContent = player.name;
    select.appendChild(option);
  });
}

populateDropdown(selectA);
populateDropdown(selectB);

// Default: compare the first two players so the table isn't empty on load.
selectA.value = 0;
selectB.value = 1;

// --- 4. RENDER THE COMPARISON TABLE ---
function render() {
  const playerA = players[selectA.value];
  const playerB = players[selectB.value];

  nameA.textContent = playerA.name;
  nameB.textContent = playerB.name;

  // Clear old rows, then rebuild from scratch. Simple > clever for a beginner project.
  statsBody.innerHTML = "";

  statRows.forEach(stat => {
    const valueA = playerA[stat.key];
    const valueB = playerB[stat.key];

    const row = document.createElement("tr");

    const cellA = document.createElement("td");
    cellA.textContent = valueA;

    const cellLabel = document.createElement("td");
    cellLabel.textContent = stat.label;
    cellLabel.className = "stat-name";

    const cellB = document.createElement("td");
    cellB.textContent = valueB;

    // Highlight whichever side has the higher number.
    if (valueA > valueB) cellA.classList.add("winner");
    if (valueB > valueA) cellB.classList.add("winner");

    row.appendChild(cellA);
    row.appendChild(cellLabel);
    row.appendChild(cellB);
    statsBody.appendChild(row);
  });
}

// --- 5. RE-RENDER WHENEVER A DROPDOWN CHANGES ---
selectA.addEventListener("change", render);
selectB.addEventListener("change", render);

// Initial render on page load.
render();
