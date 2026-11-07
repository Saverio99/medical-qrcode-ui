import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CryptService {

  private baseUrl = environment.cryptUrl;

  constructor(private http: HttpClient) {}

  /**
   * Encrypt and store the data, returns the generated QR code as data URL
   */
  encrypt(data: any) {
    return this.http.post<{ message: string, qrCode: string }>(`${this.baseUrl}/encrypt`, data).pipe(
      map((response) => {
        const qrCode = response.qrCode;
        if (!qrCode) {
          throw new Error('QR code not found in the response');
        }
        return qrCode;
      }),
    );
  }

  /**
   * Returns the decrypted data stored with the given id
   */
  decrypt(id: string) {
    return this.http
      .get<{ result: any }>(`${this.baseUrl}/decrypt/${id}`)
      .pipe(map((response) => response.result));
  }
}
