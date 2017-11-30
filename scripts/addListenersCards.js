/**
 * Krys Mathis
 * Event listeners for the movie cards
 */
const dataManager = require("./util/dataManager");
const movieFactory = require("./util/movieFactory");
const getCast = require("./util/getCast");
const renderer = require("./renderer/renderer.js");
const trackedMoviesController = require("./trackedMovies/trackedMoviesController");

addListenersCards = () => {

    $(".cardContainer").on("click", (e) => {

        const elClass = e.target.className;
        const targetId = e.target.id;

        if (elClass.includes("card__add-to-watchlist")) {
            const movieId = parseInt(targetId.split("|")[1]);
            // check if this movie exists already
            if (movieFactory.cache.find(r => r.movieId === movieId)) {
                Materialize.toast("Already on your list!", 4000);
            } else {
                dataManager.firebasePOST(movieId).then((results) => {
                    const movieObj = {
                        "movieId": movieId,
                        "fbId": results.name,
                        "rating": 0
                    }
                    trackedMoviesController.getMovieDetails([movieObj]);
                    $(`#card${movieId}`).remove();
                });
            }
        }

        if (targetId.includes("additionalDetails")) {
            const movieId = parseInt(targetId.split("-")[1]);
            const actorsEl = $(`#movie__actors-${movieId}`);
    
            if (!actorsEl.children().length > 0) {
                let cast = [];
                getCast.fetch(movieId).then(result => {
                    cast = $(renderer.getActors(result));
                    const ul = $(`#movie__actors-${movieId}`);
                    cast.appendTo(ul);
                })
            }
        }

        if (elClass.includes("card__watched")) {
            const idData = targetId.split("|");
            //console.log("card__watched - launch modal");
            $("#rating__modal").attr("data-movieId", idData[1])
            $("#rating__modal").attr("data-firebaseId", idData[2])
        }


        if (elClass.includes("card__delete-chip")) {

            const movieIdParts = targetId.split("|")[1];
            const fbId = movieIdParts.split("@")[0];
            const movieId = parseInt(movieIdParts.split("@")[1]);

            dataManager.firebaseDELETE(fbId).then(() => {
                $(`#card${movieId}`).hide();
            }).then(() => {
                movieFactory.removeFromCache(movieId);
            })

        }


    });
}

module.exports = addListenersCards;