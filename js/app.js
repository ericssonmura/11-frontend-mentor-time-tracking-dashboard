// === Step 0: utilities ===
const periodPrefix = {
  daily: 'Yesterday',
  weekly: 'Last Week',
  monthly: 'Last Month'
};

function formatHours(n) {
  return n + (n === 1 ? 'hr' : 'hrs');
}

// === Step 1: fetch data.json ===
let activitiesData = [];

fetch('./assets/data.json')
  .then(res => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  })
  .then(data => {
    activitiesData = data;
    initUI();
  })
  .catch(err => {
    console.error('Erreur chargement data.json:', err);
  });

// === Step 2: UI initialization ===
function initUI() {
  const dashboard = document.querySelector('.dashboard');
  const buttons = document.querySelectorAll('.user-profile__switcher [data-period]');
  const cards = document.querySelectorAll('.activity');

  if (!dashboard) return;

  // === (1) Frontend Mentor Mode Management
  const isFEM = window.location.hostname.includes('frontendmentor');

  if (isFEM) {
    dashboard.classList.add('js-no-animation');
    console.log('Frontend Mentor mode: animations et drag désactivés.');
  }

  // === (2) Update function
  function updateDashboard(period) {
    activitiesData.forEach(activity => {
      const selector = `.activity[data-title="${CSS.escape(activity.title)}"]`;
      const card = document.querySelector(selector);
      if (!card) return;

      const hoursEl = card.querySelector('.activity__summary--hours');
      const prevEl = card.querySelector('.activity__summary--previous');
      const timeframe = activity.timeframes[period];

      if (!timeframe) return;

      // Gentle animation on numbers (CSS already prepared)
      [hoursEl, prevEl].forEach(el => {
        el.classList.add('change');
        setTimeout(() => {
          if (el === hoursEl) {
            el.textContent = formatHours(timeframe.current);
          } else {
            el.textContent = `${periodPrefix[period]} - ${formatHours(timeframe.previous)}`;
          }
          el.classList.remove('change');
        }, 150);
      });
    });
  }

  // === (3) Initial state ===
  updateDashboard('weekly');
  buttons.forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.period === 'weekly' ? 'true' : 'false');
    btn.classList.toggle('user-profile__switch--active', btn.dataset.period === 'weekly');
  });

  // === (4) Listeners buttons ===
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const period = btn.dataset.period;
      buttons.forEach(b => {
        b.setAttribute('aria-pressed', 'false');
        b.classList.remove('user-profile__switch--active');
      });
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('user-profile__switch--active');
      updateDashboard(period);
    });
  });

  // === (5) Drag & Drop with Sortable.js (disabled on FEM) ===
  if (!isFEM && typeof Sortable !== 'undefined') {
    Sortable.create(dashboard, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag'
    });
  } else if (!isFEM) {
    console.warn('⚠️ Sortable.js not found — Check the script link');
  }
}