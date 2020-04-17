'use strict'

let pageNumber = 1;
const photoLimit = 20;
const urlPhoto = `https://jsonplaceholder.typicode.com/photos`;
const urlJson = `./json/photos.json`;
const urlComments = `https://jsonplaceholder.typicode.com/comments`;
let allPhotos = [];
let isLike = true;
const gallery = document.querySelector( '.main__gallery' );
const spinner = document.getElementById("spinner");

function getPhotos () {
    spinner.removeAttribute('hidden');
    fetch ( urlPhoto + `?_page=${ pageNumber }&_limit=${ photoLimit }` )
    .then ( response => response.json() )
    .catch((err) => {
        console.log(err)
        return getAllPhotos ()})
    .then( response => {
        spinner.setAttribute('hidden', '');
        renderGallery ( response );
        pageNumber += 1;
    } );
};
function getAllPhotos () {
    return fetch( urlJson )
    .then( response => response.json() )
    .then( response => {
        allPhotos = response;
        console.log(allPhotos)
    } )
    .then ( res => getJson()  )
};


function getJson (  ) {
    let items = allPhotos.slice( ( ( pageNumber - 1 ) * photoLimit ), ( pageNumber * photoLimit ) );
    // renderGallery ( items );
    // pageNumber += 1;
    return items;
};

function renderGallery ( response ) {
    response.forEach( element => renderPhoto ( element ) );

};

function  renderPhoto ( photoItem ) {
    const photoElement = document.createElement( 'div' );
    photoElement.classList.add( 'photo' );
    photoElement.innerHTML = `<img class="photo__image" 
                                    data-photo-id="${ photoItem.id }" 
                                    src="${ photoItem.thumbnailUrl }" 
                                    alt="${ photoItem.title }">`;
    gallery.insertAdjacentElement( 'beforeend', photoElement );
};

function showMorePhoto () {
    const mainButton = document.querySelector( '.main__button' );
    mainButton.addEventListener( 'click', getPhotos );
};

function addEvent () {
    gallery.addEventListener( 'click', (e) => {
        if ( e.target.classList.contains( 'photo__image' ) ) {
            showLightbox( e.target );
        }
    } )
};

function showLightbox ( elem ) {
    document.querySelector( 'body' ).classList.add( 'lock' );
    document.querySelector( '.blackout' ).classList.remove( 'invisible' );
    spinner.removeAttribute('hidden');
    fetch( urlPhoto + `?id=${ elem.dataset.photoId }` )
        .then( res =>  res.json() )
        .catch((err) => {
            console.log(err)
            let photo = allPhotos.find( ( item ) => item.id == elem.dataset.photoId )
            return [photo];
        } )
        .then( el => {
            console.log(el)
            spinner.setAttribute('hidden', '');
            document.querySelector( '.lightbox__photo' ).innerHTML = `<img class="photo__image" 
                                                                        data-photo-id="${ el[0].id }" 
                                                                        src="${ el[0].url }" 
                                                                        alt="${ el[0].title }">`;
        } );
    fetch( urlComments + `?postId=${ getPost ( elem.dataset.photoId) }` )
        .then( res => res.json() )
        .then( res => {
            showComments ( res );
        } ) ;

    addLike ();    

    document.querySelector( '.lightbox__close' ).addEventListener( 'click', ( e ) => {
        if ( e.target.closest( '.lightbox__close' ) ) {
            closeLightbox ()
        };
    } );
    document.querySelector( '.blackout' ).addEventListener( 'click', ( e ) => {
        if ( e.target.classList.contains( 'blackout' ) ) {
            closeLightbox ()
        };
    } );
    addPost();
};

function closeLightbox () {
    document.querySelector( '.blackout' ).classList.add( 'invisible' );
    document.querySelector( 'body' ).classList.remove( 'lock' );
    document.querySelector( '.lightbox__comments' ).innerHTML = '';
    document.querySelector( '.lightbox__photo' ).innerHTML = '';
};

function getPost ( id ) {

    let post = 1;
    if ( id > 0 && id <= 100 ) {
        post = +id;
    } else if ( id > 100 && id < 1000 ) {
        post = id % 100;
    } else if ( id > 1000 ) {
        post = +( id + '' ).split( '' ).splice( 2, 2 ).join('');
    }
    return post;
};

function showComments ( comments ) {
    const boxComments = document.querySelector( '.lightbox__comments' );
    comments.forEach( elem => {
        const post = document.createElement( 'div' );
        post.classList.add( 'lightbox__post' );
        post.innerHTML = `<div class="lightbox__avatar" >
                                <img src="https://via.placeholder.com/40" alt="Avatar">
                            </div>
                            <div>
                                <div class="lightbox__name" >
                                    ${ elem.email }
                                </div>
                                <div class="lightbox__text" >
                                    ${elem.body} 
                                </div>
                            </div>`;
        boxComments.insertAdjacentElement( 'beforeend', post );
    } )
};

function addPost () {
    document.querySelector( '.textarea__control' ).addEventListener( 'click', ( event ) => {
        document.querySelector( '.textarea' ).classList.remove( 'invisible' );
        document.querySelector( '.textarea__write' ).classList.add( 'invisible' );
        document.querySelector( '.textarea__button' ).classList.remove( 'invisible' );
        document.querySelector( '.textarea__send' ).addEventListener( 'click', ( event ) => {
            if ( !( document.querySelector( '.textarea__field' ).value === '' ) ) {
                const newPost = [
                    {
                        email: "Your@name.info",
                        body: '',
                    }
                ];
                console.log( document.querySelector( '.textarea__field' ).value )
                newPost[ 0 ].body = document.querySelector( '.textarea__field' ).value;
                showComments ( newPost )
                cancelComment ()
                event.stopImmediatePropagation();
            }
        } );
        document.querySelector( '.textarea__cancel' ).addEventListener( 'click', ( event ) => {
            cancelComment ()
            event.stopImmediatePropagation();
        } );
    } );
};

function cancelComment () {
    document.querySelector( '.textarea__field' ).value = '';
    document.querySelector( '.textarea' ).classList.add( 'invisible' );
    document.querySelector( '.textarea__button' ).classList.add( 'invisible' );
    document.querySelector( '.textarea__write' ).classList.remove( 'invisible' );
}

function addLike () {
    document.querySelector( '.lightbox__likes' ).addEventListener( 'click', ( event ) => {
        const likesCount = +(document.querySelector( '.lightbox__likes-count' ).textContent);
        if ( isLike ) {
            document.querySelector( '.lightbox__likes-count' ).textContent = likesCount - 1;
            isLike = false;
            event.stopImmediatePropagation();
        } else {
            document.querySelector( '.lightbox__likes-count' ).textContent= likesCount + 1;
            isLike = true;
            event.stopImmediatePropagation();
        }

    } )
};

// getAllPhotos ();
getPhotos();
showMorePhoto ();
addEvent ()

