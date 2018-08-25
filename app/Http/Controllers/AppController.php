<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppController extends Controller
{
    public function showHomepage() {
        return view('app');
    }

    public function setup() {

        if(request()->has('country')) {
            $country = request()->input('country');
        } else {
            //trying to get country from IP Address
            $country = $this->getCountryFromIPAddress();
        }

        //If country cannot be determined from IP lookup
        if(!$country)
            return '{"status": "countryLookupFailed"}';

        return '{"settings" : {"countries": "'. $country .'"}}';
        
    }

    public function geocodePosition() {
        $latitude = request()->input('latitude');
        $longitude = request()->input('longitude');
        if(!$latitude || !$longitude)
            return '{"status": "Position data insufficient"}';
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://maps.googleapis.com/maps/api/geocode/json?latlng={$latitude},{$longitude}&key=". config('constant.GEOCODING_API_KEY'));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $geocodingData = curl_exec($ch);
        curl_close($ch);
        
        if(!$geocodingData)
            return '{"status": "Unable to get data from Google Geocoding API"}';;

        $geocodingData = json_decode($geocodingData);

        if($geocodingData->status != 'OK' || !$geocodingData->results[0])
            return '{"status": "Invalid data sent by Google Geocoding API"}';;

        foreach ($geocodingData->results[0]->address_components as $addressComponent) {
            if(in_array('country', $addressComponent->types)) {
                return $addressComponent->short_name;
            }
        }
    }

    public function getCountryFromIPAddress() {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://ipinfo.io/'. request()->ip() .'/country?token='. config('constant.IPINFO_API_KEY'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $country = curl_exec($ch);
        curl_close($ch);
        return $country;
    }
}
