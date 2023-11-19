import axios from 'axios';

// antetul global pentru cheia API
axios.defaults.headers.common['x-api-key'] =
  'live_pY1wH5FL1IfqXDVQOGjAvwXucVuJie5LAkGsqBthZKu0LCdMyU29hf8qabHpH6q4';

// cererea GET si returnarea promisiunii cu rasele de pisici
export function fetchBreeds() {
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => response.data);
}
// cerere GET pentru rasa pisici
export function fetchCatByBreed(breedId) {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => response.data[0])
    .catch(error => {
      throw error;
    });
}
