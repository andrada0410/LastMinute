import { Component, inject, OnInit } from "@angular/core";
import { isUserReservation, UserReservation as UserReservationModel } from "../reservation";
import { ReservationService } from "../services/reservation.service";
import { UserReservation } from "../user-reservation/user-reservation";
import { AuthService } from "../services/auth.service";

@Component({
    selector: "app-user-reservations",
    standalone: true,
    imports: [UserReservation],
    template: `
        <section class="page">
            <div class="reservations-page">

                <div class="page-head">
                    <div>
                        <h1>Rezervări</h1>
                        <p class="text-muted">
                            Rezervările tale active și istoricul de rezervări.
                        </p>
                    </div>
                </div>

                <div class="card reservations-card">

                    <div class="reservations-section">
                        <h2>Rezervări active</h2>

                        <div class="reservations-list-frame">
                            @if (currentReservations.length > 0) {
                                @for (reservation of currentReservations; track reservation.id) {
                                    <app-user-reservation [reservation]="reservation"></app-user-reservation>
                                }
                            } @else {
                                <p class="text-muted">
                                    Nu aveți rezervări active.
                                </p>
                            }
                        </div>
                    </div>

                    <div class="reservations-section">
                        <h2 class="title-history">Istoric rezervări</h2>

                        <div class="reservations-list-frame">
                            @if (previousReservations.length > 0) {
                                @for (reservation of previousReservations; track reservation.id) {
                                    <app-user-reservation [reservation]="reservation" [isHistory]="true"></app-user-reservation>
                                }
                            } @else {
                                <p class="text-muted">
                                    Nu aveți rezervări în istoric.
                                </p>
                            }
                        </div>
                    </div>

                </div>

            </div>
        </section>
    `,
    styleUrls: ["./user-reservations.css"]
})
export class UserReservations implements OnInit {
    private reservationService = inject(ReservationService);
    private authService = inject(AuthService);

    reservations: UserReservationModel[] = [];
    currentReservations: UserReservationModel[] = [];
    previousReservations: UserReservationModel[] = [];

    ngOnInit(): void {
        const userId = this.authService.currentUser()?.id;

        if (!userId) {
            return;
        }
        
        this.loadCurrentReservations(userId);
        this.loadPreviousReservations(userId);
    }

    private loadCurrentReservations(userId: number ): void {
        this.reservationService.getReservations({ userId, status: ["PENDING"] }).subscribe({
            next: (response) => {
                this.currentReservations = response.entry.filter(isUserReservation);
            }
        });
    }

    private loadPreviousReservations(userId: number): void {
        this.reservationService.getReservations({ userId, status: ["COMPLETED", "CANCELLED"] }).subscribe({
            next: (response) => {
                this.previousReservations = response.entry.filter(isUserReservation);
            }
        });
    }
}