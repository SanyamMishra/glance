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
</head>
<body>
  <header>
    <div id="logo">Glance<span>.tk</span></div>
    <div id="search-container">
      <div id="search">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Search">
      </div>      
    </div>
    <nav>
      <span class="button">
        <i class="fas fa-user-circle"></i>
      </span>
      <span class="button" data-tooltip="Options">
        <i class="fas fa-cog"></i>
      </span>
    </nav>
  </header>
  
  <main>
    <div class="button-holder">
      <i class="fas fa-caret-left"></i>
    </div>
    <div id="cards-holder">
      <div id="slideshow"></div>
    </div>
    <div class="button-holder">
      <i class="fas fa-caret-right"></i>
    </div>
  </main>
  

  <div class="news-card" id="news-card-template" style="background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))">
    <div class="headline"></div>
    <div class="info">
      <div class="source"></div>
      <div class="time"></div>
    </div>
    <div class="description"></div>
  </div>

  <div class="modal-holder" id="modal-template">
    <div class="modal">
      <div class="icon"><i class=""></i></div>
      <div class="message"></div>
      <div class="options"></div>
    </div>
  </div>

  <script src="js/script.js"></script>
  <script src="js/slideshow.js"></script>
</body>
</html>