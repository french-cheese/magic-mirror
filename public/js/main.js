jQuery.fn.updateWithText = function (text, speed) {
    var dummy = $('<div/>').html(text);

    if ($(this).html() != dummy.html()) {
        $(this).fadeOut(speed / 2, function () {
            $(this).html(text);
            $(this).fadeIn(speed / 2, function () {
                //done
            });
        });
    }
}

jQuery.fn.outerHTML = function (s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

function roundVal(temp) {
    return Math.round(temp * 10) / 10;
}

//Fonction de transformation en hexadécimal source: http://stackoverflow.com/questions/16360533/calculate-color-hex-having-2-colors-and-percent-position
var hex = function (x) {
    x = x.toString(16);
    return (x.length == 1) ? '0' + x : x;
};

function colorTemp(temp) {
    var coldestColor = '3BD0FF';
    var hottestColor = 'FF6A3B';
    var coldestTemp = -15;
    var hottestTemp = 35;
    var range = hottestTemp - coldestTemp;
    var alignedTemp = temp - coldestTemp;
    if (alignedTemp < 0) {
        alignedTemp = 0;
    } else if (alignedTemp > range) {
        alignedTemp = range;
    }
    var ratio = alignedTemp / range;
    if (ratio == 0) {
        return coldestColor;
    } else if (ratio == 1) {
        return hottestColor;
    } else {
        ratio = 1-ratio;
        var r = Math.ceil(parseInt(coldestColor.substring(0, 2), 16) * ratio + parseInt(hottestColor.substring(0, 2), 16) * (1 - ratio));
        var g = Math.ceil(parseInt(coldestColor.substring(2, 4), 16) * ratio + parseInt(hottestColor.substring(2, 4), 16) * (1 - ratio));
        var b = Math.ceil(parseInt(coldestColor.substring(4, 6), 16) * ratio + parseInt(hottestColor.substring(4, 6), 16) * (1 - ratio));
        var middle = hex(r) + hex(g) + hex(b);
        return middle;
    }
}

function kmh2beaufort(kmh) {
    var speeds = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117, 1000];
    for (var beaufort in speeds) {
        var speed = speeds[beaufort];
        if (speed > kmh) {
            return beaufort;
        }
    }
    return 12;
}

function getTodayDateFormatted() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = dd + '/' + mm + '/' + yyyy;
    return today;
}

jQuery(document).ready(function ($) {

    var news = [];
    var newsIndex = 0;

    var eventList = [];
    var todoList = [];

    var updatedSource = true;
    var disconnected = true;

    var lastCompliment;
    var compliment;

    var updatedToday = false;
    var updatedDay;

    moment.lang(lang);

    //connect do Xbee monitor
    // var socket = io.connect('http://rpi-alarm.local:8082');
    // socket.on('dishwasher', function (dishwasherReady) {
    // 	if (dishwasherReady) {
    // 		$('.dishwasher').fadeIn(2000);
    // 		$('.lower-third').fadeOut(2000);
    // 	} else {
    // 		$('.dishwasher').fadeOut(2000);
    // 		$('.lower-third').fadeIn(2000);
    // 	}
    // });


    /*(function checkVersion()
     {
     $.getJSON('githash.php', {}, function(json, textStatus) {
     if (json) {
     if (json.gitHash != gitHash) {
     window.location.reload();
     window.location.href=window.location.href;
     }
     }
     });
     setTimeout(function() {
     checkVersion();
     }, 3000);
     })();
     */

    (function updateTime() {
        var now = moment();
        var date = now.format('LLLL').split(' ', 4);
        date = date[0] + ' ' + date[1] + ' ' + date[2] + ' ' + date[3];

        $('.date').html(date);
        $('.time').html(now.format('HH') + ':' + now.format('mm') + '<span class="sec">' + now.format('ss') + '</span>');

        setTimeout(function () {
            updateTime();
        }, 1000);
    })();

    (function updateCalendarData() {
        new ical_parser("calendar", function (cal) {
            events = cal.getEvents();
            eventList = [];

            for (var i in events) {
                var e = events[i];

                if (e.RRULE != '' && e.RRULE != null) {
                    for (var key in e) {
                        var value = e[key];
                        var seperator = key.search(';');
                        if (seperator >= 0) {
                            var mainKey = key.substring(0, seperator);
                            var subKey = key.substring(seperator + 1);

                            var dt;

                            var dt2 = new Date();
                            if (e.RRULE.substring(5, 11) === 'YEARLY') {

                                if (subKey == 'VALUE=DATE') {
                                    //date
                                    dt = new Date(dt2.getFullYear(), value.substring(4, 6) - 1, value.substring(6, 8));
                                } else {
                                    //time
                                    dt = new Date(dt2.getFullYear(), value.substring(4, 6) - 1, value.substring(6, 8), value.substring(9, 11), value.substring(11, 13), value.substring(13, 15));
                                }
                            }
                            else if (e.RRULE.substring(5, 11) === 'MONTHL') {
                                if (subKey == 'VALUE=DATE') {
                                    //date
                                    dt = new Date(dt2.getFullYear(), dt2.getMonth(), value.substring(6, 8));
                                } else {
                                    //time
                                    dt = new Date(dt2.getFullYear(), dt2.getMonth(), value.substring(6, 8), value.substring(9, 11), value.substring(11, 13), value.substring(13, 15));
                                }
                            }
                            else {

                                if (subKey == 'VALUE=DATE') {
                                    //date
                                    dt = new Date(value.substring(0, 4), value.substring(4, 6) - 1, value.substring(6, 8));
                                } else {
                                    //time
                                    dt = new Date(value.substring(0, 4), value.substring(4, 6) - 1, value.substring(6, 8), value.substring(9, 11), value.substring(11, 13), value.substring(13, 15));
                                }

                            }
                            if (mainKey == 'DTSTART') e.start_date = dt;
                            if (mainKey == 'DTEND') e.endDate = dt;
                        }
                    }
                }

                var now = new Date();
                var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                var days = moment(e.start_date).diff(moment(today), 'days');

                //only add future events
                if (days >= 0 && days != -0) {
                    eventList.push({'description': e.SUMMARY, 'days': days});
                }
            }
            ;
            eventList.sort(function (a, b) {
                return a.days - b.days
            });

            setTimeout(function () {
                updateCalendarData();
            }, 60000);
        });
    })();

    (function updateCalendar() {
        table = $('<table/>').addClass('xsmall').addClass('calendar-table');
        opacity = 1;

        var row = $('<tr/>').css('opacity', opacity);
        if (eventsTitle != null) {
            row.append($('<td/>').html("<b>" + eventsTitle + "</b>").addClass('description'));
            table.append(row);
        }

        for (var i in eventList) {
            var e = eventList[i];

            row = $('<tr/>').css('opacity', opacity);
            row.append($('<td/>').html(e.description).addClass('description'));
            row.append($('<td/>').html(e.days).addClass('days dimmed'));
            table.append(row);

            opacity -= 1 / eventList.length;
        }

        $('.calendar').updateWithText(table, 1000);

        setTimeout(function () {
            updateCalendar();
        }, 1000);
    })();

    (function updateTodolistData() {

        //TODO : à remplacer par l'appel à la vraie fonction

        todoList = [
            {
                'description': 'Acheter caisse',
                'days': '8'
            },
            {
                'description': 'Todo 2',
                'days': '10'
            }
        ];

        todoList.sort(function (a, b) {
            return a.days - b.days
        });

        setTimeout(function () {
            updateTodolistData();
        }, 60000);
    })();

    (function updateTodolist() {
        table = $('<table/>').addClass('xsmall').addClass('todolist-table');
        opacity = 1;

        var row = $('<tr/>').css('opacity', opacity);
        if (eventsTitle != null) {
            row.append($('<td/>').html("<b>" + todoTitle + "</b>").addClass('description'));
            table.append(row);
        }

        for (var i in todoList) {
            var e = todoList[i];

            row = $('<tr/>').css('opacity', opacity);
            row.append($('<td/>').html(e.description).addClass('description'));
            row.append($('<td/>').html(e.days).addClass('days dimmed'));
            table.append(row);

            opacity -= 1 / todoList.length;
        }

        $('.todolist').updateWithText(table, 1000);

        setTimeout(function () {
            updateTodolist();
        }, 1000);
    })();

    /*
     (function updateCompliment()
     {
     //see compliments.js
     while (compliment == lastCompliment) {

     //Check for current time
     var compliments;
     var date = new Date();
     var hour = date.getHours();
     //set compliments to use
     if (hour >= 3 && hour < 12) compliments = morning;
     if (hour >= 12 && hour < 17) compliments = afternoon;
     if (hour >= 17 || hour < 3) compliments = evening;

     compliment = Math.floor(Math.random()*compliments.length);
     }

     $('.compliment').updateWithText(compliments[compliment], 4000);

     lastCompliment = compliment;

     setTimeout(function() {
     updateCompliment(true);
     }, 30000);

     })();
     */

    (function updateCurrentWeather() {
        var iconTable = {
            '01d': 'wi-day-sunny',
            '02d': 'wi-day-cloudy',
            '03d': 'wi-cloudy',
            '04d': 'wi-cloudy-windy',
            '09d': 'wi-showers',
            '10d': 'wi-rain',
            '11d': 'wi-thunderstorm',
            '13d': 'wi-snow',
            '50d': 'wi-fog',
            '01n': 'wi-night-clear',
            '02n': 'wi-night-cloudy',
            '03n': 'wi-night-cloudy',
            '04n': 'wi-night-cloudy',
            '09n': 'wi-night-showers',
            '10n': 'wi-night-rain',
            '11n': 'wi-night-thunderstorm',
            '13n': 'wi-night-snow',
            '50n': 'wi-night-alt-cloudy-windy'
        }


        $.getJSON('http://api.openweathermap.org/data/2.5/weather', weatherParams, function (json, textStatus) {

            var temp = roundVal(json.main.temp);
            var temp_min = roundVal(json.main.temp_min);
            var temp_max = roundVal(json.main.temp_max);

            var wind = roundVal(json.wind.speed);

            var iconClass = iconTable[json.weather[0].icon];
            var icon = $('<span/>').addClass('icon').addClass('dimmed').addClass('wi').addClass(iconClass);
            $('.temp').updateWithText(icon.outerHTML() + '<span style="color: '+'#'+colorTemp(temp)+';">' + temp + '&deg;</span>', 1000);
            console.log("Mise à jour température actuelle");

            // var forecast = 'Min: '+temp_min+'&deg;, Max: '+temp_max+'&deg;';
            // $('.forecast').updateWithText(forecast, 1000);

            var now = new Date();
            var sunrise = new Date(json.sys.sunrise * 1000).toTimeString().substring(0, 5);
            var sunset = new Date(json.sys.sunset * 1000).toTimeString().substring(0, 5);

            var windString = '<span class="wi wi-strong-wind xdimmed"></span> ' + wind + ' km/h';
            var sunString = '<span class="wi wi-sunrise xdimmed"></span> ' + sunrise;
            if (json.sys.sunrise * 1000 < now && json.sys.sunset * 1000 > now) {
                sunString = '<span class="wi wi-sunset xdimmed"></span> ' + sunset;
            }

            $('.windsun').updateWithText(windString + ' ' + sunString, 1000);
        });

        setTimeout(function () {
            updateCurrentWeather();
        }, 120000);
    })();

    (function updateWeatherForecast() {
        var iconTable = {
            '01d': 'wi-day-sunny',
            '02d': 'wi-day-cloudy',
            '03d': 'wi-cloudy',
            '04d': 'wi-cloudy-windy',
            '09d': 'wi-showers',
            '10d': 'wi-rain',
            '11d': 'wi-thunderstorm',
            '13d': 'wi-snow',
            '50d': 'wi-fog',
            '01n': 'wi-night-clear',
            '02n': 'wi-night-cloudy',
            '03n': 'wi-night-cloudy',
            '04n': 'wi-night-cloudy',
            '09n': 'wi-night-showers',
            '10n': 'wi-night-rain',
            '11n': 'wi-night-thunderstorm',
            '13n': 'wi-night-snow',
            '50n': 'wi-night-alt-cloudy-windy'
        }
        $.getJSON('http://api.openweathermap.org/data/2.5/forecast', weatherParams, function (json, textStatus) {

            var forecastData = {};

            for (var i in json.list) {
                var forecast = json.list[i];
                var dateKey = forecast.dt_txt.substring(0, 10);

                if (forecastData[dateKey] == undefined) {
                    forecastData[dateKey] = {
                        'timestamp': forecast.dt * 1000,
                        'icon': forecast.weather[0].icon,
                        'temp_min': forecast.main.temp,
                        'temp_max': forecast.main.temp
                    };
                } else {
                    forecastData[dateKey]['icon'] = forecast.weather[0].icon;
                    forecastData[dateKey]['temp_min'] = (forecast.main.temp < forecastData[dateKey]['temp_min']) ? forecast.main.temp : forecastData[dateKey]['temp_min'];
                    forecastData[dateKey]['temp_max'] = (forecast.main.temp > forecastData[dateKey]['temp_max']) ? forecast.main.temp : forecastData[dateKey]['temp_max'];
                }

            }


            var forecastTable = $('<table />').addClass('forecast-table');
            var opacity = 1;
            for (var i in forecastData) {
                var forecast = forecastData[i];
                var iconClass = iconTable[forecast.icon];
                var dt = new Date(forecast.timestamp);
                var row = $('<tr />').css('opacity', opacity);

                row.append($('<td/>').addClass('day').html(moment.weekdaysShort(dt.getDay())));
                row.append($('<td/>').addClass('icon-small').addClass(iconClass));
                row.append($('<td/>').addClass('temp-min').html(roundVal(forecast.temp_min)).css('color', '#'+colorTemp(forecast.temp_min)));
                row.append($('<td/>').addClass('temp-max').html(roundVal(forecast.temp_max)).css('color', '#'+colorTemp(forecast.temp_max)));

                forecastTable.append(row);
                opacity -= 0.155;
            }


            $('.forecast').updateWithText(forecastTable, 1000);
        });

        setTimeout(function () {
            updateWeatherForecast();
        }, 120000);
    })();

    // Function used to update the news list that is shown on screen.
    function fetchNews() {
        console.log("Mise à jour des news");
        $.feedToJson({
            feed: feed,
            success: function (data) {
                news = [];
                for (var i in data.items) {
                    var item = data.items[i];
                    news.push(item.title);
                }
            }
        });
        setTimeout(function () {
            fetchNews();
        }, 60000);
    };

    // Shows news on-screen and call the function to update the news list if the feed source has been changed.
    (function showNews() {
        if (updatedSource) {
            console.log("Mise à jour de la source");
            updatedSource = false;
            fetchNews();
        }
        var newsItem = news[newsIndex];
        $('.news').updateWithText(newsItem, 4000);

        newsIndex--;
        if (newsIndex < 0) newsIndex = news.length - 1;
        setTimeout(function () {
            showNews();
        }, 5500);
    })();

    // Gets the quote of the day and sets it at the top of the page
    (function getQuoteOfTheDay() {
        var today = getTodayDateFormatted();
        if (today != updatedDay) {
            $.getJSON("http://api.theysaidso.com/qod", function (data) {
                console.log(data);
                if (data.contents.quotes[0] !== null) {
                    data.contents.quotes[0].quote = "<i>&quot" + data.contents.quotes[0].quote + "&quot</i>";
                    var joined = data.contents.quotes[0].quote + "<br><div class=\"author\">" + data.contents.quotes[0].author + "</div>";
                    $('.quote').html(joined);
                    updatedDay = today;
                    setTimeout(function () {
                        getQuoteOfTheDay();
                    }, 36000);
                } else {
                    setTimeout(function () {
                        getQuoteOfTheDay();
                    }, 2000);
                }

            });
        }
    })();

// flashes the disconnected icon every 2 secs.
    function alertDisconnect(n) {
        if (disconnected) {
            $('#signal path').css('fill', '#F00');
            $('#signal').fadeTo(2000, n, function () {
                if (n == 1) {
                    alertDisconnect(0);
                } else {
                    alertDisconnect(1);
                }
            });
        }
    }

    var socket = io();

// Show the connected icon on connect and the fades it out
    socket.on('connect', function () {
        disconnected = false;
        $('#signal path').css('fill', '#0F0');
        $('#signal').fadeTo(4000, 1);
        setTimeout(function () {
            $('#signal').fadeTo(2000, 0);
        }, 5000);
        socket.emit('mirror-connected', '');
    });

// When receiving the change feed event, switch the source and flag it as updated.
    socket.on('feed', function (source) {
        console.log(source);
        feed = source;
        updatedSource = true;
    });

// When disconnected, show the disconnected icon and flash it every 2 secs
    socket.on('disconnect', function () {
        disconnected = true;
        alertDisconnect(1);
    });

// Select all SVG objects that have the svg-inject class
    var mySVGsToInject = document.querySelectorAll('.svg-inject');

// Inject SVG data into the page so it can be styled using css
    SVGInjector(mySVGsToInject);
})
;
