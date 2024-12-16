class Ui {
    showGames(data) {
        let games = ``;
        for (let i = 0; i < data.length; i++) {
            games += `
            <div class="col-md-6 col-lg-4 col-xl-3">
                <div data-id=${data[i].id} class="card h-100 bg-transparent" role="button">
                    <div class="card-body">
                        <figure class="position-relative">
                            <img class="card-img-top object-fit-cover h-100" src="${data[i].thumbnail}" alt="game home" />
                        </figure>
                        <figcaption>
                            <div class="hstack justify-content-between">
                                <h3 class="h6 small">${data[i].title}</h3>
                                <span class="badge text-bg-primary p-2">Free</span>
                            </div>
                            <p class="card-text small text-center opacity-50">
                                ${data[i].short_description.split(" ", 8)}
                            </p>
                        </figcaption>
                    </div>
                    <footer class="card-footer small hstack justify-content-between">
                        <span class="badge badge-color">${data[i].genre}</span>
                        <span class="badge badge-color">${data[i].platform}</span>
                    </footer>
                </div>
            </div>
            `;
        }
        document.getElementById("gamesContainer").innerHTML = games;
    }

    showDetails(data) {
        const content = `
        <div class="col-md-6">
            <img src="${data.thumbnail}" class="w-100" alt="image details" />
        </div>
        <div class="col-md-6">
            <h3>Title: ${data.title}</h3>
            <p>Category: <span class="badge text-bg-info"> ${data.genre}</span></p>
            <p>Platform: <span class="badge text-bg-info"> ${data.platform}</span></p>
            <p>Status: <span class="badge text-bg-info"> ${data.status}</span></p>
            <p class="small">${data.description}</p>
            <a class="btn btn-outline-warning" target="_blank" href="${data.game_url}">Show Game</a>
        </div>
        `;
        document.getElementById("detailsContent").innerHTML = content;
        const backgroundUrl = data.thumbnail.replace("thumbnail", "background");
        document.getElementById("details").style.cssText = `
            background-image:linear-gradient(#272b30b2 0% 100%), url(${backgroundUrl});
            background-size: cover; 
            background-position: center center;`;
    }
}

class Details {
    constructor(id) {
        document.getElementById("close").addEventListener("click", () => {
            document.querySelector(".home").classList.remove("d-none");
            document.querySelector(".details").classList.add("d-none");
        });
        this.ui = new Ui();
        this.getDetails(id);
    }

    async getDetails(id) {
        const loader = document.querySelector(".loading");
        loader.classList.remove("d-none");
        const options = {
            method: "GET",
            headers: {
                "x-rapidapi-key": "1db41080b7msh674a3af903d080ep18fcb5jsn0b8b1d11212a",
                "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
            },
        };
        const api = await fetch(
            `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`,
            options
        );
        const response = await api.json();
        this.ui.showDetails(response);
        loader.classList.add("d-none");
    }
}

class Games {
    constructor() {
        this.getGames("mmorpg");

        document.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", (e) => {
                document.querySelector(".active").classList.remove("active");
                e.target.classList.add("active");
                this.getGames(e.target.dataset.category);
            });
        });

        this.ui = new Ui();
    }

    async getGames(category) {
        const loader = document.querySelector(".loading");
        loader.classList.remove("d-none");
        const options = {
            method: "GET",
            headers: {
                "x-rapidapi-key": "1db41080b7msh674a3af903d080ep18fcb5jsn0b8b1d11212a",
                "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
            },
        };

        const api = await fetch(
            `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`,
            options
        );
        const response = await api.json();
        this.ui.showGames(response);
        this.eventCards();
        loader.classList.add("d-none");
    }

    eventCards() {
        document.querySelectorAll(".card").forEach((card) => {
            card.addEventListener("click", () => {
                const id = card.dataset.id;
                this.displayDetails(id);
            });
        });
    }

    displayDetails(id) {
        const details = new Details(id);
        document.querySelector(".home").classList.add("d-none");
        document.querySelector(".details").classList.remove("d-none");
    }
}

new Games();
