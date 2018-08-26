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
            return responseStatus('countryLookupFailed', 'LocationError');

        //returning new settings file
        return jsonData([
            'countries' => [$country]
        ]);
        
    }

    public function geocodePosition() {
        $latitude = request()->input('latitude');
        $longitude = request()->input('longitude');
        if(!$latitude || !$longitude)
            return responseStatus('Location data insufficient', 'InsufficientParametersError');
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://maps.googleapis.com/maps/api/geocode/json?latlng={$latitude},{$longitude}&key=". config('constant.GEOCODING_API_KEY'));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $geocodingData = curl_exec($ch);
        curl_close($ch);
        
        if(!$geocodingData)
            return responseStatus('Unable to get data from Google Geocoding API', 'LocationError');

        $geocodingData = json_decode($geocodingData);

        if($geocodingData->status != 'OK' || !$geocodingData->results[0])
            return responseStatus('Invalid data sent by Google Geocoding API', 'LocationError');

        foreach ($geocodingData->results[0]->address_components as $addressComponent) {
            if(in_array('country', $addressComponent->types)) {
                //returning new settings file
                return jsonData([
                    'countries' => [$addressComponent->short_name]
                ]);
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
        return trim($country);
    }
}
