// === Frontend Mentor: neutraliser l'animation au premier chargement ===
if (window.location.hostname.includes('frontendmentor')) {
  const firstVisit = sessionStorage.getItem('fm-first-visit');

  if (!firstVisit) {
    // Première visite → désactivation temporaire des animations
    document.documentElement.classList.add('no-fade-in');
    sessionStorage.setItem('fm-first-visit', 'true');

    // Réactivation après un délai (pour laisser le temps au screenshot)
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.documentElement.classList.remove('no-fade-in');
        document.documentElement.classList.add('fade-reveal');
        setTimeout(() => {
          document.documentElement.classList.remove('fade-reveal');
        }, 600); // transition de 0.6s
      }, 3500); // délai avant réactivation
    });
  }
}

// --- Sortable JS for the card layout ---
document.addEventListener('DOMContentLoaded', () => {
  const cardSortableElement = document.getElementById('card-sortable');

    new Sortable(cardSortableElement, {
      handle: '.drag-handle',       // seules les poignées déclenchent le drag
      filter: '.non-draggable',     // empêche certains éléments d’être draggables
      animation: 150,               // animation fluide lors du drag
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',

      onMove(evt) {
        // Empêche de passer par-dessus les éléments non-draggables (ex: header)
        if (evt.related && evt.related.closest('.non-draggable')) {
          return false;
        }
        return true;
      }
    });

    const dashboardItems = document.querySelectorAll('.dashboard > *');
    dashboardItems.forEach((el, index) => {
      el.style.setProperty('--i', index * 1.5);
      el.addEventListener('animationend', () => {
        el.setAttribute('data-animated', 'true');
      });
    });
  });