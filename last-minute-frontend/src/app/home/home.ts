import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
    selector: 'app-home-page',
    template: `
    <div class="home-container">
    <!-- Left Side -->
    <div class="carousel">
        <img [src]="images[currentImage]" class="carousel-img base" alt="Food Image">
        <img [src]="images[nextImage]" class="carousel-img overlay" [class.visible]="showNext" alt="Food Image">
    </div>

    <!-- Right Side -->
    <div class = "details">
        <h1><span class="highlight">Descoperă mese la prețuri reduse</span>, direct de la restaurantele si magazinele din orașul tău.</h1>

        <p>Transformă risipa alimentară în oportunitatea ta de a mânca bine.<br> Prin Last Minute, prinzi ultimele porții ale zilei la prețuri reduse și reduci risipa cu fiecare comandă.</p>
    
        <p>Creează-ți contul în câteva secunde și deblochează instant <span class="highlight"><br>ofertele exclusive din aplicație!</span></p>
    
        <div class="logo-wrapper">
            <img src="assets/logo-full.png" class="logo" alt="Logo">
        </div>
    </div>
    
    </div>
    `,
    styleUrls: ['./home.css']
})
export class Home implements OnInit, OnDestroy {
    images = [
        'assets/carousel-images/food1.jpg',
        'assets/carousel-images/food2.jpg',
        'assets/carousel-images/food3.jpg',
        'assets/carousel-images/food4.jpg',
        'assets/carousel-images/food5.jpg'
    ];

    currentImage = 0;
    nextImage = 1;
    showNext = false;

    private intervalId: any;
    private fadeDuration = 800;

    ngOnInit(): void {
        this.intervalId = setInterval(() => this.advance(), 3000);
    }

    private advance(): void {
        this.nextImage = (this.currentImage + 1) % this.images.length;
        this.showNext = false; 

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.showNext = true;
            });
        });

        setTimeout(() => {
            this.currentImage = this.nextImage; 
            this.showNext = false; 
        }, this.fadeDuration);
    }

    ngOnDestroy(): void {
        console.log('oprit', this.intervalId);
        clearInterval(this.intervalId);
    }
}