'use strict'

const urlJson = `./json/photos.json`;
let allPhotos = [];

/**
 * @description Загрузка изображений с сервера.В случае ошибки, из файла.
 * @param { string } url Адрес сервера.
 * @param { number } pageNumber Номер страницы.
 * @param { number } photoLimit Лимит изображений загружаемых за раз.
 * @returns { array } Массив объектов. 
*/
function getData ( url, pageNumber, photoLimit ) {
    return fetch ( url + `?_page=${ pageNumber }&_limit=${ photoLimit }` )
    .then ( response => response.json() )
    .catch((err) => {
        console.log(err);
        return getAllPhotos ( urlJson, pageNumber, photoLimit );
    });
};

/**
 * @description Загрузка всех изображений из файла.Сохранение их в массив.
 * @param { string } url Путь до файла json.
 * @param { number } pageNumber Номер страницы.
 * @param { number } photoLimit Лимит изображений загружаемых за раз.
 * @returns { array } Массив объектов.
*/
function getAllPhotos ( url, pageNumber, photoLimit ) {
    return fetch( url )
    .then( response => response.json() )
    .then( response => {
        allPhotos = response;
    } )
    .then ( res => getJson( pageNumber, photoLimit )  );
};

/**
 * @description Получение порции изображений из массива загруженных.
 * @param { number } pageNumber Номер страницы.
 * @param { number } photoLimit Лимит изображений загружаемых за раз.
 * @returns { Array } Массив объектов.  
*/
function getJson ( pageNumber, photoLimit ) {
    let items = allPhotos.slice( ( ( pageNumber - 1 ) * photoLimit ), ( pageNumber * photoLimit ) );
    return items;
};


/**
 * @description Загрузка с сервера полноразмерного изображения.В случае ошибки запроса, ищится в массиве.
 * @param { string } url Адрес сервера.
 * @param { number } id ID изображения.
 * @returns { array } Массив с объектом с инфо об изображении.
*/
function getLargePhoto ( url, id ) {
    return fetch( url + `?id=${ id }` )
        .then( response =>  response.json() )
        .catch( ( err ) => {
            let photo = allPhotos.find( ( item ) => item.id == id );
            return [photo];
        } );
};

/**
 * @description Загрузка комментариев с сервера.
 * @param { string } url Адрес сервера.
 * @param { number } postId ID поста.
 *  @returns { array } Массив объектов.
*/
function getComments ( url, postId ) {
    return fetch( url + `?postId=${ postId }` )
    .then( response => response.json() );
};



