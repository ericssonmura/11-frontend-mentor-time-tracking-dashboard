const periodPrefix = {
  daily: 'Yesterday',
  weekly: 'Last Week',
  monthly: 'Last Month'
};

function formatHours(n) {
  return n + (n === 1 ? 'hr' : 'hrs');
}

let activitiesData = [];

fetch('assets/data.json')
  .then(res => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  })
  .then(data => {
    activitiesData = data;
    initUI();
  })
  .catch(err => {
    console.error('Error loading data.json:', err);
  });


function initUI() {
  const buttons = document.querySelectorAll('.user-profile__switcher [data-period]');
  const cards = document.querySelectorAll('.activity');

  if (cards.length !== activitiesData.length) {
    console.warn('The number of cards does not match the number of entries in data.json');
  }

  function updateDashboard(period) {
    activitiesData.forEach(activity => {
      const selector = `.activity[data-title="${CSS.escape(activity.title)}"]`;
      const card = document.querySelector(selector);
      if (!card) return;

      const hoursEl = card.querySelector('.activity__summary--hours');
      const prevEl = card.querySelector('.activity__summary--previous');
      const timeframe = activity.timeframes[period];

      if (hoursEl) {
        hoursEl.classList.add('change');
        setTimeout(() => {
          hoursEl.textContent = formatHours(timeframe.current);
          hoursEl.classList.remove('change');
        }, 150);
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

  updateDashboard('weekly');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const period = btn.dataset.period;
      buttons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      buttons.forEach(b => b.classList.remove('user-profile__switch--active'));
      btn.classList.add('user-profile__switch--active');
      updateDashboard(period);
    });
  });
}