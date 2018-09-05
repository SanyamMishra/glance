<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AppController extends Controller
{
    public function showHomepage() {
        return view('app');
    }

    public function showPrivacyPolicy() {
        return view('privacyPolicy');
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
            return responseStatus('Country lookup failed', 'LocationError');

        if(!$this->countrySupported($country))
            return responseStatus('Country not supported - '. $country, 'LocationError');

        //returning new settings file
        return jsonData([
            'sources' => [],
            'countries' => [strtolower($country)]
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
                $country = $addressComponent->short_name;
        
                if(!$this->countrySupported($country))
                    return responseStatus('Country not supported - '. $country, 'LocationError');

                //returning new settings file
                return jsonData([
                    'sources' => [],
                    'countries' => [strtolower($country)]
                ]);
            }
        }
    }

    private function getCountryFromIPAddress() {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://ipinfo.io/'. request()->ip() .'/country?token='. config('constant.IPINFO_API_KEY'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $country = curl_exec($ch);
        curl_close($ch);
        return trim($country);
    }

    private function countrySupported($country) {
        if(DB::table('supported_countries')->where('short_name', $country)->first())
            return true;
        else return false;
    }

    public function getSupportedCountriesAndSources() {
        $supportedCountries = $this->getSupportedCountries();
        $sources = $this->getSources();

        return jsonData([
            'supportedCountries' => $supportedCountries,
            'sources' => $sources
        ]);
    }

    private function getSupportedCountries() {
        $supportedCountries = DB::table('supported_countries')->get();
        
        if($supportedCountries->count())
            return $supportedCountries;
        
        return responseStatus('Cannot fetch supported countries from the server', 'APIError');
    }

    private function getSources() {
        $sources = DB::table('sources')->get();
        if($sources->count())
            return $sources;

        // $sources = $this->getSourcesFromAPI();

        // if(!$sources)
        return responseStatus('Cannot fetch sources from the server', 'APIError');

        // $this->updateSourcesTable($sources);

        // return jsonData([
        //     'sources' => $sources
        // ]);

    }

    // private function getSourcesFromAPI() {
    //     $url = 'http://newsapi.org/v2/sources?apiKey='.config('constant.NEWS_API_KEY');
    //     $ch = curl_init();
    //     curl_setopt($ch, CURLOPT_URL, $url);
    //     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //     $sources = json_decode(curl_exec($ch));
    //     curl_close($ch);
        
    //     if($sources->status == 'error')
    //         return null;

    //     return $sources->sources;
    // }

    // private function updateSourcesTable($sources) {
    //     DB::table('sources')->truncate();
    //     foreach($sources as $source) {
    //         DB::table('sources')->insert([
    //             'id' => $source->id,
    //             'name' => $source->name,
    //             'description' => $source->description,
    //             'url' => $source->url,
    //             'category' => $source->category,
    //             'language' => $source->language,
    //             'country_short_name' => $source->country,
    //             'country_full_name' => $source->country
    //         ]);
    //     }
    // }
}
