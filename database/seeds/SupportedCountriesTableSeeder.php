<?php

use Illuminate\Database\Seeder;

class SupportedCountriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('supported_countries')->insert([
            ['short_name' => 'ae', 'name' => 'United Arab Emirates'],
            ['short_name' => 'ar', 'name' => 'Argentina'],
            ['short_name' => 'at', 'name' => 'Austria'],
            ['short_name' => 'au', 'name' => 'Australia'],
            ['short_name' => 'be', 'name' => 'Belgium'],
            ['short_name' => 'bg', 'name' => 'Bulgaria'],
            ['short_name' => 'br', 'name' => 'Brazil'],
            ['short_name' => 'ca', 'name' => 'Canada'],
            ['short_name' => 'ch', 'name' => 'Switzerland'],
            ['short_name' => 'cn', 'name' => 'China'],
            ['short_name' => 'co', 'name' => 'Colombia'],
            ['short_name' => 'cu', 'name' => 'Cuba'],
            ['short_name' => 'cz', 'name' => 'Czechia'],
            ['short_name' => 'de', 'name' => 'Germany'],
            ['short_name' => 'eg', 'name' => 'Egypt'],
            ['short_name' => 'fr', 'name' => 'France'],
            ['short_name' => 'gb', 'name' => 'United Kingdom'],
            ['short_name' => 'gr', 'name' => 'Greece'],
            ['short_name' => 'hk', 'name' => 'Hong Kong'],
            ['short_name' => 'hu', 'name' => 'Hungary'],
            ['short_name' => 'id', 'name' => 'Indonesia'],
            ['short_name' => 'ie', 'name' => 'Ireland'],
            ['short_name' => 'il', 'name' => 'Israel'],
            ['short_name' => 'in', 'name' => 'India'],
            ['short_name' => 'it', 'name' => 'Italy'],
            ['short_name' => 'jp', 'name' => 'Japan'],
            ['short_name' => 'kr', 'name' => 'South Korea'],
            ['short_name' => 'lt', 'name' => 'Lithuania'],
            ['short_name' => 'lv', 'name' => 'Latvia'],
            ['short_name' => 'ma', 'name' => 'Morocco'],
            ['short_name' => 'mx', 'name' => 'Mexico'],
            ['short_name' => 'my', 'name' => 'Malaysia'],
            ['short_name' => 'ng', 'name' => 'Nigeria'],
            ['short_name' => 'nl', 'name' => 'Netherlands'],
            ['short_name' => 'no', 'name' => 'Norway'],
            ['short_name' => 'nz', 'name' => 'New Zealand'],
            ['short_name' => 'ph', 'name' => 'Philippines'],
            ['short_name' => 'pl', 'name' => 'Poland'],
            ['short_name' => 'pt', 'name' => 'Portugal'],
            ['short_name' => 'ro', 'name' => 'Romania'],
            ['short_name' => 'rs', 'name' => 'Serbia'],
            ['short_name' => 'ru', 'name' => 'Russia'],
            ['short_name' => 'sa', 'name' => 'Saudi Arabia'],
            ['short_name' => 'se', 'name' => 'Sweden'],
            ['short_name' => 'sg', 'name' => 'Singapore'],
            ['short_name' => 'si', 'name' => 'Slovenia'],
            ['short_name' => 'sk', 'name' => 'Slovakia'],
            ['short_name' => 'th', 'name' => 'Thailand'],
            ['short_name' => 'tr', 'name' => 'Turkey'],
            ['short_name' => 'tw', 'name' => 'Taiwan'],
            ['short_name' => 'ua', 'name' => 'Ukraine'],
            ['short_name' => 'us', 'name' => 'United States of America'],
            ['short_name' => 've', 'name' => 'Venezuela'],
            ['short_name' => 'za', 'name' => 'South Africa']
        ]);
    }
}
