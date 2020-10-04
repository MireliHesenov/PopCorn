
base_url = 'https://api.themoviedb.org/3/'
api_key= '5046236b23dee0f98193884cb9c3502f'

document.addEventListener('DOMContentLoaded', (e)=>{
 
    
    document.querySelector('#searchForm').addEventListener('submit',(e)=>{
        e.preventDefault()
        let query = document.querySelector('#searchInput').value;
        getMovies(query);
       
    })

})

function getMovies(query){

    fetch(base_url+'search/movie?api_key=' + api_key + '&query='+ query)
        .then(response => response.json())
        .then(response => {
            let movies = response.results;
            let html =''
            console.log(movies)
            movies.forEach(movie => {
                
                html += `
                
                <div class="movie">
                    <a onclick="movieSelected(${movie.id})"><img src="https://image.tmdb.org/t/p/w200${movie.poster_path}"  </a>
                </div>
                
                
                
                `
                
            });

            document.body.innerHTML = html
        
        })
        .catch(err => {
            console.log(err);
        });

} 

function movieSelected(id){
    sessionStorage.setItem('movieId' , id);
    window.location = './MoviePage.html'
}

function getMovie(){
    let movieId = sessionStorage.getItem('movieId');
    fetch(base_url+'movie/'+ movieId +'?api_key='+api_key)
        .then(response => response.json())
        .then(  response => {

            let movie = response;
            console.log(movie)
            document.querySelector('#moviePoster').src = `https://image.tmdb.org/t/p/w400${movie.poster_path}`
            document.querySelector('#movieTitle').innerText = movie.title;
            document.querySelector('#movieInfo').innerText = movie.overview;
            document.querySelector('.movie-header').style.background = `linear-gradient(0deg,rgba(0,0,0,0.5),rgba(0,0,0,0.5)), 
                                                                        url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})  no-repeat `;
            document.querySelector('.movie-header').style.backgroundSize = 'cover';
                                                                    
            
        })
        .catch(err => {
            console.log(err);
        });

    getMovieCredits(movieId);
    getSimilarMovies(movieId);
    

}

function getMovieCredits(id){

    fetch(base_url + 'movie/' + id + '/credits?api_key=' + api_key)
        .then(response => response.json())
        .then(response => {
            let cast = response.cast;
            
            let html = '';
            cast.forEach(actor =>{
                
                html +=`
                <li class="actor">
                    <img src="https://image.tmdb.org/t/p/w400${actor.profile_path}" alt="">
                    <div class="actor-info">
                        <p>${actor.name}</p>
                        <p>${actor.character}</p>
                    </div>
                </li>
                `
            })
        document.querySelector('.cast').innerHTML = html
        })
        .catch(err => {
            console.log(err);
        });
}

function getSimilarMovies(id){
    fetch(base_url + 'movie/' + id +'/similar?api_key='+api_key)
        .then(response => response.json())
        .then(response => {
            let  movies = response.results
            let html = '';
            movies.slice(0, 6).forEach(movie => {
            html +=`
            <li>
                <a onclick="movieSelected(${movie.id})">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="">
                </a>
            </li>
            
            `
        })
            document.querySelector('#similarMovies').innerHTML = html;
        })
        .catch(err => {
            console.log(err);
        });
    
}