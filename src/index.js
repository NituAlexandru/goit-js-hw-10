import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Notiflix from 'notiflix';

document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.querySelector('.breed-select');
  const catInfoDiv = document.querySelector('.cat-info');
  const loader = document.querySelector('.loader');
  const errorParagraph = document.querySelector('.error');

  // ascunde select si info pisica
  breedSelect.style.display = 'none';
  catInfoDiv.style.display = 'none';
  errorParagraph.style.display = 'none';

  // afiseaza loader ul la incarcarea paginii
  loader.style.display = 'block';

  fetchBreeds()
    .then(breeds => {
      loader.style.display = 'none';
      breedSelect.style.display = 'block';

      breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        breedSelect.appendChild(option);
      });
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      loader.style.display = 'none';
    });

  breedSelect.addEventListener('change', event => {
    const breedId = event.target.value;

    if (!breedId) {
      errorParagraph.textContent = 'Please select a breed.';
      return;
    }

    loader.style.display = 'block';
    catInfoDiv.style.display = 'none';
    errorParagraph.style.display = 'none';

    fetchCatByBreed(breedId)
      .then(catData => {
        loader.style.display = 'none';

        // Crearea containerului pentru layout
        const catContainer = document.createElement('div');
        catContainer.style.display = 'flex';
        catContainer.style.alignItems = 'flex-start';

        // Crearea și stilizarea imaginii
        const catImage = document.createElement('img');
        catImage.src = catData.url;
        catImage.alt = `Image of ${catData.breeds[0].name}`;
        catImage.style.maxHeight = '300px';
        catImage.style.marginRight = '20px';
        catContainer.appendChild(catImage);

        // Crearea și adăugarea textului
        const catText = document.createElement('div');
        catText.innerHTML = `<h2>${catData.breeds[0].name}</h2><p>${catData.breeds[0].description}</p>`;
        catContainer.appendChild(catText);

        // Curățarea conținutului anterior și adăugarea noului layout
        catInfoDiv.innerHTML = '';
        catInfoDiv.appendChild(catContainer);

        catInfoDiv.style.display = 'block';
      })
      .catch(error => {
        errorParagraph.textContent = 'Failed to load cat data.';
        loader.style.display = 'none';
      });
  });
});
