import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  /* name: string = 'jovanny';
  email: string = 'jovannyrch@gmail.com';
  address: string = 'address';
  phone: string = '1234567890';
  password: string = '123qwe';
  confirmPassword: string = '123qwe';
  errorMessage: string = '';
 */
  name: string = '';
  email: string = '';
  address: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';

  emailErrorMessage: string = '';
  passwordErrorMessage: string = '';
  confirmPasswordErrorMessage: string = '';
  nameErrorMessage: string = '';
  addressErrorMessage: string = '';
  phoneErrorMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit() {
    if (!this.validInputs()) return;
    //Valid all fields

    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    const detailsData = {
      user_id: 0,
      address: this.address,
      phone_number: this.phone,
    };

    this.http
      .post('http://localhost:8000/api/users', userData)
      .subscribe((response: any) => {
        if (response?.status === 1) {
          const userId = response.user_id;
          detailsData.user_id = userId;

          this.http
            .post('http://localhost:8000/api/udetails', detailsData)
            .subscribe((response: any) => {
              if (response?.status === 1) {
                alert('Usuario registrado correctamente');
                this.router.navigate(['/login']);
              } else {
                this.confirmPasswordErrorMessage =
                  'Errror al registrar usuario';
              }
            });

          //Create
        } else {
          this.confirmPasswordErrorMessage =
            response?.message || 'Errror al registrar usuario';
        }
      });
  }

  validInputs() {
    let hasErrors = false;

    this.emailErrorMessage = '';
    this.passwordErrorMessage = '';
    this.confirmPasswordErrorMessage = '';
    this.nameErrorMessage = '';
    this.addressErrorMessage = '';
    this.phoneErrorMessage = '';

    if (this.name === '') {
      this.nameErrorMessage = 'El nombre es requerido';
      hasErrors = true;
    }

    if (this.email === '') {
      this.emailErrorMessage = 'El email es requerido';
      hasErrors = true;
    }

    if (this.address === '') {
      this.addressErrorMessage = 'La dirección es requerida';
      hasErrors = true;
    }

    if (this.phone === '') {
      this.phoneErrorMessage = 'El teléfono es requerido';
      hasErrors = true;
    }

    if (this.password === '') {
      this.passwordErrorMessage = 'La contraseña es requerida';
      hasErrors = true;
    }

    if (this.confirmPassword === '') {
      this.confirmPasswordErrorMessage =
        'La confirmación de contraseña es requerida';
      hasErrors = true;
    }

    if (hasErrors) return false;

    //Check if email is valid

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(this.email)) {
      this.emailErrorMessage = 'El email no es válido';
      hasErrors = true;
    }

    //Password length must be greater than 6
    if (this.password.length < 6) {
      this.passwordErrorMessage =
        'La contraseña debe tener al menos 6 caracteres';
      hasErrors = true;
    }

    if (this.password !== this.confirmPassword) {
      this.confirmPasswordErrorMessage =
        'La confirmación de contraseña no coincide';
      hasErrors = true;
    }

    if (hasErrors) return false;

    return true;
  }
}
