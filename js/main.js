const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('noanim') === '1') {
  document.documentElement.classList.add('js-no-fade-in');
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