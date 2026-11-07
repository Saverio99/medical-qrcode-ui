import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MATERIAL_IMPORTS } from 'src/app/shared/material.imports';

@Component({
  selector: 'app-qrcode-card',
  standalone: true,
  imports: [CommonModule, ...MATERIAL_IMPORTS],
  template: `
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title>QR code</mat-card-title>
        <mat-card-subtitle>Generato al salvataggio dei dati medici</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="qrcode-container">
          @if (qrCode) {
            <img [src]="qrCode" alt="QR code dei dati medici" />
          } @else {
            <div class="qrcode-placeholder">
              <mat-icon>qr_code_2</mat-icon>
              <p>Salva i dati medici per generare il QR code</p>
            </div>
          }
        </div>
      </mat-card-content>
      <mat-card-actions align="end">
        <button matButton="filled" type="button" [disabled]="!qrCode" (click)="download.emit()">
          <mat-icon>download</mat-icon>
          Scarica
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    .qrcode-container {
      display: flex;
      justify-content: center;
      padding-top: 16px;
    }

    .qrcode-container img,
    .qrcode-placeholder {
      width: 100%;
      max-width: 320px;
      aspect-ratio: 1;
    }

    .qrcode-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 16px;
      text-align: center;
      border: 2px dashed var(--mat-sys-outline-variant);
      border-radius: 12px;
      color: var(--mat-sys-on-surface-variant);
    }

    .qrcode-placeholder mat-icon {
      width: 96px;
      height: 96px;
      font-size: 96px;
    }

    mat-card-actions {
      padding: 16px;
    }
  `,
})
export class QrcodeCard {
  // QR code as data URL, null until the form has been saved
  @Input() qrCode: string | null = null;
  @Output() download = new EventEmitter<void>();
}
