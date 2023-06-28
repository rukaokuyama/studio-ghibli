// Fetch film data from the Ghibli Film API
fetch('https://ghibliapi.vercel.app/films')
  .then(response => response.json())
  .then(data => {
    // Store film data in-memory
    const films = data;

    // Generate film thumbnails and display them on the page
    const filmographyContainer = document.getElementById('filmography');

    films.forEach(film => {
      const filmThumbnail = createFilmThumbnail(film);
      filmographyContainer.appendChild(filmThumbnail);
    });
  })
  .catch(error => {
    console.log('Error fetching film data:', error);
  });

// Create a film thumbnail element
function createFilmThumbnail(film) {
  const thumbnailContainer = document.createElement('div');
  thumbnailContainer.classList.add('film-thumbnail');

  const thumbnailImage = document.createElement('img');
  thumbnailImage.src = film.image;
  thumbnailImage.alt = film.title;

  const filmInfo = document.createElement('div');
  filmInfo.classList.add('film-info');

  const filmTitle = document.createElement('h3');
  filmTitle.classList.add('film-title');
  filmTitle.textContent = film.title;

  const filmDate = document.createElement('p');
  filmDate.classList.add('film-date');
  filmDate.textContent = `Release Date: ${film.release_date}`;

  const filmRuntime = document.createElement('p');
  filmRuntime.classList.add('film-runtime');
  filmRuntime.textContent = `Running Time: ${film.running_time} minutes`;

  filmInfo.appendChild(filmTitle);
  filmInfo.appendChild(filmDate);
  filmInfo.appendChild(filmRuntime);

  thumbnailContainer.appendChild(thumbnailImage);
  thumbnailContainer.appendChild(filmInfo);

  // Add click event listener to navigate to Film Details page
  thumbnailContainer.addEventListener('click', () => {
    window.location.href = `film.html?id=${film.id}`;
  });

  return thumbnailContainer;
}

// Retrieve film details and display them on the Film Details page
const filmDetailsContainer = document.getElementById('filmDetails');
const filmId = new URLSearchParams(window.location.search).get('id');

if (filmId) {
  fetch(`https://ghibliapi.vercel.app/films/${filmId}`)
    .then(response => response.json())
    .then(film => {
      const peopleUrls = film.people;

      // Fetch details of each person
      const fetchPeople = peopleUrls.map(url => fetch(url).then(response => response.json()));

      Promise.all(fetchPeople)
        .then(people => {
          const peopleNames = people.map(person => person.name);
          const filmDetails = `
            <h2>${film.title}</h2>
            <p><strong>Original Title:</strong> ${film.original_title}</p>
            <p><strong>Original Title (Romanized):</strong> ${film.original_title_romanised}</p>
            <p><strong>Description:</strong> ${film.description}</p>
            <p><strong>Director:</strong> ${film.director}</p>
            <p><strong>Producer:</strong> ${film.producer}</p>
            <p><strong>Release Date:</strong> ${film.release_date}</p>
            <p><strong>Running Time:</strong> ${film.running_time} minutes</p>
            <p>People:${peopleNames.map(name => `${''} ${name} ${''}`).join(', ')}</p>

            <img src="${film.image}" alt="${film.title}">

          `;
          filmDetailsContainer.innerHTML = filmDetails;
        })
        .catch(error => {
          console.log('Error fetching people:', error);
        });
    })
    .catch(error => {
      console.log('Error fetching film details:', error);
    });
}

// Search for films by title or release date
document.addEventListener('input', event => {
  if (event.target.id === 'searchBar') {
    const searchTerm = event.target.value.toLowerCase();
    const filmThumbnails = document.getElementsByClassName('film-thumbnail');

    Array.from(filmThumbnails).forEach(thumbnail => {
      const title = thumbnail.querySelector('.film-title').textContent.toLowerCase();
      const releaseDate = thumbnail.querySelector('.film-date').textContent.toLowerCase();

      if (title.includes(searchTerm) || releaseDate.includes(searchTerm)) {
        thumbnail.style.display = 'block';
      } else {
        thumbnail.style.display = 'none';
      }
    });
  }
});
