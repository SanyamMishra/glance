<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Glance | News at a Glance</title>
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600" rel="stylesheet">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css">
  <link rel="stylesheet" href="css/components.min.css">
  <link rel="stylesheet" href="css/style.min.css">
  <link rel="stylesheet" href="css/settings.min.css">
  <link rel="stylesheet" href="css/flags.css">
</head>
<body>
  
  @include('header')
  
  <main>
    <div class="button-holder">
      <i class="fas fa-caret-left fadeOut"></i>
    </div>
    <div id="cards-holder">
      <div id="slideshow"></div>
    </div>
    <div class="button-holder">
      <i class="fas fa-caret-right"></i>
    </div>
    <div id="no-news">
      <div class="title">No news found</div>
      <ul>
        <li>Try adding countries and/or sources in settings menu</li>
        <li>Try different search keywords</li>
      </ul>
    </div> 
  </main>

  <div id="device-not-supported">
    <div class="title">Device not supported</div>
    <ul>
      <li>We currently don't support mobile devices</li>
      <li>We are working on bringing Glance to your mobile devices soon</li>
      <li>Meanwhile, try Glance in tablets, PCs, laptops and TVs</li>
    </ul>
  </div>

  @include('settings')
  
  @include('componentTemplates')

  @include('waitClock')

  <script src="js/script.js"></script>
  <script src="js/slideshow.js"></script>
  <script src="js/settings.js"></script>
  <script src="js/components.js"></script>
</body>
</html>