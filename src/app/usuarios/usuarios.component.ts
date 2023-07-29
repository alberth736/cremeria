import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface User {
  id: number;
  name: string;
  email: string;
  user_detail: {
    address: string;
    phone_number: string;
  };
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent {
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'address',
    'phone_number',
    'actions',
  ];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog
  ) {
    this.getUsers();
  }

  getUsers() {
    this.http.get<User[]>('http://localhost:8000/api/users').subscribe({
      next: (users) => {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error al obtener los usuarios:', error);
      },
    });
  }

  cerrarSesion() {
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  editUser(id: number): void {
    const user = this.dataSource.data.find((user) => user.id === id);
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '250px',
      data: user,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getUsers();
    });
  }

  deleteUser(id: number): void {
    if (confirm('¿Está seguro que desea eliminar el usuario?')) {
      //Make a delete request
      this.http.delete(`http://localhost:8000/api/users/${id}`).subscribe({
        next: (response) => {
          console.log('response', response);
          this.getUsers();
        },
        error: (error) => {
          console.error('Error al eliminar el usuario:', error);
        },
      });
    }
  }
  addUser(): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '250px',
      data: null,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getUsers();
    });
  }
}
