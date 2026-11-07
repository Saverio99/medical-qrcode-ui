import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MATERIAL_IMPORTS } from 'src/app/shared/material.imports';
import { Toolbar } from 'src/app/core/toolbar/toolbar';
import { USER_TYPE } from 'src/app/shared/const';

interface MedicalData {
  firstName: string;
  lastName: string;
  birthDate: string | null;
  bloodType: string | null;
  allergies: string | null;
  conditions: string | null;
  medications: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  notes: string | null;
}

@Component({
  selector: 'app-emergency-page',
  standalone: true,
  imports: [CommonModule, Toolbar, ...MATERIAL_IMPORTS],
  template: `
    <app-toolbar [userType]="userType"></app-toolbar>

    @if (loading()) {
      <div class="state-container">
        <mat-spinner diameter="48"></mat-spinner>
        <p>Caricamento dati medici...</p>
      </div>
    } @else if (error()) {
      <div class="state-container">
        <mat-icon class="error-icon">error_outline</mat-icon>
        <p>{{ error() }}</p>
      </div>
    } @else if (data()) {
      @let d = data()!;
      <div class="emergency-page">

        <header class="emergency-header">
          <mat-icon class="header-icon">medical_services</mat-icon>
          <div>
            <h1>{{ d.firstName }} {{ d.lastName }}</h1>
            @if (d.birthDate) {
              <p class="birth-date">Nato/a il {{ d.birthDate | date: 'dd/MM/yyyy' }}</p>
            }
          </div>
        </header>

        <!-- Dati critici in evidenza -->
        <section class="critical-section">
          <div class="critical-card blood-type">
            <span class="critical-label">Gruppo sanguigno</span>
            <span class="critical-value">{{ d.bloodType ?? '—' }}</span>
          </div>
          <div class="critical-card allergies" [class.has-value]="d.allergies">
            <span class="critical-label">
              <mat-icon>warning</mat-icon>
              Allergie
            </span>
            <span class="critical-value small">{{ d.allergies ?? 'Nessuna allergia dichiarata' }}</span>
          </div>
        </section>

        <!-- Dati secondari -->
        <section class="info-section">
          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-icon mat-card-avatar>monitor_heart</mat-icon>
              <mat-card-title>Patologie</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>{{ d.conditions || 'Nessuna patologia dichiarata' }}</p>
            </mat-card-content>
          </mat-card>

          <mat-card appearance="outlined">
            <mat-card-header>
              <mat-icon mat-card-avatar>medication</mat-icon>
              <mat-card-title>Farmaci assunti</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>{{ d.medications || 'Nessun farmaco dichiarato' }}</p>
            </mat-card-content>
          </mat-card>

          @if (d.emergencyContactName || d.emergencyContactPhone) {
            <mat-card appearance="outlined">
              <mat-card-header>
                <mat-icon mat-card-avatar>call</mat-icon>
                <mat-card-title>Contatto di emergenza</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                @if (d.emergencyContactName) {
                  <p>{{ d.emergencyContactName }}</p>
                }
                @if (d.emergencyContactPhone) {
                  <a [href]="'tel:' + d.emergencyContactPhone" class="phone-link">
                    <mat-icon>phone</mat-icon>
                    {{ d.emergencyContactPhone }}
                  </a>
                }
              </mat-card-content>
            </mat-card>
          }

          @if (d.notes) {
            <mat-card appearance="outlined">
              <mat-card-header>
                <mat-icon mat-card-avatar>notes</mat-icon>
                <mat-card-title>Note aggiuntive</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>{{ d.notes }}</p>
              </mat-card-content>
            </mat-card>
          }
        </section>

      </div>
    }
  `,
  styles: `
    /* ── Layout generale ── */
    .emergency-page {
      max-width: 680px;
      margin: 0 auto;
      padding: 16px;
    }

    .state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      min-height: 60vh;
      color: var(--mat-sys-on-surface-variant);
    }

    .error-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--mat-sys-error);
    }

    /* ── Header ── */
    .emergency-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 0 20px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      margin-bottom: 24px;
    }

    .header-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--mat-sys-primary);
      flex-shrink: 0;
    }

    .emergency-header h1 {
      margin: 0;
      font-size: 1.6rem;
      font-weight: 600;
      line-height: 1.2;
    }

    .birth-date {
      margin: 4px 0 0;
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.9rem;
    }

    /* ── Sezione critica (gruppo sanguigno + allergie) ── */
    .critical-section {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }

    .critical-card {
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .blood-type {
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
      align-items: center;
      justify-content: center;
      min-width: 100px;
      text-align: center;
    }

    .allergies {
      background: var(--mat-sys-surface-variant);
      color: var(--mat-sys-on-surface-variant);
    }

    .allergies.has-value {
      background: var(--mat-sys-error-container);
      color: var(--mat-sys-on-error-container);
    }

    .critical-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .critical-label mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .critical-value {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1;
    }

    .critical-value.small {
      font-size: 1rem;
      font-weight: 500;
    }

    /* ── Sezione info secondarie ── */
    .info-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    mat-card-content p {
      margin: 8px 0 0;
      line-height: 1.5;
    }

    .phone-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      color: var(--mat-sys-primary);
      text-decoration: none;
      font-weight: 500;
      font-size: 1.1rem;
    }

    @media (max-width: 480px) {
      .critical-section {
        grid-template-columns: 1fr;
      }

      .blood-type {
        min-width: unset;
      }
    }
  `,
})
export class EmergencyPage implements OnInit {
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  data = signal<MedicalData | null>(null);
  userType : USER_TYPE = USER_TYPE.rescuer;
  private readonly baseUrl = 'http://localhost:8080/crypt';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID non valido.');
      this.loading.set(false);
      return;
    }

    this.http.get<{ result: MedicalData }>(`${this.baseUrl}/decrypt/${id}`).subscribe({
      next: (response) => {
        this.data.set(response.result);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.status === 404
            ? 'Nessun dato trovato per questo QR code.'
            : 'Errore nel caricamento dei dati. Riprovare.');
        this.loading.set(false);
      },
    });
  }
}
