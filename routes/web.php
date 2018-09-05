<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'AppController@showHomepage');
Route::get('/privacy-policy', 'AppController@showPrivacyPolicy');


Route::post('/api/setup', 'AppController@setup');
Route::post('/api/geocodePosition', 'AppController@geocodePosition');
Route::post('/api/getSupportedCountriesAndSources', 'AppController@getSupportedCountriesAndSources');

Route::post('/api/fetchNews', 'NewsController@fetchNews');
Route::post('/api/search', 'NewsController@search');