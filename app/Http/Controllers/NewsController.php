<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class NewsController extends Controller
{
  //api function to send news feed data
  public function fetchNews() {
    
    //if settings no provided then abort
    $settings = request()->all();
    if(!$settings) return responseStatus('No settings to fetch news', 'InsufficientParametersError');

    //Array to contain arrays of articles from different sources based on settings
    //Each sub array to contain all the articles from particular source
    $articlesByOptions = [];

    //fetch news by countries present in the settings
    $this->fetchNewsByCountries($articlesByOptions);

    //fetch news by sources present in the settings
    $this->fetchNewsBySources($articlesByOptions);

    //mix news from all sources to form a uniform news feed
    return $this->mixAllNews($articlesByOptions);
  }

  //function to fetch latest news of all the countries from database
  private function fetchNewsByCountries(&$articlesByOptions) {

    foreach(request()->input('countries') as $country) {
      $newsByCountry = DB::table('news_by_country')->where('name', $country)->first();
      
      //if news feed does not exist in the database then update table with news feed
      if(!$newsByCountry) {
        $newsByCountry = $this->updateNewsByCountryTable($country);
      } else {
        //if news feed already exist then check if its expired or not
        //if expired then update table with latest news feed
        $updatedAt = new Carbon($newsByCountry->updated_at);
        $now = new Carbon();
        if($updatedAt->addMinutes(60)->lt($now)) {
          $newsByCountry = $this->updateNewsByCountryTable($country);
        }
      }

      //push the array containing all the articles from this country to main array
      // array_push($articlesByOptions, json_decode($newsByCountry->articles));
      $articlesByOptions[$newsByCountry->name] = json_decode($newsByCountry->articles);
    }

  }

  //function to update news_by_country table with latest news feed
  private function updateNewsByCountryTable($country) {
    $query = 'country='. $country;
    //fetch news from newsapi.org
    $articles = $this->fetchNewsFromAPI($query);

    //check if news already exist for this country
    $newsByCountry = DB::table('news_by_country')->where('name', $country)->first();
    
    //if not then insert new record
    if(!$newsByCountry)
      DB::table('news_by_country')->insert([
        'name' => $country,
        'articles' => json_encode($articles)
      ]);
    
    //else update the existing record
    else
      DB::table('news_by_country')
        ->where('name', $country)
        ->update([
          'articles' => json_encode($articles),
          'updated_at' => Carbon::now()
        ]);

    //return the update news feed
    return DB::table('news_by_country')->where('name', $country)->first();
  }

  //function to fetch news from newsapi.org
  private function fetchNewsFromAPI($query, $endpoint = 'top-headlines', $totalResults = null) {
    $response = [];
    $pageNum = 1;
    $pageSize = 100;
    while(true) {
      
      $url = 'http://newsapi.org/v2/'.$endpoint.'?'.$query.'&pageSize='.$pageSize.'&page='.$pageNum.'&apiKey='.config('constant.NEWS_API_KEY');
      // if($endpoint == 'everything')
      //   return jsonData([
      //     'url' => $url
      //   ]);
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      $pageResponse = curl_exec($ch);
      curl_close($ch);

      $pageResponse = json_decode($pageResponse);
      
      if($pageResponse->status != 'ok') break;
        
      $response = array_merge($response, $pageResponse->articles);

      if(!$totalResults) $totalResults = $pageResponse->totalResults;
      
      if($pageSize * $pageNum >= $totalResults) break;
      
      $pageNum++;      
    }

    return $response;
  }

  
  public function mixAllNews(&$articlesByOptions) {
    $response = [];
    $articlesByOptions = array_values($articlesByOptions);
    $length = count($articlesByOptions);
    
    $i = 0;
    while(true) {
      if(empty($articlesByOptions)) break;
      if( empty( $articlesByOptions[$i] ) ) {
        array_splice($articlesByOptions, $i, 1);
        $length = count($articlesByOptions);
        $i--;
      } else {
        $article = $articlesByOptions[$i][0];
        array_push($response, $article);
        array_splice($articlesByOptions[$i], 0, 1);
      }


      $i++;
      if($i == $length)
        $i = 0;
    }

    return $response;
  }


  private function fetchNewsBySources(&$articlesByOptions) {
    $query = null;
    $insertOrUpdateMap = [];
    foreach(request()->input('sources') as $source) {
      
      if(array_key_exists($source, $articlesByOptions)) continue;

      $newsBySource = DB::table('news_by_source')->where('name', $source)->first();
      $needUpdation = false;
      
      //if news feed does not exist in the database then update table with news feed
      if(!$newsBySource) {
        $needUpdation = true;
        $insertOrUpdateMap[$source] = 'insert';
      } else {
        //if news feed already exist then check if its expired or not
        //if expired then update table with latest news feed
        $updatedAt = new Carbon($newsBySource->updated_at);
        $now = new Carbon();
        if($updatedAt->addMinutes(60)->lt($now)) {
          $needUpdation = true;
          $insertOrUpdateMap[$source] = 'update';
        }
      }

      if($needUpdation) {
        if($query) $query .= ','.$source;
        else $query = $source;  
      } else {
        //push the array containing all the articles from this country to main array
        // array_push($articlesByOptions, json_decode($newsBySource->articles));
        $articlesByOptions[$newsBySource->name] = json_decode($newsBySource->articles);
      }
    }

    if($query) {
      $query = 'sources='.$query;
      $response = $this->fetchNewsFromAPI($query);
      $this->updateNewsBySourceTable($response, $insertOrUpdateMap);
      $this->fetchNewsBySources($articlesByOptions);
    }
  }

  //function to update news_by_source table with latest news feed
  private function updateNewsBySourceTable($response, $insertOrUpdateMap) {
    
    $source_wise_response = [];
    
    foreach ($response as $article) {
      if(!in_array($article->source->id, array_keys($source_wise_response)))
        $source_wise_response[$article->source->id] = [];
      array_push($source_wise_response[$article->source->id], $article);
    }
    
    foreach($source_wise_response as $source => $articles) {
      //check if news already exist for this country
      // $newsBySource = DB::table('news_by_source')->where('name', $source)->first();
      
      //if not then insert new record
      if($insertOrUpdateMap[$source] == 'insert')
        DB::table('news_by_source')->insert([
          'name' => $source,
          'articles' => json_encode($articles)
        ]);
        
      //else update the existing record
      else if($insertOrUpdateMap[$source] == 'update')
        DB::table('news_by_source')
          ->where('name', $source)
          ->update([
            'articles' => json_encode($articles),
            'updated_at' => Carbon::now()
          ]);
    }

    

    // return the update news feed
    // return DB::table('news_by_source')->where('name', $source)->first();
  }

  public function search() {
    $query = 'q='.urlencode(request()->input('searchTerm')).'&sortBy=publishedAt';
    $endpoint = 'everything';
    $totalResults = 100;
    return $this->fetchNewsFromAPI($query, $endpoint, $totalResults);
  }

}
