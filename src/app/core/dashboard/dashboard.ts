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
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastrModule, ...MATERIAL_IMPORTS],
  template: `
    <p>Dashboard funziona!</p>
  `,
  styles: `
  `,
})
export class Dashboard {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toaster: ToastrService,
  ) {}

  ngOnInit() {

  }
}
