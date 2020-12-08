
/******** DOM Elements *********/
const gameContainer = document.querySelector('#game-list')
const gamePage = document.querySelector(`#game-page`) // Just made to append new game
const gameImage = document.querySelector('#game-image')
const gameTitle = document.querySelector('#game-title')
const gameDescription = document.querySelector('#game-description')
const gameRating = document.querySelector('#game-rating')
const gameRelease = document.querySelector('#game-release')
const gameReview = document.querySelector('#game-review')
const gamePlatform = document.querySelector('#game-platform')
const reviewContainer = document.querySelector('#review-container')
const reviewLike = document.querySelector('#review-like')
const reviewForm = document.querySelector('#review-form')
const gameForm = document.querySelector('#game-form')
const globalLikeButton = document.createElement('button')
globalLikeButton.textContent = '👍'
const globalDeleteButton = document.createElement('button')
globalDeleteButton.textContent = '😵'
const globalDislikeButton = document.createElement('button')
globalDislikeButton.textContent = '💩'
// const reviewRating = document.querySelector('#review-rating')
const toggleSwitch = document.querySelector("#toggle-dark-mode")
const navigationBar = document.querySelector('.topnav')
const pageAbout = document.querySelector('#about')
const pageSortZToA = document.querySelector('#sortZtoA')
const pageSortAToZ = document.querySelector('#sortAtoZ')
let gameArray = ""

/******** Render Functions ********/
const getGames =  () => {
    fetch("http://localhost:3000/api/v1/games")
    .then(r => r.json())
    .then(games => {

        gameArray = games
        renderAllGames(games)
        // debugger
    })
}


function renderAllGames(games) {
    games.forEach((game) => {
        renderOneGame(game)
    })
}

function renderOneGame(game) {
    
    
    const li = document.createElement('li')
    li.dataset.id = game.id
    li.textContent = `${game.title}`

    
    gameContainer.append(li)

}
// some pseudo code; 
// On initial render display should be none. On game click display: none should be removed

function renderGameDetails(gameObj) {
    let average = gameObj.reviews.map(review => {
        return review.rating 
    })
    if (average.length > 0) {
    let sum = average.reduce((previous, current) => current + previous, 0);
    let avg = sum / average.length;
    gameRating.textContent = `Overall Rating: ${avg.toFixed(1)}`
    }
    else if (average.length === 0) {
        gameRating.textContent = `Overall Rating: 0`
    }
    reviewForm.dataset.id = gameObj.id
    reviewContainer.dataset.id = gameObj.id // Dislike and like 
    gameImage.src = gameObj.image
    gameImage.alt = gameObj.title
    gameTitle.textContent = gameObj.title
    
    // gameRating.textContent = `Overall Rating: ${avg.toFixed(1)}`
    gameRelease.textContent = `Release Date: ${gameObj.release_date}`
    gamePlatform.textContent = `Platform: ${gameObj.platform}`
    gameDescription.textContent = gameObj.description  

    gamePage.append(gameImage, gameTitle, gameRating, gameRelease, gamePlatform, gameDescription)

    gameReview.innerHTML = ""
    gameObj.reviews.forEach((review) => {
        const div = document.createElement('div')
        div.dataset.id = review.id
        // div.className = "content-info"
        const titleH2 = document.createElement('h2')
        const contentP = document.createElement('p')
        const contentLike = document.createElement('p')
        const contentRating = document.createElement('h3')
        const contentPlaytime = document.createElement('h4')
        const likeButton = document.createElement('button')
        const deleteButton = document.createElement('button')
        likeButton.className = "like-button"
        likeButton.dataset.id = review.id
        const dislikeButton = document.createElement('button')
        dislikeButton.className = "dislike-button"
        dislikeButton.dataset.id = review.id
        dislikeButton.textContent = '💩'
        likeButton.textContent = '👍'
        deleteButton.textContent = '😵'
        deleteButton.className = 'delete-button'
        deleteButton.dataset.id = review.id
        contentP.className = 'review-content'
        contentLike.className = 'likes'

        titleH2.textContent = review.title
        contentRating.textContent = `${review.rating}/5 Rating`
        contentP.textContent = `Content: ${review.content}`
        contentPlaytime.textContent = `Playtime: ${review.playtime} Hours`
        contentLike.textContent = `${review.like} Likes`
        //updatedLike = document.querySelector('.likes')
        div.append(titleH2,contentP,contentPlaytime, contentLike, contentRating,likeButton, dislikeButton,deleteButton)
        gameReview.append(div )
        
        reviewContainer.append(gameReview)
    })
}


/******** Event Listeners ********/
gameContainer.addEventListener('click', handleGameClick)
reviewContainer.addEventListener('click', handleLikeButton)
reviewContainer.addEventListener('click', handleDislikeButton)
reviewContainer.addEventListener('click', handleDeleteButton)
reviewForm.addEventListener('submit', handleReviewSubmit)
gameForm.addEventListener('submit', handleGameSubmit)
toggleSwitch.addEventListener('click', handleToggle)
navigationBar.addEventListener('click', handleConsole)
pageAbout.addEventListener('click', handlePageAbout)
pageSortZToA.addEventListener('click', handleSortZToA)
pageSortAToZ.addEventListener('click', handleSortAToZ)

/******** Event Handlers ********/
function handleGameClick(event) {
    if (event.target.matches('li')) {
        const li = event.target.closest('li')
        const id = li.dataset.id
        
        fetch(`http://localhost:3000/api/v1/games/${id}`)
        .then(r => r.json())
        .then(gameObj => { 
            gamePage.style.display = 'initial'
            // gameReview.style.display = 'initial'
            renderGameDetails(gameObj)
        })
        
    }
}

function handleLikeButton(event) {
    const id = event.target.dataset.id
    const updatedLike = event.target.parentElement.querySelector('.likes')
    const increaseLike = parseInt(updatedLike.textContent) + 1
    
    console.log(event.target)
    if (event.target.matches('.like-button')) {
        const likeObj = {
            like: increaseLike
        }
        
        updateLike(id, likeObj, updatedLike, increaseLike)
    }
}

function handleDislikeButton(e){
    const id = e.target.dataset.id
    const updatedLike = e.target.parentElement.querySelector('.likes')
    const decreaseLike = parseInt(updatedLike.textContent) - 1
    if(e.target.matches('.dislike-button')) {
        const likeObj = { 
            like: decreaseLike
        }
        
        updateLike(id, likeObj, updatedLike, decreaseLike)
    }
}

const updateLike = (id, likeObj, updatedLike, like) => {
    fetch(`http://localhost:3000/api/v1/reviews/${id}`,{
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(likeObj)
    })
    .then(r => r.json())
    .then(() => {
        updatedLike.textContent = `${like} Likes`
    })
}


function handleReviewSubmit(event) {
    event.preventDefault()
    const id = parseInt(reviewForm.dataset.id)
    const reviewTitle = event.target.title.value
    const reviewRating = parseInt(event.target.rating.value)
    const reviewPlaytime = event.target.playtime.value
    const reviewContent = event.target.content.value
    
    

    const newReview = {
        title: reviewTitle,
        rating: reviewRating,
        like: 0,
        playtime: reviewPlaytime,
        content: reviewContent, 
        user_id: 1,
        game_id: id
    }
    addReview(newReview)
}


const addReview = (newReview) => {   
    fetch(`http://localhost:3000/api/v1/reviews/`,{
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(newReview)
    })
    .then(r => r.json())
    .then(newReview => {
    const div = document.createElement('div')
    div.innerHTML = `
        <h2>${newReview.title}</h2>
        <p class='likes'>Content: ${newReview.content}</p>
        <h4>Playtime: ${newReview.playtime} Hours</h4>
        <p>${newReview.like} Likes</p>
        <h3>${newReview.rating} Rating</h3>
        ${globalLikeButton.textContent}  
        ${globalDislikeButton.textContent}
        ${globalDeleteButton.textContent}
    `
    gameReview.append(div)
    console.log(div);
    })
}

function handleGameSubmit(event) {
    event.preventDefault()
    const newGameTitle = event.target.title.value
    const newGameDescription = event.target.description.value
    const newGamePlatform = event.target.platform.value
    const newGameReleasedate = event.target.releasedate.value
    const newGameImage = event.target.image.value
    
    

    const newGame = {
        title: newGameTitle,
        description: newGameDescription,
        platform: newGamePlatform,
        release_date: newGameReleasedate,
        image: newGameImage, 
    }
    addGame(newGame)
    event.target.reset()
}

function addGame(newGame) {
fetch('http://localhost:3000/api/v1/games', {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newGame),
})
.then(response => response.json())
.then(newGameObj => {
  renderOneGame(newGameObj);
})
}

function handleDeleteButton(event) {
    if (event.target.matches('.delete-button')) {
        const id = event.target.dataset.id
        const div = event.target.closest('div')
        fetch(`http://localhost:3000/api/v1/reviews/${id}`,{
        method: 'DELETE',
        })
        .then(r => r.json())
        .then(() => {
            div.remove();
        })
    }
}

function handleConsole(event) {
    if (event.target.matches('#playstation')) {
        console.log(event.target.textContent)
        fetch('http://localhost:3000/api/v1/games')
        .then(response => response.json())
        .then(gameArray => {
            gameContainer.innerHTML = ""
            const h1 = document.createElement('h1')
            h1.textContent = 'Game List (Playstation)'
            gameContainer.append(h1)
            gameArray.forEach((game) => {
                
                if (game.platform === "Playstation") {
                    const li = document.createElement('li')
                    li.dataset.id = game.id
                    li.textContent = `${game.title}`

                    gameContainer.append(li)
                }
            })
        });
    }
    if (event.target.matches('#xbox')) {
        console.log(event.target.textContent)
        fetch('http://localhost:3000/api/v1/games')
        .then(response => response.json())
        .then(gameArray => {
            gameContainer.innerHTML = ""
            const h1 = document.createElement('h1')
            h1.textContent = 'Game List (Xbox)'
            gameContainer.append(h1)
            gameArray.forEach((game) => {
                
                if (game.platform === "Xbox") {
                    const li = document.createElement('li')
                    li.dataset.id = game.id
                    li.textContent = `${game.title}`

                    gameContainer.append(li)
                }
            })
        });
    }
    if (event.target.matches('#switch')) {
        console.log(event.target.textContent)
        fetch('http://localhost:3000/api/v1/games')
        .then(response => response.json())
        .then(gameArray => {
            gameContainer.innerHTML = ""
            const h1 = document.createElement('h1')
            h1.textContent = 'Game List (Switch)'
            gameContainer.append(h1)
            gameArray.forEach((game) => {
                
                if (game.platform === "Switch") {
                    const li = document.createElement('li')
                    li.dataset.id = game.id
                    li.textContent = `${game.title}`

                    gameContainer.append(li)
                }
            })
        });
    }
    if (event.target.matches('#pc')) {
        console.log(event.target.textContent)
        fetch('http://localhost:3000/api/v1/games')
        .then(response => response.json())
        .then(gameArray => {
            gameContainer.innerHTML = ""
            const h1 = document.createElement('h1')
            h1.textContent = 'Game List (PC)'
            gameContainer.append(h1)
            gameArray.forEach((game) => {
                
                if (game.platform === "PC") {
                    const li = document.createElement('li')
                    li.dataset.id = game.id
                    li.textContent = `${game.title}`

                    gameContainer.append(li)
                }
            })
        });
    }
}

function handlePageAbout (event) {
    if (event.target.matches ('#about')) {
    
}
}

function handleSortZToA (event) {
    if (event.target.matches('#sortZtoA')) {
        console.log('click')
        gameContainer.innerHTML = ""
        const h1 = document.createElement('h1')
        h1.textContent = 'Game List'
        gameContainer.append(h1)
        gameArray.sort(function(a, b) {
            let textA = a.title.toUpperCase();
            let textB = b.title.toUpperCase();
            return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
        });
        renderAllGames(gameArray)
    }
}

function handleSortAToZ(event) {
    if (event.target.matches('#sortAtoZ')) {
        gameContainer.innerHTML = ""
        const h1 = document.createElement('h1')
        h1.textContent = 'Game List'
        gameContainer.append(h1)
        console.log('click')
        gameArray.sort(function(a, b) {
            let textA = a.title.toUpperCase();
            let textB = b.title.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        
        renderAllGames(gameArray)
    }
 }

function handleToggle() {
    console.log("you clicked me")
    document.body.classList.toggle("dark-mode")
}

/****** Initialize *********/
getGames()