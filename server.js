'use strict'

const urlJson = `./json/photos.json`;
let allPhotos = [];

function getData ( url, pageNumber, photoLimit ) {
    return fetch ( url + `?_page=${ pageNumber }&_limit=${ photoLimit }` )
    .then ( response => response.json() )
    .catch((err) => {
        console.log(err);
        return getAllPhotos ();
    });
};

function getAllPhotos () {
    return fetch( urlJson )
    .then( response => response.json() )
    .then( response => {
        allPhotos = response;
    } )
    .then ( res => getJson()  );
};

function getJson (  ) {
    let items = allPhotos.slice( ( ( pageNumber - 1 ) * photoLimit ), ( pageNumber * photoLimit ) );
    return items;
};

function getLargePhoto ( url, id ) {
    return fetch( url + `?id=${ id }` )
        .then( response =>  response.json() )
        .catch( ( err ) => {
            let photo = allPhotos.find( ( item ) => item.id == id );
            return [photo];
        } );
};

function getComments ( url, postId ) {
    return fetch( url + `?postId=${ postId }` )
    .then( response => response.json() );
};



