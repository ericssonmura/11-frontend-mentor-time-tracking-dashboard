// === Step 0: utilit. ===
const periodPrefix = {
  daily: 'Yesterday',
  weekly: 'Last Week',
  monthly: 'Last Month'
};

function formatHours(n) {
  // Returns "0hrs", "1hr" or "5hrs"
  return n + (n === 1 ? 'hr' : 'hrs');
}

// === Step 1: fetch data.json ===
let activitiesData = []; // (global)

fetch('assets/data.json')
  .then(res => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  })
  .then(data => {
    activitiesData = data;
    initUI(); // Initialization of listeners and initial display
  })
  .catch(err => {
    console.error('Erreur chargement data.json:', err);
  });

// === Step 2: Select UI elements & update function ===
function initUI() {
  const buttons = document.querySelectorAll('.user-profile__switcher [data-period]');
  const cards = document.querySelectorAll('.activity'); // Expected order = same order as data.json

  // Safety: if counts mismatch, warn
  if (cards.length !== activitiesData.length) {
    console.warn('Le nombre de cartes ne correspond pas au nombre d\'entrées dans data.json');
  }

  // Update function (index-based)
  function updateDashboard(period) {
    activitiesData.forEach(activity => {
      // Find the card that has a data-title equal to the JSON title.
      const selector = `.activity[data-title="${CSS.escape(activity.title)}"]`;
      const card = document.querySelector(selector);
      if (!card) return;

      const hoursEl = card.querySelector('.activity__summary--hours');
      const prevEl = card.querySelector('.activity__summary--previous');
      const timeframe = activity.timeframes[period];

      if (hoursEl) {
        // Trigger transition
        hoursEl.classList.add('change');
        setTimeout(() => {
          hoursEl.textContent = formatHours(timeframe.current);
          hoursEl.classList.remove('change');
        }, 150); // Half of the transition duration for a smooth effect
      }

      if (prevEl) {
        prevEl.classList.add('change');
        setTimeout(() => {
          prevEl.textContent = `${periodPrefix[period]} - ${formatHours(timeframe.previous)}`;
          prevEl.classList.remove('change');
        }, 150);
      }
    });
  }

  // Initial state (default = weekly)
  updateDashboard('weekly');

  // Wire buttons
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const period = btn.dataset.period;
      buttons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      // Update active class
      buttons.forEach(b => b.classList.remove('user-profile__switch--active'));
      btn.classList.add('user-profile__switch--active');
      // Update UI
      updateDashboard(period);
    });
  });
}