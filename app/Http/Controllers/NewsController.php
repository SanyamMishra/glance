<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NewsController extends Controller
{
  public function getNews() {
    $country = null;

    //checking if user has no settings
    if(!request()->input('settings')) {
      //fetching country from IP address
      
      if(!$country) return '{"status": "countryNotFound"}';
    }

    //1) find if these countries are in our list
    //2) make query according to all settings
    //3) send data of all articles back to client

    
  }
}
