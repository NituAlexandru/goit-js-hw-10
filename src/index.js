import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';

document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.querySelector('.breed-select');
  const catInfoDiv = document.querySelector('.cat-info');
  const loader = document.querySelector('.loader');
  const errorParagraph = document.querySelector('.error');

  // ascunde select, info pisica si paragraful pt eroare
  breedSelect.style.display = 'none';
  catInfoDiv.style.display = 'none';
  errorParagraph.style.display = 'none';

  // afiseaza loader ul la incarcarea paginii
  loader.style.display = 'block';


  // apeleaza functia
  fetchBreeds()
    .then(breeds => {
      loader.style.display = 'none';
      breedSelect.style.display = 'block';

      breeds.forEach(breed => {
        //itereaza prin fiecare element (rasa)
        const option = document.createElement('option'); //creaza elem nou
        option.value = breed.id; // seteaza val
        option.textContent = breed.name; // seteaza val
        breedSelect.appendChild(option); //adauga opt. la elem selectat
      });
    })
    .catch(error => {
      //Prinde orice eroare care apare in timpul solicitarii HTTP.
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      loader.style.display = 'none';
    });

  breedSelect.addEventListener('change', event => {
    const breedId = event.target.value; // obtine val optiunii selectate

    // verifica daca a fost selectata o rasa, altfel afiseaza mesaj eroare
    // si opreste executia
    if (!breedId) {
      errorParagraph.textContent = 'Please select a breed.';
      return;
    }

    loader.style.display = 'block';
    catInfoDiv.style.display = 'none';
    errorParagraph.style.display = 'none';

    //Apelează funcția fetchCatByBreed cu ID-ul rasei selectate și procesează răspunsul.
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
        catImage.style.marginTop = '30px';
        catContainer.appendChild(catImage);

        // Crearea si adăugarea textului
        const catText = document.createElement('div');
        catText.innerHTML = `
        <h2>${catData.breeds[0].name}</h2>
        <p>${catData.breeds[0].description}</p>
        <p><strong>Temperament:</strong> ${catData.breeds[0].temperament}</p>
        <h4><a target="_blank" href="${catData.breeds[0].wikipedia_url}">Wikipedia</a></h4>`;
        catContainer.appendChild(catText);

        // Curățarea conținutului anterior și adăugarea noului layout
        catInfoDiv.innerHTML = '';
        catInfoDiv.appendChild(catContainer);

        catInfoDiv.style.display = 'block';
      })
      .catch(error => {
        //Prinde orice eroare care apare în timpul solicitării HTTP.
        errorParagraph.textContent = 'Failed to load cat data.';
        loader.style.display = 'none';
      });
  });
});
