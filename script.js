// Data: Array of Batanes Hotel Objects
// Contains unique identifiers, names, locations, prices, and imagery placeholders
const hotelsData = [
  {
    id: 1,
    name: "Basco Grand Hotel",
    location: "Basco",
    pricePerNight: 4500,
    imagePlaceholder: "🏨",
  },
  {
    id: 2,
    name: "Mahatao Homestay",
    location: "Mahatao",
    pricePerNight: 2200,
    imagePlaceholder: "🏡",
  },
  {
    id: 3,
    name: "Fundacion Pacita",
    location: "Basco",
    pricePerNight: 12000,
    imageUrl: "images/fundacion pacita.png",
  },
  {
    id: 4,
    name: "Savatan Homestay",
    location: "Mahatao",
    pricePerNight: 1800,
    imageUrl: "images/savatan homestay.png",
  },
  {
    id: 5,
    name: "Amboy Hometel",
    location: "Basco",
    pricePerNight: 3500,
    imageUrl: "images/amboy hometel.png",
  },
];

// Global State Variable to track selected filters ("All", "Basco", "Mahatao")
let currentFilter = "All";

// DOM Elements: Cache references to optimize UI manipulations
const checkInInput = document.getElementById("checkin");
const checkOutInput = document.getElementById("checkout");
const totalNightsSummary = document.getElementById("total-nights-summary");
const dateError = document.getElementById("date-error");
const hotelGrid = document.getElementById("hotel-grid");
const filterButtons = document.querySelectorAll(".filter-btn");

// Initialization function called when the application script loads
function init() {
  // Set default state variables
  const today = new Date().toISOString().split("T")[0];
  checkInInput.min = today;
  checkOutInput.min = today;

  // Render initial hotel array
  renderHotels(hotelsData);

  // Setup UI interactive listeners
  setupEventListeners();
}

// Function to dynamically render UI hotel cards based on an array input
function renderHotels(hotels) {
  // Clear out any existing HTML within the grid container
  hotelGrid.innerHTML = "";

  // Handle case where no items match a specific filter criteria
  if (hotels.length === 0) {
    hotelGrid.innerHTML = `
            <div class="no-results">
                <p>No hotels match the selected filters.</p>
            </div>
        `;
    return;
  }

  // Iterate over array data to build HTML structure and inject into the DOM
  hotels.forEach((hotel) => {
    // Generate calculated stay-based pricing text dynamically if applicable
    const totalNights = calculateNights();
    let pricingHTML = "";

    if (totalNights > 0) {
      const totalPrice = hotel.pricePerNight * totalNights;
      pricingHTML = `
                <p class="total-price">
                    Total (${totalNights} nights): <strong>₱${totalPrice.toLocaleString()}</strong>
                </p>
            `;
    }

    const card = document.createElement("div");
    card.className = "hotel-card";
    card.innerHTML = `
            <div class="hotel-image">
                <img src="${hotel.imageUrl}" alt="${hotel.name}" class="card-img" />
            </div>
            <div class="hotel-info">
                <h3 class="hotel-name">${hotel.name}</h3>
                <p class="hotel-location">📍 ${hotel.location}</p>
                <p class="hotel-price">₱${hotel.pricePerNight.toLocaleString()} / night</p>
                ${pricingHTML}
            </div>
        `;
    hotelGrid.appendChild(card);
  });
}

// Logic: Calculate nights difference between two valid string date ranges
function calculateNights() {
  const checkInVal = checkInInput.value;
  const checkOutVal = checkOutInput.value;

  if (!checkInVal || !checkOutVal) {
    return 0;
  }

  const checkInDate = new Date(checkInVal);
  const checkOutDate = new Date(checkOutVal);

  if (checkOutDate <= checkInDate) {
    return -1; // Flag validation error indicator state
  }

  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

// UI Event Action: Handle validation checks and text display states
function handleDateChange() {
  const nights = calculateNights();

  if (nights === -1) {
    // Show validation errors
    dateError.classList.remove("hidden");
    totalNightsSummary.textContent = "Invalid date range selected.";
  } else if (nights > 0) {
    // Successfully verified valid stay configuration
    dateError.classList.add("hidden");
    totalNightsSummary.textContent = `Your stay duration is ${nights} night${nights > 1 ? "s" : ""}.`;
  } else {
    // Fallback if inputs are missing or cleared
    dateError.classList.add("hidden");
    totalNightsSummary.textContent = "Select dates to calculate your stay.";
  }

  // Re-run hotel renderer to update calculations across rendered data
  filterAndRenderHotels();
}

// Logic: Filter datasets depending on active location string criteria
function filterAndRenderHotels() {
  let filtered = hotelsData;

  if (currentFilter !== "All") {
    filtered = hotelsData.filter(
      (hotel) => hotel.location === currentFilter,
    );
  }

  renderHotels(filtered);
}

// Setup Component Listeners: Link interactivity functions to DOM actions
function setupEventListeners() {
  checkInInput.addEventListener("change", () => {
    if (checkInInput.value) {
      checkOutInput.min = checkInInput.value;
    }
    handleDateChange();
  });

  checkOutInput.addEventListener("change", handleDateChange);

  // Setup click listeners for interactive location filters
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Toggle CSS visual states across interactive sibling nodes
      filterButtons.forEach((button) => button.classList.remove("active"));
      e.target.classList.add("active");

      // Apply data mapping criteria
      currentFilter = e.target.getAttribute("data-location");
      filterAndRenderHotels();
    });
  });
}

// Execute core bootstrap function on script load
init();