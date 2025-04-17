import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  city: string = '';
  weatherData: any = null;
  favorites: any[] = [];
  isFavorite: boolean = false;

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {

    this.loadFavorites();

  }

  searchCity() {
    if (!this.city.trim()) return;
    
    this.weatherService.getWeather(this.city).subscribe(
      (data) => {
        this.weatherData = data;
        this.checkIfFavorite();
      },
      (error) => {
        console.error('Error fetching weather data:', error);
        this.weatherData = null;
      }
    );
  }

  addToFavorites() {
    if (!this.weatherData || this.isFavorite) return;
    
    this.favorites.push(this.weatherData);
    this.saveFavorites();
    this.isFavorite = true;
  }

  removeFavorite(favorite: any) {
    this.favorites = this.favorites.filter(fav => fav.name !== favorite.name);
    this.saveFavorites();
    if (this.weatherData && this.weatherData.name === favorite.name) {
      this.isFavorite = false;
    }
  }

  loadFavorite(favorite: any) {
    this.city = favorite.name;
    this.weatherData = favorite;
    this.isFavorite = true;
  }

  private checkIfFavorite() {
    this.isFavorite = this.favorites.some(fav => fav.name === this.weatherData.name);
  }

  private loadFavorites() {
    const savedFavorites = localStorage.getItem('weatherFavorites');
    if (savedFavorites) {
      this.favorites = JSON.parse(savedFavorites);
    }
  }

  private saveFavorites() {
    localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
  }

}
