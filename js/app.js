/**
 * WEB222 – Assignment 04
 *
 * I declare that this assignment is my own work in accordance with
 * Seneca Academic Policy. No part of this assignment has been
 * copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Please update the following with your information:
 *
 *      Name:       Duong Truong Phuc Nguyen
 *      Student ID: 276712230
 *      Date:       NOV-01-2024
 */

// All of our data is available on the global `window` object.
// Create local variables to work with it in this file.
const { artists, songs } = window;

// For debugging, display all of our data in the console. You can remove this later.
console.log({ artists, songs }, "App Data");

// event handler to run when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Loading...Wait a minute!"); // log the loading when the page is loading

    artistButton();
    if (window.artists.length > 0) {
        displaySongs(window.artists[0].artistId);
    }
});

function artistButton() {
    const menu = document.querySelector('#menu'); // find element of menu in DOM

    console.log("Generating the artist buttons...Wait a minute!"); // log the process of generating button

    window.artists.forEach(artist => {
        const button = document.createElement('button'); // create new DOM elements
        button.classList.add('artist-button'); // add the artist button for BONUS

        const artistImage = document.createElement('img');
        artistImage.src = artist.image // use the URL image
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

        button.addEventListener('click', () => 
            {console.log({clickArtist: artist}); // log the artist clicked to the function
        displaySongs(artist.artistId)}); 

        menu.appendChild(button); // append button to menu
    });

    console.log({totalOfArtists: window.artists.length}); // log the total of artist to the function
}

function displaySongs(artistId) {
    console.log({artistId}); // log the ID artist to the function

    // find algorithm
    const artist = window.artists.find(a => a.artistId === artistId);
    console.log({selectArtist: artist}); // log the artist to the function

    const selectArtist = document.querySelector('#select-artist'); // find element of selected artist in DOM
    selectArtist.textContent = artist.name;

    const socialLink = document.querySelector('#socialLink'); // find element of social link in DOM
    socialLink.innerHTML = '';

    console.log({socialLink: artist.urls}); // log the URL to the function

    artist.urls.forEach(link => {
        const anchorElement = document.createElement('a');  // create new DOM elements
        anchorElement.href = link.url; // set the URL
        anchorElement.target = "_blank"; // open link in new tab
 
        const logoImage = document.createElement('img');
        logoImage.src = link.logo;
        logoImage.alt = link.name;
        logoImage.style.width = "30px";
        logoImage.style.height = "30px";


        anchorElement.appendChild(logoImage); // append the logoImage to anchorElement
        socialLink.appendChild(anchorElement); // append the anchorElement to the socialLink
        socialLink.appendChild(document.createTextNode('   ')); // | to space between 2 links for beautiful
    });

    const tableBody = document.querySelector('#songs'); // find element of songs in DOM
    tableBody.innerHTML = ''; 

    const artistSong = window.songs.filter(song => song.artistId === artistId && !song.explicit);

    console.log({filterSong: artistSong}); // log the filter of list song to the function

    artistSong.forEach(song => {
        console.log({dataSong: song}); // log the data song to the function
        const row = document.createElement('tr'); // create new DOM elements
        row.addEventListener('click', () => { 
            console.log({ song });
        });

        const titleCell = document.createElement('td'); // create new DOM elements
        const titleLink = document.createElement('a'); // create new DOM elements
        titleLink.href = song.url; // set the URL
        titleLink.target = "_blank"; // open link in new tab
        titleLink.textContent = song.title; // set the text link
        titleCell.appendChild(titleLink); // append the titleLink (<a>)to titleCell (<td>)

        const albumCell = document.createElement('td'); // create new DOM elements
        albumCell.textContent = song.album;

        const yearCell = document.createElement('td'); // create new DOM elements
        yearCell.textContent = song.year; 

        const durationCell = document.createElement('td'); // create new DOM elements
        const mm = Math.floor(song.duration / 60); 
        const ss = song.duration % 60 < 10 ? `0${song.duration % 60}` : song.duration % 60;
        durationCell.textContent = `${mm}:${ss}`; 

        // append respectively each cell to row
        row.appendChild(titleCell);
        row.appendChild(albumCell);
        row.appendChild(yearCell);
        row.appendChild(durationCell);

        tableBody.appendChild(row);
    });
}
