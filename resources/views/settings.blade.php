<div id="settings-page">
  <nav>
    <ul>
      <li class="active" data-tab-id="location-tab">Location</li>
      <li data-tab-id="sources-tab">Sources</li>
      <li data-tab-id="about-tab">About</li>
    </ul>
  </nav>

  <div id="settings-tab-container">
    
    <div class="tab" id="location-tab">
      <section id="selected-countries">
        <div class="header">Selected Countires</div>
        <div class="countries-container"></div>
      </section>
      <section id="all-countries">
        <div class="header">All Countires</div>
        <div class="countries-container"></div>
      </section>
    </div>

    <div class="tab" id="sources-tab">
      <div id="filter-section">
        <div class="header">Filters</div>
        <div id="filters-container">
          <div id="category-filter">
            <div class="select">Category</div>
            <ul class="options"></ul>
          </div>
          <div id="language-filter">
            <div class="select">Language</div>
            <ul class="options"></ul>
          </div>
          <div id="country-filter">
            <div class="select">Country</div>
            <ul class="options"></ul>
          </div>
        </div>
      </div>
      <div id="search-and-sources-container">
        <div id="search-bar">
          <input type="text" placeholder="Search sources">
        </div>
        <div id="sources-container">
          <div id="no-source">
            <div class="title">No results found</div>
            <div class="desc">Try different search keywords or remove filters</div>
          </div>
        </div>
      </div>
    </div>

    <div class="tab" id="about-tab">
      <div id="app-name"><strong>GLANCE</strong>.ml</div>
      <div id="app-version">version 1.0.4</div>
      <div id="made-with-love">Made with <i class="fas fa-heart"></i> in <span>India</span></div>
      <div id="about-dev">
        <div id="name">Sanyam Mishra</div>
        <div id="contact">
          <div>Contact me &#8212;</div>
          <a href="https://www.facebook.com/me.sanyam.mishra" id="fb" target="_blank"><i class="fab fa-facebook-square"></i>/me.sanyam.mishra</a>
          <a href="https://www.linkedin.com/in/sanyam-mishra" target="_blank"><i class="fab fa-linkedin"></i>/sanyam-mishra</a>
          <a href="mailto:sanyam.mishra@live.com"><i class="fas fa-envelope"></i>/sanyam.mishra@live.com</a>
        </div>
      </div>
      <a href="/privacy-policy" target="_blank" class="button">Privacy policy<i class="fas fa-external-link-alt"></i></a>
      <div id="credits">
        <span>Credits</span>
        <ul>
          <li>News information is provided by <a href="https://newsapi.org" target="_blank">NewsAPI.org</a></li>
          <li>All news content belongs to the respective publishers.</li>
          <li>Implicit location search is provided by <a href="https://ipinfo.io" target="_blank">ipinfo.io</a></li>
          <li>Explicit location search is provided by Google Maps.</li>
        </ul>
      </div>
    </div>
    
  </div>
</div>