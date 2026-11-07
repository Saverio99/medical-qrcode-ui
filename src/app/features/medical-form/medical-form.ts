import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/services/profile.service';
import { BLOOD_TYPES } from 'src/app/shared/const';
import { MATERIAL_IMPORTS } from 'src/app/shared/material.imports';
import { CryptService } from './../../services/crypt.service';


@Component({
  selector: 'app-medical-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_IMPORTS],
  template: `
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title>Dati medici</mat-card-title>
        <mat-card-subtitle>Inserisci le informazioni da associare al QR code</mat-card-subtitle>
      </mat-card-header>
      <form [formGroup]="medicalForm" (ngSubmit)="onSave()">
        <mat-card-content>
          <div class="form-grid">
            <mat-form-field>
              <mat-label>Nome</mat-label>
              <input matInput formControlName="firstName" />
              @if (medicalForm.get('firstName')?.hasError('required')) {
                <mat-error>Il nome è obbligatorio</mat-error>
              }
            </mat-form-field>
            <mat-form-field>
              <mat-label>Cognome</mat-label>
              <input matInput formControlName="lastName" />
              @if (medicalForm.get('lastName')?.hasError('required')) {
                <mat-error>Il cognome è obbligatorio</mat-error>
              }
            </mat-form-field>
            <mat-form-field>
              <mat-label>Data di nascita</mat-label>
              <input matInput type="date" formControlName="birthDate" />
            </mat-form-field>
            <mat-form-field>
              <mat-label>Gruppo sanguigno</mat-label>
              <mat-select formControlName="bloodType">
                @for (bloodType of bloodTypesList; track bloodType) {
                  <mat-option [value]="bloodType">{{ bloodType }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field class="full-width">
              <mat-label>Allergie</mat-label>
              <textarea matInput rows="2" formControlName="allergies"></textarea>
            </mat-form-field>
            <mat-form-field class="full-width">
              <mat-label>Patologie</mat-label>
              <textarea matInput rows="2" formControlName="conditions"></textarea>
            </mat-form-field>
            <mat-form-field class="full-width">
              <mat-label>Farmaci assunti</mat-label>
              <textarea matInput rows="2" formControlName="medications"></textarea>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Contatto di emergenza</mat-label>
              <input matInput formControlName="emergencyContactName" />
            </mat-form-field>
            <mat-form-field>
              <mat-label>Telefono di emergenza</mat-label>
              <input matInput type="tel" formControlName="emergencyContactPhone" />
            </mat-form-field>
            <mat-form-field class="full-width">
              <mat-label>Note</mat-label>
              <textarea matInput rows="3" formControlName="notes"></textarea>
            </mat-form-field>
          </div>
        </mat-card-content>
        <mat-card-actions align="end">
          <button matButton="filled" type="submit">
            <mat-icon>save</mat-icon>
            Salva
          </button>
        </mat-card-actions>
      </form>
    </mat-card>
  `,
  styles: `
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 16px;
      padding-top: 16px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    mat-card-actions {
      padding: 0 16px 16px;
    }

    @media (max-width: 600px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class MedicalForm {
  @Output() save = new EventEmitter<any>();
  @Output() loaded = new EventEmitter<any>();

  fb = new FormBuilder();
  medicalForm!: FormGroup;

  bloodTypesList = BLOOD_TYPES;

  constructor(private profileService: ProfileService, private cryptService: CryptService, private toaster: ToastrService) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.medicalForm = this.fb.group({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      birthDate: new FormControl(null),
      bloodType: new FormControl(null),
      allergies: new FormControl(null),
      conditions: new FormControl(null),
      medications: new FormControl(null),
      emergencyContactName: new FormControl(null),
      emergencyContactPhone: new FormControl(null),
      notes: new FormControl(null),
    });
  }

  public getUser() {
    this.profileService.getUserProfile().subscribe((response) => {
      console.log(response);
      if(response?.medicalProfile.id) {
        this.loaded.emit(response.qrCode);
        this.cryptService.decrypt(response.medicalProfile.id).subscribe((response) => {
        this.medicalForm.patchValue(response);
      })
      }
      else {
        this.toaster.warning("Non hai ancora inserito i dati per il tuo utente");
      }
    })
  }

  onSave() {
    if (this.medicalForm.invalid) return;

    this.save.emit(this.medicalForm.value);
  }
}
