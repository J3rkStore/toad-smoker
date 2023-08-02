$(function () {
  var apiKey = "62fd8b3b3f53537fa28c78f62e47e245";
  var lat = "";
  var lon = "";
  var histListEl = $(".hist-list");
  var srchBtnEl = document.getElementById("search-btn");
  var cityKey = 0;
  var clearBtnEl = $("#clear");
  var weatherInfoEl = $("#weather-info");
  var listZeroEl = $(".list-0");
  var listOneEl = $(".list-1");
  var listTwoEl = $(".list-2");
  var listThreeEl = $(".list-3");
  var listFourEl = $(".list-4");

  clearBtnEl.on("click", function () {
    localStorage.clear();
    $(".hst-Btn").remove();
  });

  //'&units=imperial' at the end of the api call

  var testEx =
    "https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=62fd8b3b3f53537fa28c78f62e47e245";

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
      requestInfo(localStorage.getItem("city " + thisOne));
    });
  }

  createButtons();

  function requestInfo(call) {
    $("li").remove();
    $("img").remove();
    fetch(call)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data["list"]);
        var dataList = data["list"];
        var cityliEl = $("<li>");
        cityliEl.addClass("city-name");
        cityliEl.text(data["city"].name);
        listZeroEl.append(cityliEl);

        function makeLines(i, ul) {
          var img = $("<img>");
          img.attr(
            "src",
            "https://openweathermap.org/img/wn/" +
              dataList[i].weather[0].icon +
              "@2x.png"
          );
          var dateEl = $("<li>");
          dateEl.text(dataList[i].dt_txt);
          var tempEl = $("<li>");
          tempEl.text("Temp " + dataList[i].main.temp);
          var humEl = $("<li>");
          humEl.text("humidity " + dataList[i].main.humidity);
          var windEl = $("<li>");
          windEl.text("wind speed " + dataList[i].wind.speed);

          ul.append(dateEl, img, tempEl, humEl, windEl);
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
