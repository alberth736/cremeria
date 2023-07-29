// login.component.ts
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  passwordErrorMessage: string = '';
  emailErrorMessage: string = '';
  passwordValue: string = '';
  emailValue: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.validInputs()) {
      this.http
        .post('http://localhost:8000/api/login', {
          email: this.emailValue,
          password: this.passwordValue,
        })
        .subscribe(
          (response: any) => {
            if (response?.status === 1) {
              localStorage.setItem('user', response.user.name);
              localStorage.setItem('user_id', response.user.id);
              this.router.navigate(['/home']);
            } else {
              alert('Usuario no encontrado');
            }
          },
          (error) => {
            console.error(error);
            // Handle the HTTP request error here
          }
        );
    }
  }

  validInputs() {
    let hasErrors = false;
    this.emailErrorMessage = '';
    this.passwordErrorMessage = '';
    if (this.emailValue === '') {
      this.emailErrorMessage = 'El email es requerido';
      hasErrors = true;
    }

    if (this.passwordValue === '') {
      this.passwordErrorMessage = 'La contraseña es requerida';
      hasErrors = true;
    }

    if (hasErrors) return false;

    //Check if email is valid
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(this.emailValue)) {
      this.emailErrorMessage = 'El email no es válido';
      hasErrors = true;
    }

    //Password length must be greater than 6
    if (this.passwordValue.length < 6) {
      this.passwordErrorMessage =
        'La contraseña debe tener al menos 6 caracteres';
      hasErrors = true;
    }

    if (hasErrors) return false;

    return true;
  }
}
