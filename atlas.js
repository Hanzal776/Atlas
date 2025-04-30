const countryContainer = document.getElementById("countries-list");
const regionSelector = document.getElementById("kontinent");
const modalTitleEl = document.querySelector("#oneCountry .modal-title");
const modalContent = document.getElementById("oneCountry-body");
const countryModal = new bootstrap.Modal(document.getElementById("oneCountry"));

function displayCountries(region) {
  countryContainer.innerHTML = "";

  fetch(`https://restcountries.com/v3.1/region/${region}`)
    .then(response => response.json())
    .then(countries => {
      countries.forEach(country => {
        const countryCard = `
          <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-3">
            <div class="card h-100">
              <img src="${country.flags.png}" class="card-img-top" alt="Vlajka ${country.name.common}">
              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title"><a href="#">${country.translations?.ces?.official || country.name.common}</a></h5>
                <p class="card-text">Hlavní město: <strong>${country.capital ? country.capital[0] : "Neznámé"}</strong></p>
                <button class="btn btn-info mt-2" data-bs-toggle="modal" data-bs-target="#oneCountry" data-country="${country.name.common}">
                  Zobrazit více
                </button>
              </div>
            </div>
          </div>
        `;
        countryContainer.insertAdjacentHTML("beforeend", countryCard);
      });

      document.querySelectorAll('button[data-country]').forEach(btn => {
        btn.addEventListener("click", () => {
          const countryName = btn.getAttribute("data-country");
          modalTitleEl.textContent = "Detaily o zemi";
          countryModal.show();

          fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
            .then(response => response.json())
            .then(result => {
              const info = result[0];

              const currency = info.currencies ? Object.values(info.currencies)[0].name : "Neznámá";
              const language = info.languages ? Object.values(info.languages).join(", ") : "Neznámý";
              const timezone = info.timezones ? info.timezones[0] : "Neznámé";

              modalContent.innerHTML = `
                <h4>${info.translations?.ces?.common || info.name.common}</h4>
                <p><strong>Hlavní město:</strong> ${info.capital ? info.capital[0] : "Neznámé"}</p>
                <p><strong>Počet obyvatel:</strong> ${info.population.toLocaleString("cs-CZ")}</p>
                <p><strong>Rozloha:</strong> ${info.area.toLocaleString("cs-CZ")} km²</p>
                <hr>
                <h5>📌 Základní informace:</h5>
                <p><strong>Měna:</strong> ${currency}</p>
                <p><strong>Jazyk:</strong> ${language}</p>
                <p><strong>Časové pásmo:</strong> ${timezone}</p>
              `;
            })
            .catch(err => {
              console.error("Chyba při načítání detailů:", err);
            });
        });
      });
    })
    .catch(err => {
      console.error("Chyba při načítání zemí:", err);
    });
}

// Výchozí kontinent (např. Evropa)
displayCountries("europe");

// Změna kontinentu
regionSelector.addEventListener("change", (e) => {
  displayCountries(e.target.value);
});
