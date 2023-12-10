async function getPortfolio(){
    return fetch('http://localhost:8080/portfolio', {    
        method: "GET",       
    }
    )
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
async function getPortfolioOrderedByName(line_name){
    return fetch(`http://localhost:8080/portfolioByName/Ordered/${encodeURI(line_name)}`, {    
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
async function getPortfolioOrdered(){
    return fetch(`http://localhost:8080/portfolio/ordered`, {    
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
async function getPortfolioOrderedDesc(){
    return fetch(`http://localhost:8080/portfolio/orderedDesc`, {    
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
async function getPortfolioOrderedDescByname(line_name){
    return fetch(`http://localhost:8080/portfolioByName/OrderedDesc/${encodeURI(line_name)}`, {    
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    }
    )
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
async function getPortfolioByName(line_name){
    return fetch(`http://localhost:8080/portfolioByName/${encodeURI(line_name)}`, {    
        method: "GET",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
async function getPhotographerName(id){
    return fetch(`http://localhost:8080/photographerName/${id}`, {
        method: "GET",}
    )
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
async function getPhotographerFullName(id){
    return fetch(`http://localhost:8080/photographerFullName/${id}`, {
        method: "GET",}
    )
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        return data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
async function getPhotographerPhoto(id){
    return fetch(`http://localhost:8080/photographerPhoto/${id}`, {
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
async function getPhotographer(id){
    return fetch(`http://localhost:8080/photographer/${id}`, {
        method: "GET",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        return data[0];
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

async function displayPortfolioList(portfolios) { 
    let portfolioList = document.getElementById('portfolio-list');
    portfolioList.innerHTML = ""   
    console.log(portfolios);
    portfolios.forEach(async portfolio => {
        const portfolioItem = document.createElement('li');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.innerHTML = `
        <div id="portfolio-el" class="center">
            <div class="constraint-layout">
            <div class="el-row">
                <img id="ava" class="avatar" src="http://localhost:8080/photographerPhoto/${portfolio.photographer_id}" alt="Avatar" >
                <h2 class="fio">${(await getPhotographerName(portfolio.photographer_id)).partName}</h2>
                </div>
                <p class="description">Описание</p>
                <p class="person_text">${portfolio.description}</p>
                <div id="viewPager"></div>
                <p class="description">Стоимость</p>
                <p class="cost">${portfolio.price}₽</p>
                <button id="open" class="rounded-button">Открыть портфолио</button>
                <div class="separator"></div>
            </div>
        </div>
        `;
        portfolioItem.onclick = () => showPortfolioDetails(portfolio);
        portfolioList.appendChild(portfolioItem);
    });
}

// Function to display detailed portfolio information
async function showPortfolioDetails(portfolio) {
    console.log("Try to show");
    const portfolioDetails = document.getElementById('portfolio-details');
    portfolioDetails.style.display = "flex";
    const portfolioInfo = document.getElementById('portfolio-info');
    let email = (await getPhotographer(portfolio.photographer_id)).photographer_email
    // Display portfolio details
    portfolioInfo.innerHTML = `
    <div id="portfolio-el" class="center">
            <div class="constraint-layout">
                <img id="ava" class="big-avatar" src="http://localhost:8080/photographerPhoto/${portfolio.photographer_id}" alt="Avatar" >
                <h2 class="fio">${(await getPhotographerFullName(portfolio.photographer_id)).partName}</h2>
                <p class="description">Описание</p>
                <p class="person_text">${portfolio.description}</p>
                <p class="description">Email</p>
                <a class="email" href="mailto:${email}">${email}</a>
                <p class="description">Фотографии</p>
                <img class="photographer_photo" src="http://localhost:8080/photographerPhoto/${portfolio.photographer_id}">
                <div id="viewPager"></div>
                <p class="description">Стоимость</p>
                <p class="cost">${portfolio.price}₽</p>
                <div class="separator"></div>
            </div>
        </div>
    `;

    portfolioDetails.classList.remove('hidden');
}

// Function to go back to the portfolio list
function goBack() {
    const portfolioDetails = document.getElementById('portfolio-details');
    portfolioDetails.style.display = "none";
}

document.getElementById("searchButton").addEventListener('click', async function(){
    var selectedOption = document.querySelector('input[name="options"]:checked').value;
    console.log("Выбрана опция: " + selectedOption);
    let line_name = document.getElementById("searchInput").value;
    console.log(line_name);
    if (selectedOption === "ordered"){
        if (line_name === ""){
            let portfolios = await getPortfolioOrdered();
            displayPortfolioList(portfolios);
        }
        else {
            let portfolios = await getPortfolioOrderedByName(line_name);
            displayPortfolioList(portfolios);
        }
    }
    else if (selectedOption === "orderedDesc"){
        if (line_name === ""){
            let portfolios = await getPortfolioOrderedDesc();
            displayPortfolioList(portfolios);
        }
        else{
            let portfolios = await getPortfolioOrderedDescByname(line_name);
            displayPortfolioList(portfolios);
        }
    }
    else {
        if (line_name === ""){
            let portfolios = await getPortfolio();
            displayPortfolioList(portfolios);
        }
        else{
            let portfolios = await getPortfolioByName(line_name);
            displayPortfolioList(portfolios);
        }
    }
});

// Display the portfolio list when the page loads
document.addEventListener('DOMContentLoaded', async function(){    
    let portfolios = await getPortfolio();
    displayPortfolioList(portfolios);
});
