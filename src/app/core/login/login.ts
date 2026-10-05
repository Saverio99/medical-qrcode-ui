import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MATERIAL_IMPORTS } from 'src/app/shared/material.imports';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastrModule, ...MATERIAL_IMPORTS],
  template: `
    <mat-tab-group [selectedIndex]="selectedTab" (selectedIndexChange)="selectedTab = $event">
      <mat-tab label="Login">
        <div class="login-container">
          <form [formGroup]="loginForm">
            <div>
              <mat-form-field>
                <mat-label>Username</mat-label>
                <input matInput formControlName="username" placeholder="username" />
              </mat-form-field>
            </div>
            <div>
              <mat-form-field>
                <mat-label>Password</mat-label>
                <input matInput formControlName="password" placeholder="password" />
              </mat-form-field>
            </div>
            <div class="button-container">
              <button mat-button matButton="filled" (click)="login()">Login</button>
              <button mat-button type="button" (click)="goToTab(1)">
                You are not registered yet? Please, do it.
              </button>
            </div>
          </form>
        </div>
      </mat-tab>
      <mat-tab label="Register">
        <div class="login-container" style="display:grid">
          <form [formGroup]="registerForm">
            <div>
              <mat-form-field>
                <mat-label>Username</mat-label>
                <input matInput formControlName="username" placeholder="username" />
              </mat-form-field>
            </div>
            <div>
              <mat-form-field>
                <mat-label>Password</mat-label>
                <input matInput formControlName="password" placeholder="password" />
              </mat-form-field>
            </div>
            <div>
              <mat-form-field>
                <mat-label>Conferma Password</mat-label>
                <input matInput formControlName="confirmPassword" placeholder="conferma password" />
                @if (registerForm.get('confirmPassword')?.hasError('mismatch')) {
                  <mat-error>La password non coincide</mat-error>
                }
              </mat-form-field>
            </div>
            <div>
              <button mat-button matButton="filled" (click)="register()">Registrami</button>
            </div>
          </form>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: `
    .login-container {
      display: grid;
      margin: 0 auto;
      padding: 10%;
      text-align: center;
    }

    .button-container {
      display: inline-grid;
    }
  `,
})
export class Login {
  fb = new FormBuilder();
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  selectedTab = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toaster: ToastrService,
  ) {}

  ngOnInit() {
    this.buildForms();
    this.formGroupChangeListener();
  }

  buildForms(): void {
    this.loginForm = this.fb.group({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });

    this.registerForm = this.fb.group({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, [
        Validators.required,
        this.confirmPasswordValidator(),
      ]),
    });
  }

  confirmPasswordValidator(): ValidatorFn {
    return (control) => {
      if (!this.registerForm) {
        return null;
      }

      if (!control.value) {
        return null;
      }

      const password = this.registerForm.get('password')?.value;
      return control.value === password ? null : { mismatch: true };
    };
  }

  formGroupChangeListener() {
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  goToTab(index: number) {
    this.selectedTab = index;
  }

  login() {
    if (this.loginForm.invalid) return;

    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.login(username, password).subscribe({
      next: (result: any) => {
        localStorage.setItem('jwt', result?.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.toaster.error(err.error.message);
      },
    });
  }

  register() {
    if (this.registerForm.invalid) return;

    const username = this.registerForm.get('username')?.value;
    const password = this.registerForm.get('password')?.value;

    this.authService.register(username, password).subscribe({
      next: (result: any) => {
        this.toaster.success(result.message);

        this.registerForm.reset();

        Object.values(this.registerForm.controls).forEach((control) => {
          control.markAsPristine();
          control.markAsUntouched();
        });

        this.selectedTab = 0;
      },
      error: (err) => {
        this.toaster.error(err.error.message);
      },
    });
  }
}
