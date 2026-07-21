import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

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

  private mockShops = [
    {
      name: 'Rosa',
      address: 'Strada Dávid Ferenc 21, Cluj-Napoca',
      hasOffers: true
    },
    {
      name: 'Big Belly',
      address: 'Calea Mănăștur 68, Cluj-Napoca',
      hasOffers: false
    },
    {
      name: 'KFC',
      address: 'Strada Iuliu Maniu 1, Cluj-Napoca',
      hasOffers: true
    },
    {
      name: 'Kaufland',
      address: 'Strada Fabricii 12, Cluj-Napoca',
      hasOffers: false
    }
  ];

  constructor(private http: HttpClient) {}

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

    // markere adrese
    const addresses = this.mockShops.map(shop => shop.address);
    this.showAddresses(addresses);
  }

  // procesare adrese
  private async showAddresses(addresses: string[]): Promise<void> {
    for (const address of addresses) {
      await this.geocodeAndAddMarker(address);
      await this.delay(1000); // 1 req/secunda (limita nominatim)
    }
  }

  private geocodeAndAddMarker(address: string): Promise<void> {
    return new Promise((resolve) => {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=ro&limit=1`;

      this.http.get<any[]>(url).subscribe({
        next: (results) => {
          if (results.length > 0) {
            const lat = parseFloat(results[0].lat);
            const lon = parseFloat(results[0].lon);

            const shop = this.mockShops.find(s => s.address === address)!;

            const icon = this.createShopIcon(shop.hasOffers);

            const marker = L.marker([lat, lon], {icon})
              .addTo(this.map)
              .bindPopup(`
                <strong>${shop.name}</strong>
                <br>
                ${address}
                <br>
              `);

            this.addressMarkers.push(marker);
          } else {
            console.warn('Adresa nu a fost găsită:', address);
          }
          resolve();
        },
        error: (err) => {
          console.error('Eroare la geocodare pentru:', address, err);
          resolve(); // continuare chiar daca una esueaza
        }
      });
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
