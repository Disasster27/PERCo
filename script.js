'use strict'

let pageNumber = 1;
const photoLimit = 20;
const urlPhoto = `https://jsonplaceholder.typicode.com/photos`;
const urlComments = `https://jsonplaceholder.typicode.com/comments`;
let isLike = true;
const gallery = document.querySelector( '.main__gallery' );
const spinner = document.getElementById("spinner");

/**
 *  @description Получение порции изображений с сервера.
*/
function getPhotos () {
    spinner.removeAttribute('hidden');
    const promise = getData(urlPhoto, pageNumber, photoLimit );
    promise.then( response => {
        renderGallery ( response );
        pageNumber += 1;
        spinner.setAttribute('hidden', '');
    } ) 
}

/**
 * @description Отрисовка полученной порции изображений.
 * @param { array } response Массив полученных изображений.
*/
function renderGallery ( response ) {
    response.forEach( element => renderPhoto ( element ) );
};

/**
 * @description Отрисовка каждого конкретного изображения.
 * @param { object } photoItem Объект с информацией об изображении.
*/
function  renderPhoto ( photoItem ) {
    const photoElement = document.createElement( 'div' );
    photoElement.classList.add( 'photo' );
    photoElement.innerHTML = `<img class="photo__image" 
                                    data-photo-id="${ photoItem.id }" 
                                    src="${ photoItem.thumbnailUrl }" 
                                    alt="${ photoItem.title }">`;
    gallery.insertAdjacentElement( 'beforeend', photoElement );
};

/**
 * @description Навешивание события о загрузке очередной порции изображений с сервера при нажатии на кнопку.
*/
function showMorePhoto () {
    const mainButton = document.querySelector( '.main__button' );
    mainButton.addEventListener( 'click', getPhotos );
};

/**
 * @description Установка события на каждое изображение об загрузке его в лайтбоксею
*/
function addEvent () {
    gallery.addEventListener( 'click', (e) => {
        if ( e.target.classList.contains( 'photo__image' ) ) {
            showLightbox( e.target );
        }
    } )
};

/**
 * @description Отображение лайтбокса с изображением.
 * @param elem HTML-елемент изображения.
*/
function showLightbox ( elem ) {
    document.querySelector( 'body' ).classList.add( 'lock' );
    document.querySelector( '.blackout' ).classList.remove( 'invisible' );
    document.querySelector( '.lightbox__photo' ).innerHTML = '<div id="spinner"></div>'
    const elemId = elem.dataset.photoId;
    const photoPromise = getLargePhoto ( urlPhoto, elemId );
    photoPromise.then( response => {
        document.querySelector( '.lightbox__photo' )
            .innerHTML = `<img class="photo__image" 
                            data-photo-id="${ response[0].id }" 
                            src="${ response[0].url }" 
                            alt="${ response[0].title }">`;
    } )
    const postId = getPost ( +elem.dataset.photoId );
    const commentsPromise = getComments ( urlComments, postId );
    commentsPromise.then( response => showComments ( response ) );
    
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
    showNextImg( elem );
    showPrevImg ( elem );
    addLike ();
    addPost();
};

/**
 * @description
 * @param 
*/
function showNextImg ( elem ) {
    document.querySelector( '.lightbox__next' ).onclick = function () {
        document.querySelector( '.lightbox__comments' ).innerHTML = '';
        document.querySelector( '.lightbox__photo' ).innerHTML = '';
        showLightbox ( elem.closest( '.photo' ).nextElementSibling.firstChild )
    };
};

function showPrevImg ( elem ) {
    document.querySelector( '.lightbox__prev' ).onclick = function () {
        document.querySelector( '.lightbox__comments' ).innerHTML = '';
        document.querySelector( '.lightbox__photo' ).innerHTML = '';
        showLightbox ( elem.closest( '.photo' ).previousElementSibling.firstChild )
    };
};

/**
 * @description Закрытие лайтбокса.
*/
function closeLightbox () {
    document.querySelector( '.blackout' ).classList.add( 'invisible' );
    document.querySelector( 'body' ).classList.remove( 'lock' );
    document.querySelector( '.lightbox__comments' ).innerHTML = '';
    document.querySelector( '.lightbox__photo' ).innerHTML = '';
    cancelComment ();
};

/**
 * @description Получение ID поста для отобржения комментариев к этому посту.
 * @param { number } id ID выбранного изображения.
 * @returns { number }  ID поста.
*/
function getPost ( id ) {
    console.log(id)
    let post = 1;
    if ( id > 0 && id <= 100 ) {
        post = id;
    } else if ( id > 100 && id < 1000 ) {
        post = id % 100;
    } else if ( id > 1000 ) {
        post = +( id + '' ).split( '' ).splice( 2, 2 ).join('');
    }
    return post;
};

/**
 * @description Отрисовка комментариев к изображению.
 * @param { array } comments Массив объектов с инфо о комментариях.
*/
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

/**
 * @description Написание комментария.
*/
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

/**
 * @description Отмена ввода комментария.
*/
function cancelComment () {
    document.querySelector( '.textarea__field' ).value = '';
    document.querySelector( '.textarea' ).classList.add( 'invisible' );
    document.querySelector( '.textarea__button' ).classList.add( 'invisible' );
    document.querySelector( '.textarea__write' ).classList.remove( 'invisible' );
};

/**
 * @description Добавление/удаление лайка
*/
function addLike () {
    document.querySelector( '.lightbox__likes' ).addEventListener( 'click', ( event ) => {
        const likesCount = +(document.querySelector( '.lightbox__likes-count' ).textContent);
        if ( isLike ) {
            document.querySelector( '.lightbox__likes' ).style = 'color: darkgrey';
            document.querySelector( '.lightbox__likes-count' ).textContent = likesCount - 1;
            isLike = false;
            event.stopImmediatePropagation();
        } else {
            document.querySelector( '.lightbox__likes' ).style = 'color: #FF6D60';
            document.querySelector( '.lightbox__likes-count' ).textContent= likesCount + 1;
            isLike = true;
            event.stopImmediatePropagation();
        };
    } );
};

// getPhotos();
showMorePhoto ();
addEvent ();

