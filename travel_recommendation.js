let travelData = null;


// ========================================
// Fetch JSON data
// ========================================

async function fetchTravelData() {
  try {
    const response = await fetch("./travel_recommendation_api.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    travelData = await response.json();

    console.log("Travel data loaded:", travelData);

  } catch (error) {
    console.error("Error loading travel data:", error);
  }
}


// ========================================
// Search Recommendations
// ========================================

function searchRecommendations(keyword) {

  // Convert user input to lowercase
  const searchTerm = keyword.trim().toLowerCase();

  console.log("User searched for:", searchTerm);

  // ----------------------------------------
  // BEACH / BEACHES
  // ----------------------------------------

  if (
    searchTerm === "beach" ||
    searchTerm === "beaches"
  ) {
    return travelData.beaches;
  }


  // ----------------------------------------
  // TEMPLE / TEMPLES
  // ----------------------------------------

  if (
    searchTerm === "temple" ||
    searchTerm === "temples"
  ) {
    return travelData.temples;
  }


  // ----------------------------------------
  // COUNTRY / COUNTRIES
  // ----------------------------------------

  if (
    searchTerm === "country" ||
    searchTerm === "countries"
  ) {

    // Return all countries
    return travelData.countries;
  }


  // ----------------------------------------
  // Search by country name
  // Example: Australia, Japan, Brazil
  // ----------------------------------------

  const countryResults = travelData.countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm)
  );

  if (countryResults.length > 0) {
    return countryResults;
  }


  // ----------------------------------------
  // Search by city name
  // Example: Sydney, Tokyo, Kyoto
  // ----------------------------------------

  const cityResults = [];

  travelData.countries.forEach(country => {

    country.cities.forEach(city => {

      if (
        city.name.toLowerCase().includes(searchTerm)
      ) {
        cityResults.push(city);
      }

    });

  });


  if (cityResults.length > 0) {
    return cityResults;
  }


  // ----------------------------------------
  // No results
  // ----------------------------------------

  return [];

}


// ========================================
// Display Results
// ========================================

function displayRecommendations(results, searchTerm) {

  const resultsContainer =
    document.getElementById("recommendationResults");

  resultsContainer.innerHTML = "";


  // No results
  if (results.length === 0) {

    resultsContainer.innerHTML = `
      <div class="no-results">
        <h3>No recommendations found</h3>
        <p>
          Try searching for beaches, temples,
          countries or a destination.
        </p>
      </div>
    `;

    return;
  }


  // Display results
  results.forEach(item => {

    // Country result
    if (item.cities) {

      item.cities.forEach(city => {

        createRecommendationCard(
          city,
          resultsContainer
        );

      });

    }

    // Beach / Temple / City result
    else {

      createRecommendationCard(
        item,
        resultsContainer
      );

    }

  });

}


// ========================================
// Create Recommendation Card
// ========================================

function createRecommendationCard(item, container) {

  const card = document.createElement("div");

  card.className = "recommendation-card";

  card.innerHTML = `
    <img
      src="${item.imageUrl}"
      alt="${item.name}"
    >

    <div class="recommendation-card-content">

      <h2>${item.name}</h2>

      <p>${item.description}</p>

      <button class="visit-btn">
        Visit
      </button>

    </div>
  `;

  container.appendChild(card);
}


// ========================================
// SEARCH BUTTON
// ========================================

document
  .getElementById("searchBtn")
  .addEventListener("click", function () {

    const searchInput =
      document.getElementById("searchInput");

    const keyword = searchInput.value;

    // Don't search if input is empty
    if (!keyword.trim()) {
      return;
    }

    const results =
      searchRecommendations(keyword);

    displayRecommendations(
      results,
      keyword
    );

  });


// ========================================
// CLEAR BUTTON
// ========================================

document
  .getElementById("clearBtn")
  .addEventListener("click", function () {

    document.getElementById(
      "searchInput"
    ).value = "";

    document.getElementById(
      "recommendationResults"
    ).innerHTML = "";

  });


// ========================================
// Load JSON when page loads
// ========================================

fetchTravelData();