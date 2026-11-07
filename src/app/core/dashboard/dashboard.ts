import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MedicalForm } from 'src/app/features/medical-form/medical-form';
import { QrcodeCard } from 'src/app/features/qrcode-card/qrcode-card';
import { MATERIAL_IMPORTS } from 'src/app/shared/material.imports';
import { AuthService } from './../../services/auth.service';
import { CryptService } from './../../services/crypt.service';
import { Toolbar } from 'src/app/core/toolbar/toolbar';
import { USER_TYPE } from 'src/app/shared/const';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ToastrModule, MedicalForm, QrcodeCard, Toolbar, ...MATERIAL_IMPORTS],
  template:`
    <app-toolbar [userType]="userType"></app-toolbar>
    <div class="dashboard-container">
      <app-qrcode-card [qrCode]="qrCode()" (download)="downloadQrCode()"></app-qrcode-card>
      <app-medical-form (save)="saveMedicalData($event)" (loaded)="onLoaded($event)"></app-medical-form>
    </div>
  `,
  styles: `
    .toolbar {
      display: flex;
      justify-content: space-between;
    }

    .dashboard-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: start;
      gap: 24px;
      padding: 24px;
    }

    @media (max-width: 900px) {
      .dashboard-container {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Dashboard {
  qrCode = signal<string | null>(null);
  userType : USER_TYPE = USER_TYPE.user;
  @ViewChild(MedicalForm) medicalForm!: MedicalForm;

  constructor(
    private authService: AuthService,
    private cryptService: CryptService,
    private router: Router,
    private toaster: ToastrService,
  ) {}

  ngAfterViewInit() {
    this.medicalForm.getUser();
  }

  saveMedicalData(medicalData: any) {
    this.cryptService.encrypt(medicalData).subscribe({
      next: (qrCode) => {
        this.qrCode.set(qrCode);
        this.toaster.success('Dati aggiornai correttamente');
        this.medicalForm.getUser();
      },
      error: (err) => {
        // missing or expired token
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.toaster.error('Sessione scaduta, effettua di nuovo il login');
          this.router.navigate(['/login']);
          return;
        }

        console.error(err);
        this.toaster.error(
          err.error?.message ?? err.error?.error ?? 'Errore durante il salvataggio dei dati',
        );
      },
    });
  }

  downloadQrCode() {
    const dataUrl = this.qrCode();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qrcode-medico.png';
    link.click();
  }

  onLoaded(qrCode: any) {
    this.qrCode.set(qrCode)
  }

  logout() {
    this.authService.logout();
    console.log(localStorage.getItem("jwt"));
    this.router.navigate(['./login']);
  }
}
