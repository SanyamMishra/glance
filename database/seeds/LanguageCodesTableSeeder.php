<?php

use Illuminate\Database\Seeder;

class LanguageCodesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('language_codes')->insert([
            ["short_name" => "ar", "full_name" => "Arabic"],
            ["short_name" => "de", "full_name" => "German"],
            ["short_name" => "en", "full_name" => "English"],
            ["short_name" => "es", "full_name" => "Spanish"],
            ["short_name" => "fr", "full_name" => "French"],
            ["short_name" => "he", "full_name" => "Hebrew"],
            ["short_name" => "it", "full_name" => "Italian"],
            ["short_name" => "nl", "full_name" => "Dutch"],
            ["short_name" => "no", "full_name" => "Norwegian"],
            ["short_name" => "pt", "full_name" => "Portuguese"],
            ["short_name" => "ru", "full_name" => "Russian"],
            ["short_name" => "sv", "full_name" => "Swedish"],
            ["short_name" => "ur", "full_name" => "Urdu"],
            ["short_name" => "zh", "full_name" => "Chinese"]
        ]);
    }
}
