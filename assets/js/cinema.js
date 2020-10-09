
const base_url = 'https://api.themoviedb.org/3/'
const api_key = '5046236b23dee0f98193884cb9c3502f'
const genres = {
    28 : 'Action',
    16 : 'Animated',
    99 : 'Documentary',
    18 : 'Drama',
    10751 : 'Family',
    14 : 'Fantasy',
    36 : 'History',
    35 : 'Comedy',
    10752 : 'War',
    80 : 'Crime',
    10402 : 'Music',
    9648 : 'Mystery',
    10749 : 'Romance',
    27 : 'Horror',
    10770 : 'TV Movie',
    53 : 'Thriller',
    37 : 'Western',
    12 : 'Adventure',
    878: 'Science Fiction',

}

document.addEventListener('DOMContentLoaded', (e)=>{
 
    
    document.querySelector('#searchForm').addEventListener('submit',(e)=>{
        e.preventDefault()
        let query = document.querySelector('#searchInput').value;
        getMovies(query)
       
    })

})

async function getMovies(query){

    fetch(`${base_url}search/movie?api_key=${api_key}&query=${query}`)
        .then(response =>{
            if(response.status == 200){
               return response.json();
            }
        })
        .then(response => {
            let movies = response.results;
            let searchResult = document.createElement('ul');
            searchResult.setAttribute('class','search-result');
            var html = '';
            movies.forEach(movie => {
                
               if(renderMoviePoster(movie) == undefined) return false  
             searchResult.innerHTML += renderMoviePoster(movie)
               
             
                             
            });

            console.log(searchResult)
            document.querySelector('main').innerHTML = '' ;
            document.querySelector('main').append(searchResult);
        
        })
        .catch(err => {
            console.log(err);
        });

        document.querySelector('.loader-wrapper').style.display ='none';
        document.body.style.overflow = 'auto';        

} 

function movieSelected(id){
    sessionStorage.setItem('movieId' , id);
    window.location = './moviepage.html'
}

 async function renderMovieSection(section){
    await fetch(`${base_url}movie/${section}?api_key=${api_key}`)
        .then(response => {
            if(response.status == 200){
               return response.json();
            }
        })
        .then((response) => {
            let results = response.results
            let div = document.querySelector(`.${section}`);
            let glide = div.parentElement.parentElement.classList.value;
            console.log(glide)
            let html =''
            results.forEach(result =>{
               html += renderMoviePoster(result,'glide__slide')
               
            })
            div.innerHTML =html
            new Glide(`.${glide}`,{
                perView:16,
                type:'carousel',
                startAt:1.5,
                autoplay:3000
                
            }).mount()
        })
        
      

      
}

async function upcomingMovieSlider(){

 await   fetch(`${base_url}movie/popular?api_key=${api_key}`)
    .then(response =>{
        if(response.status == 200){
           return response.json();
        }else{
            throw `error ${response.status}`
        }
    } )
    .then((response) => {
        let results = response.results;
       console.log(results)
        let div = document.querySelector('.upcoming');
        let html =''
        results.slice(0,6).forEach(result =>{

           let slide = document.createElement('li');
           slide.classList = 'slide glide__slide';
           slide.setAttribute('onclick',`movieSelected(${result.id})`)
           slide.style.background = `linear-gradient(180deg,rgba(7,41,86,0.12),rgba(2,9,22)),
                                    url(https://image.tmdb.org/t/p/w500${result.backdrop_path})  no-repeat `
           slide.innerHTML = `

           <span>
               HIGHLIGHTS
           </span>

           <h2>
               ${result.title}
           </h2>

           <span>
           ${result.genre_ids.slice(0,3).map(id =>
            genres[id]  ).join(' | ')}
           </span>

           <span>
               
               <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37">
                   <g id="Component_1_1" data-name="Component 1 – 1" transform="translate(1 1)">
                     <circle id="Oval" cx="17.5" cy="17.5" r="17.5" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2"/>
                     <path id="Path" d="M.5.063A.3.3,0,0,0,.171.035.328.328,0,0,0,0,.326V14.674a.328.328,0,0,0,.171.291A.3.3,0,0,0,.5,14.937L9.873,7.763a.335.335,0,0,0,0-.526Z" transform="translate(14 10)" fill="#fff"/>
                   </g>
                 </svg>
                 
              

           Watch the trailer
           
         </span>
           
           
           `;

           
        div.append(slide)
        })
        
        new Glide('.glide1',{
            type:'carousel',
            focusAt:'center',
            perView:1.5,
            autoplay:3000
        }).mount()
       
    })
    
}



async function getMovie(){
    
    

    let movieId = sessionStorage.getItem('movieId');
  await fetch(`${base_url}movie/${movieId}?api_key=${api_key}`)
        .then(response => {
            if(response.status == 200){
              return  response.json();
            }
        })
        .then(  response => {

            let movie = response;
            console.log(movie)
            document.querySelector('#moviePoster').src = `https://image.tmdb.org/t/p/w400${movie.poster_path}`
            document.querySelector('#movieTitle').innerText = movie.title;
            document.querySelector('#movieInfo').innerText = movie.overview;
            document.querySelector('.movie-header').style.background = `linear-gradient(0deg,rgba(0,0,0,0.5),rgba(0,0,0,0.5)), 
                                                                        url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})  no-repeat `;
            document.querySelector('.movie-header').style.backgroundSize = 'cover';
                                                                    
            movieTrailerHandler(movie.title)
              
        })
        .catch(err => {
            console.log(err);
        });

  await  getMovieCredits(movieId);
  await  getSimilarMovies(movieId);

 
    

  
  

}

async function getMovieCredits(id){

 await  fetch(`${base_url}movie/${id}/credits?api_key=${api_key}`)
        .then(response =>{
            if(response.status == 200){
               return response.json();
            }
        })
        .then(response => {
            let cast = response.cast;
            
            let html = '';
            cast.forEach(actor =>{
                
                if(actor.profile_path == null) return
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

async function getSimilarMovies(id){    
    await fetch(`${base_url}movie/${id}/similar?api_key=${api_key}`)
        .then(response => {
            if(response.status == 200){
              return  response.json();
            }
        })
        .then( response => {
            let  movies =  response.results
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

async function movieTrailerHandler(movie){
    
    let key = 'AIzaSyDl2BilzV8ESZ3WAyu9SkEFUGopm2LZetA';
    let url = 'https://www.googleapis.com/youtube/v3/search'
    let query = movie;
    let mySlider = document.querySelector('.glide') 
    
 
  await fetch(`${url}?part=snippet
                   &type=video
                   &q=${query}
                   &key=${key}
                   &maxResults=6 `)
            .then(response =>{
                if(response.status == 200){
                   return response.json();
                }
            })
            .then(response =>{
                console.log(response)        
                let videos = response.items;
                let html = ''
                videos.forEach( video => {
                    console.log(video)
                    html += `
                    <li id="movie-video" class="glide__slide">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                        
                    <p id="title">
                    ${video.snippet.title}
                    </p>
                </li>
                    `
                })

                document.querySelector('.glide__slides').innerHTML = html;
            })
            .catch(err => {
                console.log(err);
            });

    new Glide('.glide',
    {
        startAt: 0,
        type:'slider',
        perView:3,
        breakpoints:{
            1700:{
                perView:2.5
            },
            1450:{
                perView:2
            },
            1150:{
                perView:1
            }
            
        }
    }).mount()

}

async function pageLoader(functionName){

   await functionName()
   document.querySelector('.loader-wrapper').style.display ='none';
    document.body.style.overflow = 'auto';

}

function renderMoviePoster(movie,className = ""){
    if(movie.poster_path)
    return  `<li class="${className}">
    <a onclick="movieSelected(${movie.id})"><img src="https://image.tmdb.org/t/p/w200${movie.poster_path}"  </a>
    </li> `
    
}


document.querySelector('#seeMore').addEventListener('click' , (e)=>{

    e.preventDefault()
    if(document.querySelector('.cast').style.flexWrap == ""){
    document.querySelector('.cast').style.flexWrap = 'wrap';
    document.querySelector('#seeMore').innerText = 'See less'
    }else{
        document.querySelector('.cast').style.flexWrap = '';
        document.querySelector('#seeMore').innerText = 'See the full cast'
    }
})

document.querySelector('#rateBtn').addEventListener('click',(e)=>{
    e.preventDefault()
    document.querySelector(".reviews > form").style.display = "flex";
})

