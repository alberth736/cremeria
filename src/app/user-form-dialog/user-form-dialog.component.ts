import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.css'],
})
export class UserFormDialogComponent {
  formGroup: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    private http: HttpClient,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) {
    console.log('user', user);
    this.formGroup = this.formBuilder.group({
      name: [user ? user.name : '', Validators.required],
      email: [user ? user.email : '', [Validators.required, Validators.email]],
      address: [user ? user.user_detail.address : '', Validators.required],
      phone: [user ? user.user_detail.phone_number : '', Validators.required],
      password: ['', user ? [] : Validators.required],
      confirmPassword: ['', user ? [] : Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      if (
        this.formGroup.get('password')?.value !==
        this.formGroup.get('confirmPassword')?.value
      ) {
        this.errorMessage = 'Las contraseñas no coinciden';
      } else {
        this.errorMessage = '';
        if (this.user) {
          this.updateUser();
        } else {
          this.createUser();
        }
      }
    }
  }

  updateUser() {
    const userId = this.user.id;
    const userData = {
      name: this.formGroup.get('name')?.value,
    };
    const detailsData = {
      address: this.formGroup.get('address')?.value,
      phone_number: this.formGroup.get('phone')?.value,
    };

    this.http
      .put(`http://localhost:8000/api/users/${userId}`, userData)
      .subscribe((response: any) => {
        if (response?.status === 1) {
          this.http
            .put(
              `http://localhost:8000/api/udetails/${this.user.user_detail.id}`,
              detailsData
            )
            .subscribe((response: any) => {
              if (response?.status === 1) {
                alert('Usuario actualizado correctamente');
                this.onCancel();
              } else {
                this.errorMessage = 'Error al actualizar usuario';
              }
            });
        } else {
          this.errorMessage =
            response?.message || 'Error al actualizar usuario';
        }
      });
  }

  createUser() {
    const userData = {
      name: this.formGroup.get('name')?.value,
      email: this.formGroup.get('email')?.value,
      password: this.formGroup.get('password')?.value,
    };

    const detailsData = {
      user_id: 0,
      address: this.formGroup.get('address')?.value,
      phone_number: this.formGroup.get('phone')?.value,
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
                this.onCancel();
              } else {
                this.errorMessage = 'Error al registrar usuario';
              }
            });

          //Create
        } else {
          this.errorMessage = response?.message || 'Error al registrar usuario';
        }
      });
  }
}
