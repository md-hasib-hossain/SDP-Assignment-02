// State Management
let selectedDrinksCount = 0;

// Question 1: Default 10 drinks loaded on site initial visit
const loadDefaultDrinks = async () => {
  const container = document.getElementById('drink-container');
  document.getElementById('collection-title').innerText = "Default Drinks (Top 10)";

  try {
    const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=a');
    const data = await res.json();

    // Slice first 10 drinks (Question 1)
    const drinks = data.drinks ? data.drinks.slice(0, 10) : [];
    displayDrinks(drinks);
  } catch (error) {
    console.error('Error loading default drinks:', error);
    showNotFound('Unable to connect to the server.');
  }
};

// Question 2: Search Bar & Search Button Functionality
const handleSearch = async () => {
  const searchInput = document.getElementById('search-input').value.trim();

  if (searchInput === '') {
    loadDefaultDrinks();
    return;
  }

  try {
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`);
    const data = await res.json();

    document.getElementById('collection-title').innerText = `Search Results for "${searchInput}"`;

    // Question 2: Show "Not Found" if search result does not match
    if (!data.drinks) {
      showNotFound(`No drinks found matching "${searchInput}". Please try another search!`);
    } else {
      displayDrinks(data.drinks);
    }
  } catch (error) {
    console.error('Error fetching search result:', error);
    showNotFound('An error occurred during search.');
  }
};

// Question 2: Show Not Found Element
const showNotFound = (message) => {
  const container = document.getElementById('drink-container');
  container.innerHTML = `
    <div class="not-found-box">
      <i class="fa-solid fa-face-frown"></i>
      <h3>Not Found</h3>
      <p>${message}</p>
    </div>
  `;
};


// Question 3: Render Drink Cards (Name + Category + 15 Letter Instruction + Buttons)
const displayDrinks = (drinks) => {
  const container = document.getElementById('drink-container');
  container.innerHTML = '';

  drinks.forEach((drink) => {
    // Instructions max 15 Letters Requirement (Question 3)
    const rawInstruction = drink.strInstructions || 'No instructions provided';
    const shortInstruction = rawInstruction.slice(0, 15) + (rawInstruction.length > 15 ? '...' : '');

    const card = document.createElement('div');
    card.classList.add('drink-card');

    card.innerHTML = `
      <div class="img-container">
        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" loading="lazy">
      </div>
      <h3 class="card-title" title="${drink.strDrink}">${drink.strDrink}</h3>
      <span class="card-category">${drink.strCategory || 'Ordinary Drink'}</span>
      <p class="card-instructions"><strong>Inst:</strong> ${shortInstruction}</p>

      <div class="card-actions">
        <button class="btn-add" onclick="addToGroup('${drink.strDrink.replace(/'/g, "\\'")}')">Add to group</button>
        <button class="btn-details" onclick="showDetails('${drink.idDrink}')">Details</button>
      </div>
    `;

    container.appendChild(card);
  });
};


// Question 5 & Question 6: Add to Group & Max 7 Items Alert
const addToGroup = (drinkName) => {
  // Question 6: Cannot add more than 7 drinks
  if (selectedDrinksCount >= 7) {
    alert('Warning: You cannot add more than 7 drinks to a group!');
    return;
  }

  selectedDrinksCount++;
  document.getElementById('group-count').innerText = selectedDrinksCount;

  const groupList = document.getElementById('group-list');

  // Clear "empty" message on first insert
  if (selectedDrinksCount === 1) {
    groupList.innerHTML = '';
  }

  const li = document.createElement('li');
  li.classList.add('group-item');
  li.innerHTML = `<i class="fa-solid fa-glass-water"></i> <span>${selectedDrinksCount}. ${drinkName}</span>`;

  groupList.appendChild(li);
};

// Question 7: Details Modal with at least 5 information points
const showDetails = async (drinkId) => {
  try {
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`);
    const data = await res.json();
    const drink = data.drinks[0];

    const modalBody = document.getElementById('modal-content-body');

    // Rendering at least 5 attributes about the drink (Question 7)
    modalBody.innerHTML = `
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="modal-img">
      <h2>${drink.strDrink}</h2>
      <div class="modal-info-list">
        <div class="modal-info-item"><strong>1. Category:</strong> ${drink.strCategory || 'N/A'}</div>
        <div class="modal-info-item"><strong>2. Alcohol Type:</strong> ${drink.strAlcoholic || 'N/A'}</div>
        <div class="modal-info-item"><strong>3. Glass Type:</strong> ${drink.strGlass || 'N/A'}</div>
        <div class="modal-info-item"><strong>4. Primary Ingredient:</strong> ${drink.strIngredient1 || 'N/A'}</div>
        <div class="modal-info-item"><strong>5. Full Instructions:</strong> ${drink.strInstructions || 'N/A'}</div>
      </div>
    `;

    document.getElementById('details-modal').style.display = 'flex';
  } catch (error) {
    console.error('Error fetching details:', error);
  }
};

// Modal Close Handlers
const closeModal = () => {
  document.getElementById('details-modal').style.display = 'none';
};

// Allow Enter Key to trigger search
document.getElementById('search-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSearch();
});

// App Initialization
document.addEventListener('DOMContentLoaded', loadDefaultDrinks);