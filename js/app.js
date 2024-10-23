// All of our data is available on the global `window` object.
// Create local variables to work with it in this file.
const { artists, songs } = window;

// For debugging, display all of our data in the console. You can remove this later.
console.log({ artists, songs }, "App Data");

// Pagination variables
let currentArtistIndex = 0;  
const artistsPerPage = 8; 

let sortState = {
    song: 'asc', 
    album: 'asc',
    year: 'asc',
    duration: 'asc'
};

// event handler to run when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Loading...Wait a minute!"); // log the loading when the page is loading

    displayArtists();  // Display initial set of artists
    if (window.artists.length > 0) {
        displaySongs(window.artists[0].artistId);
    }

    // Add the event listener for the next button
    const nextButton = document.querySelector('#nextButton');
    if (nextButton) {
        nextButton.addEventListener('click', handleNextClick);
    }

    // Add the event listener for the back button
    const backButton = document.querySelector('#backButton');
    if (backButton) {
        backButton.addEventListener('click', handleBackClick);
    }

    // Add sorting functionality to buttons in each column
    document.querySelector('#song-sort-button').addEventListener('click', () => sortSongs('song'));
    document.querySelector('#album-sort-button').addEventListener('click', () => sortSongs('album'));
    document.querySelector('#year-sort-button').addEventListener('click', () => sortSongs('year'));
    document.querySelector('#duration-sort-button').addEventListener('click', () => sortSongs('duration'));
});

function displayArtists() {
    const menu = document.querySelector('#menu'); // find element of menu in DOM
    menu.innerHTML = '';  // Clear existing artists

    console.log("Generating the artist buttons...Wait a minute!"); // log the process of generating button

    const artistsToShow = window.artists.slice(currentArtistIndex, currentArtistIndex + artistsPerPage);

    artistsToShow.forEach(artist => {
        const button = document.createElement('button'); // create new DOM elements
        button.classList.add('artist-button'); // add the artist button for BONUS

        const artistImage = document.createElement('img');
        artistImage.src = artist.image; // use the URL image
        artistImage.alt = artist.name; // add alternative text
        artistImage.classList.add('artist=image');

        // set the styles for the image artist for BONUS
        artistImage.style.width = '150px';  // set width 
        artistImage.style.height = '150px'; // set height 
        artistImage.style.objectFit = 'cover'; // keep the image normal
        artistImage.style.borderRadius = '50px'; // add rounded corner for beautiful
        artistImage.style.border = '5px solid #555'; // a thin border around picture for beautiful
        artistImage.style.margin = '0 auto'; // align center 

        button.appendChild(artistImage);

        button.addEventListener('click', () => {
            console.log({ clickArtist: artist }); // log the artist clicked to the function
            displaySongs(artist.artistId);
        });

        menu.appendChild(button); // append button to menu
    });

    console.log({ totalOfArtists: window.artists.length }); // log the total of artist to the function
}

function handleNextClick() {
    console.log("Next button clicked");

    currentArtistIndex += artistsPerPage;

    if (currentArtistIndex >= window.artists.length) {
        currentArtistIndex = 0;  
    }

    displayArtists();
}

function handleBackClick() {
    console.log("Back button clicked");

    currentArtistIndex -= artistsPerPage;

    if (currentArtistIndex < 0) {
        currentArtistIndex = window.artists.length - artistsPerPage; 
        if (currentArtistIndex < 0) {
            currentArtistIndex = 0;  
        }
    }

    displayArtists();
}

function displaySongs(artistId) {
    console.log({ artistId });

    const artist = window.artists.find(a => a.artistId === artistId);
    console.log({ selectArtist: artist });

    const selectArtist = document.querySelector('#select-artist');
    selectArtist.textContent = artist.name;

    const socialLink = document.querySelector('#socialLink');
    socialLink.innerHTML = '';

    artist.urls.forEach(link => {
        const anchorElement = document.createElement('a');
        anchorElement.href = link.url;
        anchorElement.target = "_blank";

        const logoImage = document.createElement('img');
        logoImage.src = link.logo;
        logoImage.alt = link.name;
        logoImage.style.width = "30px";
        logoImage.style.height = "30px";

        anchorElement.appendChild(logoImage);
        socialLink.appendChild(anchorElement);
        socialLink.appendChild(document.createTextNode(' '));
    });

    let artistSongs = window.songs.filter(song => song.artistId === artistId && !song.explicit);
    console.log({ filterSong: artistSongs });

    const tableBody = document.querySelector('#songs');
    tableBody.innerHTML = '';

    artistSongs.forEach(song => {
        createSongRow(song, tableBody);
    });
}

function createSongRow(song, tableBody) {
    const row = document.createElement('tr');
    row.addEventListener('click', () => {
        console.log({ song });
    });

    const titleCell = document.createElement('td');
    const titleLink = document.createElement('a');
    titleLink.href = song.url;
    titleLink.target = "_blank";
    titleLink.textContent = song.title;
    titleCell.appendChild(titleLink);

    const albumCell = document.createElement('td');
    albumCell.textContent = song.album;

    const yearCell = document.createElement('td');
    yearCell.textContent = song.year;

    const durationCell = document.createElement('td');
    const mm = Math.floor(song.duration / 60);
    const ss = song.duration % 60 < 10 ? `0${song.duration % 60}` : song.duration % 60;
    durationCell.textContent = `${mm}:${ss}`;

    row.appendChild(titleCell);
    row.appendChild(albumCell);
    row.appendChild(yearCell);
    row.appendChild(durationCell);

    tableBody.appendChild(row);
}

function sortSongs(column) {
    sortState[column] = sortState[column] === 'asc' ? 'desc' : 'asc';

    let artistId = window.artists[currentArtistIndex].artistId;
    let artistSongs = window.songs.filter(song => song.artistId === artistId && !song.explicit);

    artistSongs.sort((a, b) => {
        if (column === 'song') {
            return sortState[column] === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (column === 'album') {
            return sortState[column] === 'asc' ? a.album.localeCompare(b.album) : b.album.localeCompare(a.album);
        } else if (column === 'year') {
            return sortState[column] === 'asc' ? a.year - b.year : b.year - a.year;
        } else if (column === 'duration') {
            return sortState[column] === 'asc' ? a.duration - b.duration : b.duration - a.duration;
        }
    });

    const tableBody = document.querySelector('#songs');
    tableBody.innerHTML = '';
    artistSongs.forEach(song => {
        createSongRow(song, tableBody);
    });
}
