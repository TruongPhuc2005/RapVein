// All of our data is available on the global `window` object.
const { artists, songs } = window;

console.log({ artists, songs }, "App Data");

let currentArtistIndex = 0;  
const artistsPerPage = 8; 
let currentArtistId = null;  // Track the currently selected artist ID

let sortState = {
    song: 'asc', 
    album: 'asc',
    year: 'asc',
    duration: 'asc'
};

document.addEventListener('DOMContentLoaded', function() {
    displayArtists();  
    if (window.artists.length > 0) {
        displaySongs(window.artists[0].artistId);
    }

    const nextButton = document.querySelector('#nextButton');
    if (nextButton) {
        nextButton.addEventListener('click', handleNextClick);
    }

    const backButton = document.querySelector('#backButton');
    if (backButton) {
        backButton.addEventListener('click', handleBackClick);
    }

    // Add sorting event listeners to each column button
    document.querySelector('#song-sort-button').addEventListener('click', () => sortSongs('song'));
    document.querySelector('#album-sort-button').addEventListener('click', () => sortSongs('album'));
    document.querySelector('#year-sort-button').addEventListener('click', () => sortSongs('year'));
    document.querySelector('#duration-sort-button').addEventListener('click', () => sortSongs('duration'));
});

function displayArtists() {
    const menu = document.querySelector('#menu');
    menu.innerHTML = '';  

    const artistsToShow = window.artists.slice(currentArtistIndex, currentArtistIndex + artistsPerPage);

    artistsToShow.forEach(artist => {
        const button = document.createElement('button');
        button.classList.add('artist-button');

        const artistImage = document.createElement('img');
        artistImage.src = artist.image;
        artistImage.alt = artist.name;
        artistImage.classList.add('artist-image');

        artistImage.style.width = '150px';
        artistImage.style.height = '150px';
        artistImage.style.objectFit = 'cover';
        artistImage.style.borderRadius = '50px';
        artistImage.style.border = '5px solid #555';
        artistImage.style.margin = '0 auto';

        button.appendChild(artistImage);

        button.addEventListener('click', () => {
            displaySongs(artist.artistId);
        });

        menu.appendChild(button);
    });
}

function handleNextClick() {
    currentArtistIndex += artistsPerPage;

    if (currentArtistIndex >= window.artists.length) {
        currentArtistIndex = 0;  
    }

    displayArtists();
}

function handleBackClick() {
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
    currentArtistId = artistId;  // Set the currently selected artist ID
    const artist = window.artists.find(a => a.artistId === artistId);
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

    let artistSongs = window.songs.filter(song => song.artistId === currentArtistId && !song.explicit);

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
