const doors = document.querySelector('#libraryDoors');

function updateDoors() {
  const openingDistance = window.innerHeight * 0.58;
  const progress = Math.min(window.scrollY / openingDistance, 1);
  doors.style.setProperty('--open', progress.toFixed(3));
  doors.classList.toggle('is-open', progress >= 1);
}

window.addEventListener('scroll', updateDoors, { passive: true });
window.addEventListener('resize', updateDoors);
updateDoors();
