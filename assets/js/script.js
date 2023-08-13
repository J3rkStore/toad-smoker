$(function () {
  var apiKey = "62fd8b3b3f53537fa28c78f62e47e245";
  var lat = "";
  var lon = "";
  var histListEl = $(".hist-list");
  var srchBtnEl = document.getElementById("search-btn");
  var reloadBtnEl = $(".reload");
  var cityKey = 0;
  var clearBtnEl = $("#clear");
  var weatherInfoEl = $("#weather-info");
  var cityNameHeader = $(".city-name-header");
  var coordsEl = $(".coords");
  var utcTimeEl = $(".time");
  // var listOneEl = $(".list-1");
  // var listTwoEl = $(".list-2");
  // var listThreeEl = $(".list-3");
  // var listFourEl = $(".list-4");
  const now = new Date();
  utcTimeEl.append(now.getUTCHours() + ":" + now.getUTCMinutes());

  clearBtnEl.on("click", function () {
    localStorage.clear();
    $(".hst-Btn").remove();
  });

  reloadBtnEl.on("click", function () {
    console.log("clicked reload");
    location.reload();
  });

  //'&units=imperial' at the end of the api call

  var testEx =
    "https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=62fd8b3b3f53537fa28c78f62e47e245";

  // current weather example https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={API key}

  function cityToCoords(city, state, country) {
    fetch(
      "https://api.openweathermap.org/geo/1.0/direct?q=" +
        city +
        "," +
        state +
        "," +
        country +
        "&limit=1&appid=" +
        apiKey
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data["0"].lat);
        console.log(data["0"].lon);
        lat = data["0"].lat;
        lon = data["0"].lon;
        var apiCall =
          "https://api.openweathermap.org/data/2.5/forecast?lat=" +
          lat +
          "&lon=" +
          lon +
          "&units=imperial&appid=" +
          apiKey;

        console.log("api call is " + apiCall);

        storeAPICall(apiCall);
        requestInfo(apiCall);
      });
  }

  function storeAPICall(apiCall) {
    if (localStorage.getItem("city " + cityKey)) {
      cityKey++;
      storeAPICall(apiCall);
    } else if (cityKey < 10) {
      localStorage.setItem("city " + cityKey, apiCall);
      cityKey++;
    }
    localStorage.setItem("last-city", apiCall);
    location.reload();
  }

  async function createButtons() {
    $(".hst-Btn").remove();
    for (var i = 0; i < 10; i++) {
      var key = "city " + i;
      if (localStorage.getItem(key)) {
        cll = localStorage.getItem(key);
        await fetch(cll)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            cityName = data["city"].name;
            var newBtnEl = $("<button>");
            newBtnEl.attr("id", i + "-btn");
            newBtnEl.attr("data-index", i);
            newBtnEl.addClass("hst-Btn");
            newBtnEl.text(cityName);
            histListEl.append(newBtnEl);
            console.log("hist list el " + i);
            console.log(histListEl);
          });
      } else break;
    }
    $(".hist-list").on("click", ".hst-Btn", function (e) {
      //'this' is a jquery thing in this context
      var thisOne = $(this).data("index");

      console.log("you clicked", thisOne);
      console.log(e);
      // requestInfo(localStorage.getItem("city " + thisOne));
      localStorage.setItem(
        "last-city",
        localStorage.getItem("city " + thisOne)
      );

      console.log("reloading...");
      location.reload();

      // location.reload();
    });
  }

  createButtons();
  requestInfo(localStorage.getItem("last-city"));

  function requestInfo(call) {
    localStorage.setItem("last-city", call);
    $("li").remove();
    $("img").remove();
    fetch(call)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log("data");
        console.log(data);
        console.log("data list");
        console.log(data["list"]);
        var dataList = data["list"];
        // var cityliEl = $("<li>");
        // cityliEl.addClass("city-name");
        // cityliEl.text(data["city"].name);
        //cityNameHeader.append(cityliEl);
        cityNameHeader.text(
          data["city"].name +
            ", " +
            data["city"].country +
            "  |  Timezone: " +
            data["city"].timezone +
            " seconds different from UTC"
        );
        console.log("latitude");
        console.log(data["city"].coord["lat"]);
        coordsEl.text(
          "latitude: " +
            data["city"].coord["lat"] +
            " longitude: " +
            data["city"].coord["lon"] +
            " population " +
            data["city"].population
        );

        function makeLines(i, ul) {
          var img = $("<img>");
          img.attr(
            "src",
            "https://openweathermap.org/img/wn/" +
              dataList[i].weather[0].icon +
              "@2x.png"
          );
          var descriptionEl = $("<li>");
          descriptionEl.text(dataList[i].weather[0].description);
          var dateEl = $("<li>");
          dateEl.text(dataList[i].dt_txt);
          var tempEl = $("<li>");
          tempEl.text("Temp " + dataList[i].main.temp);
          var humEl = $("<li>");
          humEl.text("humidity " + dataList[i].main.humidity);
          var windEl = $("<li>");
          windEl.text("wind speed (mph) " + dataList[i].wind.speed);
          var pressEl = $("<li>");
          pressEl.text("atm press (hPa) " + dataList[i].main.pressure);

          ul.append(dateEl, img, descriptionEl, tempEl, humEl, windEl, pressEl);
        }

        for (let i = 0; i < 39; i++) {
          var newCard = $("<div>");
          newCard.addClass("card");
          newCard.addClass("day-" + i);
          var newUl = $("<ul>");
          newUl.addClass("list-" + i);
          newCard.append(newUl);
          makeLines(i, newUl);
          weatherInfoEl.append(newCard);
        }

        // makeLines(0, listZeroEl);
        // makeLines(8, listOneEl);
        // makeLines(16, listTwoEl);
        // makeLines(24, listThreeEl);
        // makeLines(32, listFourEl);
      });
  }

  $(srchBtnEl).on("click", function () {
    cty = document.getElementById("city-search").value;
    stt = document.getElementById("state-search").value;
    cntry = document.getElementById("country-search").value;
    cityToCoords(cty, stt, cntry);
  });

  $("#clearli").click(function () {
    $("li").remove();
  });
});
