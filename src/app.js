let covidData;
let currentPage = 1;
const itemsPerPage = 30;
let startIndex, endIndex;

const dateEl = document.getElementById('date')
dateEl.innerText = new Date().toLocaleDateString(undefined,
    {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }
)


async function getData() {
    const response = await fetch('https://disease.sh/v3/covid-19/countries');
    const data = await response.json();
    covidData = data;
    showPage(); 
}

function displayPage() {
    let mainCont = document.getElementById('main');
    
    startIndex = (currentPage - 1) * itemsPerPage;
    endIndex = startIndex + itemsPerPage;
    const pageData = covidData.slice(startIndex, endIndex);

    mainCont.innerHTML = ''; 

    pageData.forEach(country => {
        const card = document.createElement('div');
        const flag = document.createElement('img');
        const cardBody = document.createElement('div');
        const countryName = document.createElement('h3');
        const continent = document.createElement('h3'); 

        card.className = 'card p-3 bg-success-subtle';
        flag.className = 'card-img-top mb-2';
        cardBody.className = 'card-body';
        countryName.className = 'card-title text-center';
        continent.className = 'card-title text-center'; 

        flag.src = country.countryInfo.flag;
        countryName.textContent = country.country;
        continent.textContent = country.continent; 

        cardBody.append(countryName, continent); 
        card.append(flag, cardBody);
        mainCont.append(card);
        
        function showPopup(country) {
            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            overlay.addEventListener('click', () => {
                document.body.removeChild(overlay);
                popup.remove();
            });
            document.body.appendChild(overlay);
        
            const popup = document.createElement('div');
            popup.className = 'popup bg-success-subtle';
        
            const popupContent = document.createElement('div');
            popupContent.className = 'popup-content';
        
            const closeBtn = document.createElement('span');
            closeBtn.className = 'popup-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(overlay);
                popup.remove();
            });
        
            const countryName = document.createElement('h2');
            countryName.textContent = country.country;
        
            const countryPopulation = document.createElement('p');
            countryPopulation.textContent = `Country Population: ${country.population}`;
        
            const reportedCasesToday = document.createElement('p');
            reportedCasesToday.textContent = `Reported Cases Today: ${country.todayCases}`;
        
            const totalCase = document.createElement('p');
            totalCase.textContent = `Total Cases: ${country.cases}`;
        
            const totalDeath = document.createElement('p');
            totalDeath.textContent = `Total Deaths: ${country.deaths}`;
        
            const recoveredNo = document.createElement('p');
            recoveredNo.textContent = `Total Recovered: ${country.recovered}`;
        
            popupContent.append(closeBtn, countryName, countryPopulation, reportedCasesToday, totalCase, totalDeath, recoveredNo);
            popup.append(popupContent);
            
            document.body.appendChild(popup);
        }

        
        
        
        card.addEventListener('click', () => {
            showPopup(country);
        });
    });
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        showPage();
    }
}

function nextPage() {
    if (currentPage < Math.ceil(covidData.length / itemsPerPage)) {
        currentPage++;
        showPage();
    }
}

function showPage() {
    const prevBtn = document.getElementById('prev-button');
    const nextBtn = document.getElementById('next-button');
    const pageNum = document.getElementById('page-number');

    pageNum.innerText = currentPage

    prevBtn.hidden = currentPage === 1;
    nextBtn.hidden = currentPage === Math.ceil(covidData.length / itemsPerPage);

    nextBtn.addEventListener('click', nextPage);
    prevBtn.addEventListener('click', prevPage);

    displayPage();
}

window.addEventListener('DOMContentLoaded', getData);
