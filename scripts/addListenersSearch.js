// author: Greg Lawrence
// purpose: add listeners for click events on buttons in the search field

const dataManager = require("./util/dataManager")
const $ = require("jquery")
const renderer = require("./renderer/renderer")
const movieFactory = require("./util/movieFactory")


const addListenersSearch = function() {

    // add listener to the search area in nav bar 
    document.querySelector(".search").addEventListener("click", e => {

        
        // get value from search field
        let searchQuery = $("#searchField").val()
        searchQuery = searchQuery.split(" ").join("+");
        console.log(searchQuery);
        
        // check if the button clicked was Find A Movie
        if (e.target.className.includes("nav__findMovie")) {

            // show the dom element that displays the Find A Movie API Search Results
            $(".movieResults").removeClass("hidden")
    
            // hide the dom element that shows the user their tracked movies
            $(".trackedMovies").addClass("hidden")


            
            // send the search Query to the movie API to look for matches
            dataManager.searchMovies(searchQuery).then( result=>{
                result.results.forEach(movie => {
                    // send results to the render function to create DOM elements and place results in the DOM
                    renderer.append(movieFactory.build(movie), "movieResults__cardContainer");
                });
            })
            
            // Do we want to clear the search bar ever??
            $("#searchField").val("")
        }
        
        
        
        // check if the button clicked was Search My Movies
        if (e.target.className.includes("nav__searchMyMovies")) {
            
            // clear out any previous search results 
            $(".trackedMovies__cardContainer").html("")
            
            if (searchQuery) {

                // search user's tracked movies to check if a movie matched the title the user put in search field
                movieFactory.cache.forEach(movie => {
                    
                    if (movie.movieName.toLowerCase().includes(searchQuery.toLowerCase())) {
                        renderer.append(movie, "trackedMovies__cardContainer")
                    }

                })
            } else {
                // if nothing is in search input field and user clicks "Search My Movies", show ALL of their tracked movies
                movieFactory.cache.forEach(movie => {
                    renderer.append(movie, "trackedMovies__cardContainer")
                })
            }

            // make sure all tracked movies are displayed and none of the cards have the "hidden" class
            /* -- psuedo code, may work, may not -- */
            // $("watched").removeClass("hidden")   
            // $("unwatched").removeClass("hidden")
            
            // hide the dom element that displays the Find A Movie API Search Results
            $(".movieResults").addClass("hidden")
            
            // display the dom element that shows the user their tracked movies
            $(".trackedMovies").removeClass("hidden")
            
        }
    })
}



module.exports = addListenersSearch