import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { ShopService } from '../services/shop.service';
import { ShopMapInfo, ShopsMapResponse } from '../shop';
@Component({
  selector: 'app-map',
  template: `
    <div class="map-container">
      <div class="map-frame">
        <div id="map"></div>
      </div>
    </div>
  `,
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnDestroy {

  private map!: L.Map;
  private userMarker?: L.CircleMarker;
  private accuracyCircle?: L.Circle;
  private addressMarkers: L.Marker[] = [];

  private shopsList: ShopMapInfo[] = []

  constructor(private http: HttpClient, private shopService: ShopService) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {

    this.map = L.map('map', {
      center: [46.77, 23.58],
      zoom: 13
    });
    
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 20,
        attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }
    ).addTo(this.map);

    
    this.map.on('locationfound', (e: L.LocationEvent) => {

      const radius = e.accuracy;
      
      if (this.userMarker) {
        this.map.removeLayer(this.userMarker);
      }

      if (this.accuracyCircle) {
        this.map.removeLayer(this.accuracyCircle);
      }

      
      this.userMarker = L.circleMarker(e.latlng, {
        radius: 10,
        color: 'var(--bg-color)',
        weight: 4,
        fillColor: 'var(--primary-color)',
        fillOpacity: 1
      })
        .addTo(this.map)
        .bindPopup(`
          <strong>📍 Locatia ta</strong><br>
          
        `)
        .openPopup();

      
      this.accuracyCircle = L.circle(e.latlng, {
        radius: radius,
        color: 'var(--primary-color)',
        fillColor: 'var(--primary-color)',
        fillOpacity: 0.15
      }).addTo(this.map);

    }); 

    this.map.on('locationerror', (e: L.ErrorEvent) => {
      alert('Nu ai permis accesul la locație.');
      console.error(e.message);
    });

    this.map.locate({
      setView: true,
      maxZoom: 16,
      enableHighAccuracy: true
    });

    this.loadShopsFromDatabase();
  }

  private loadShopsFromDatabase(): void {
    this.shopService.getAllShopMapInfo().subscribe({
      next: (response: ShopsMapResponse) => {
        this.shopsList = response.entry;
        this.showAllShopsOnMap(this.shopsList);
      },
      error: (error) => {
        console.error("Eroare la preluarea magazinelor:", error);
      }
    })
  }

  private async showAllShopsOnMap(shops: ShopMapInfo[]): Promise<void> {
    for (const shop of shops) {
      if (shop.lat && shop.lon) {
        this.displayShopOnMap(shop);
      } 
    }
  }

  private displayShopOnMap(shop: ShopMapInfo) {
    const icon = this.createShopIcon(shop.hasOffers || false);

    if (!shop.lat || !shop.lon)
       throw new Error('Eroare la afisarea magazinului pe hartă: Nu a fost furnizată locația.')

    const marker = L.marker([shop.lat, shop.lon], {icon})
      .addTo(this.map)
      .bindPopup(`
        <strong>${shop.name}</strong>
        <br>
        ${shop.address}
        <br>
      `);
    
    this.addressMarkers.push(marker);
  }

  private createShopIcon(hasOffers: boolean): L.DivIcon {
  const color = hasOffers ? '#e01f2f' : '#020203';

  return L.divIcon({
    className: 'shop-marker',
    html: `
      <div style="
        width: 26px;
        height: 26px;
        background: ${color};
        border: 3px solid var(--bg-color);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26]
  });
}
}
