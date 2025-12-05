const tableBody = document.querySelector("#device-table tbody");
const lastUpdated = document.getElementById("last-updated");
const detailsView = document.getElementById("device-details");
const detailsContent = document.getElementById("details-content");
const backButton = document.getElementById("back-button");

async function fetchDevices() {
  try {
    const res = await fetch("/devices");
    const devices = await res.json();
    renderDeviceList(devices);
    lastUpdated.textContent = "Last updated: " + new Date().toLocaleTimeString();
  } catch (err) {
    console.error("Error fetching devices:", err);
  }
}

function renderDeviceList(devices) {
  tableBody.innerHTML = "";
  detailsView.classList.add("hidden");

  devices.forEach((device) => {
    const row = document.createElement("tr");
    row.className = device.active ? "active" : "inactive";
    const nameCell = document.createElement("td");
    nameCell.textContent = device.name || "Unknown";

    const ipCell = document.createElement("td");
    ipCell.textContent = device.ip || "N/A";

    const statusCell = document.createElement("td");
    statusCell.textContent = device.active ? "🟢 Active" : "⚪ Inactive";

    const lastSeenCell = document.createElement("td");
    lastSeenCell.textContent = new Date(device.lastSeen).toLocaleString();

    row.appendChild(nameCell);
    row.appendChild(ipCell);
    row.appendChild(statusCell);
    row.appendChild(lastSeenCell);

    row.addEventListener("click", () => showDeviceDetails(device.id));
    tableBody.appendChild(row);
  });
}

async function showDeviceDetails(id) {
  try {
    const res = await fetch("/devices/" + id);
    if (!res.ok) throw new Error("Device not found");
    const device = await res.json();

    detailsView.classList.remove("hidden");
    detailsContent.textContent = JSON.stringify(device, null, 2);
  } catch (err) {
    detailsContent.textContent = "Error loading device details.";
  }
}

backButton.addEventListener("click", () => {
  detailsView.classList.add("hidden");
});

fetchDevices();
setInterval(fetchDevices, 10000);
