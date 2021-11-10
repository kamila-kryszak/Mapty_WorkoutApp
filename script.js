'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


class Workout {
    date = new Date();
    id = (Date.now() + "").slice(-10);
    constructor(coords, distance, duration) {
        this.coords = coords; // [lat, lng]
        this.distance = distance; // in km
        this.duration = duration; // in min
    }
}

class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
    }

    calcPace() {
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}
class Cycling extends Workout {
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }

    calcSpeed() {
        // km/h
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}


class App {
    #map;
    #mapEvent;
    constructor() {
        this._getPosition();
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationField.bind(this)); // to double check!
    }
        _getPosition() { 
            if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
                alert('Sorry! Could not get your current position 🙁');
            });
        }

        _loadMap(position)  {
            const {latitude} = position.coords;
            const {longitude} = position.coords;
            console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
            
            
            const coords = [latitude, longitude];
            
            
            // coordinates + zoom parameters
            this.#map = L.map('map').setView(coords, 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);
            
            
            // handling clicks on map
                this.#map.on('click', this._showForm.bind(this));
            } 
            

        _showForm(mapE) {
            this.#mapEvent = mapE;
                    form.classList.remove('hidden');
                    inputDistance.focus();
        }

        _toggleElevationField() {
            inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
            inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
        }

        _newWorkout(e) {
            e.preventDefault();
        
            // clearing input fields
            inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
        
            const {lat, lng} = this.#mapEvent.latlng;
            console.log(lat, lng);
            
            // markerig the clicked area + adjusting the marker options 
                L.marker([lat, lng])
                .addTo(this.#map)
                .bindPopup(
                    L.popup ({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: 'running-popup'
                }))
                .setPopupContent('Workout')
                .openPopup();
        }
        
};

const app = new App();






