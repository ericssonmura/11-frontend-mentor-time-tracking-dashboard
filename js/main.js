if (window.location.hostname.includes('frontendmentor')) {
  const firstVisit = sessionStorage.getItem('fm-first-visit');

  if (!firstVisit) {
    // Première visite → désactivation temporaire
    document.documentElement.classList.add('js-no-fade-in');
    sessionStorage.setItem('fm-first-visit', 'true');

    // Réactiver l'animation après un petit délai pour laisser le temps au screenshot
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.documentElement.classList.remove('js-no-fade-in');
      }, 50); // très court, juste après le load
    });
  }
}

// --- Sortable JS for the card layout ---
document.addEventListener('DOMContentLoaded', () => {
  const cardSortableElement = document.getElementById('card-sortable');

  if (cardSortableElement) {
    new Sortable(cardSortableElement, {
      handle: '.drag-handle',
      animation: 0,
      filter: '.non-draggable',
      onMove(evt) {
      
        if (evt.related.classList.contains('non-draggable')) return false;
      },
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag'
    });
  }

  const dashboardItems = document.querySelectorAll('.dashboard > *');
  dashboardItems.forEach((el, index) => {
    el.style.setProperty('--i', index * 1.5);
    el.addEventListener('animationend', () => {
      el.setAttribute('data-animated', 'true');
    });
  });
});