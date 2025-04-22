const countriesList = document.getElementById("countries-list");
const continent = document.getElementById("kontinent");
const modalBody = document.getElementById("oneCountry-body");
const modal = new bootstrap.Modal(document.getElementById("oneCountry"));

function loadCountries(region) {
  countriesList.innerHTML = "";
  fetch(`https://restcountries.com/v3.1/region/${region}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      data.forEach((country) => {
        let blockCountry = `
            <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                    <div class="card">
                        <img class="card-img-top" src="${country.flags.png}" alt="${country.flags.png}/>
                        <div class="card-body">
                            <h4 class="card-title"><a href="#">${country.translations.ces.official}</a></h4>
                            <p class="card-text">Hlavní město: <b>${country.capital[0]}</b></p>
                            <p><button class="btn btn-secondary" 
                                data-bs-toggle="modal" 
                                data-bs-target="#oneCountry"
                                data-name="${country.name.common}">Informace</button></p>
                        </div>
                    </div>
                </div>
                `;
        countriesList.innerHTML += blockCountry;
      });
      document.querySelectorAll('button[data-name]').forEach(button => {
        button.addEventListener('click', () => {
          const countryName = button.getAttribute('data-name');
          modal.show();
          fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText-true`)
          .then(res => res.json())
          .then(data => {
            const country = data[0];
            modalBody.innerHTML = `
            <h4>${country.translations.ces.common}</h4>`
          })
          .catch(error => {
            console.error(error);
          })
        })
      });
    })
    .catch(error => {
      console.error(error);
    });
}

loadCountries("europe");

continent.addEventListener("change", function (event) {
  loadCountries(event.target.value);
});
