// for navigator language
var lang = window.navigator.language;
// you can change the language
// var lang = 'en';

//change weather params here:
//units: metric or imperial
var weatherParams = {
    'q':'Strasbourg,France',
    'units':'metric',
    'lang':lang
};

var feed = 'http://www.dna.fr/rss';
//var feed = 'http://www.nu.nl/feeds/rss/achterklap.rss';
//var feed = 'http://www.nu.nl/feeds/rss/opmerkelijk.rss';
//var feed = 'http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml';

// compliments:
var morning = [
            'Good morning, handsome!',
            'Enjoy your day!',
            'How was your sleep?'
        ];
        
var afternoon = [
            'Hello, beauty!',
            'You look sexy!',
            'Looking good today!'
        ];
       
var evening = [
            'Wow, you look hot!',
            'You look nice!',
            'Hi, sexy!'
        ];

// Set this to null if you don't want a title
var eventsTitle = "Rendez-vous & évènements";

// Set this to null if you don't want a to do list title
var todoTitle = "Liste des \"à faire\"";