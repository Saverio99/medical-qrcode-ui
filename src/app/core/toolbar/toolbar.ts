import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { MATERIAL_IMPORTS } from 'src/app/shared/material.imports';
import { environment } from 'src/environments/environment';
import { AuthService } from './../../services/auth.service';
import { LANGUAGES, USER_TYPE } from 'src/app/shared/const';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, ToastrModule, ...MATERIAL_IMPORTS ],
  template:`
    <mat-toolbar class="toolbar">
      <span>{{title}}</span>

      <div class="right-side">
        <div class="language-selector">
          <i class="fa-sm fa-solid fa-language"></i>
          <mat-form-field>
            <mat-label>Lingua: {{defaultLanguage != null ? "" : "Seleziona la lingua"}}</mat-label>
            <mat-select matNativeControl [value]="defaultLanguage.value" required>
              @for(language of languages; track language.value){
                <mat-option [value]="language.value">{{language.label}}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        @if(userType === userTypes.user) {
          <button mat-button matButton="filled" (click)="logout()">Logout</button>
        }
      </div>
    </mat-toolbar>
  `,
  styles: `
    .toolbar {
      display: flex;
      justify-content: space-between;
    }

    .toolbar .right-side {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
    }
  `,
})
export class Toolbar implements OnInit{
  @Input() userType!: USER_TYPE;
  userTypes = USER_TYPE;
  title: string = environment.title;
  language: string = "";
  languages = LANGUAGES;
  defaultLanguage!: any;

  constructor( private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getUserLanguage();
  }

  logout() {
    this.authService.logout();
    console.log(localStorage.getItem("jwt"));
    this.router.navigate(['./login']);
  }

   getGeoloacalization() {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    });
  }

  getUserLanguage() {
    this.language = navigator.language;
    console.log(`Language: ${navigator.language}`);
    const arrayLang = [...LANGUAGES]
    arrayLang.forEach(element => {
      if(this.language.toLocaleLowerCase() === element.value) {
        console.log("default language: ", element);
        this.defaultLanguage = element;
      }
    });
  }
}
