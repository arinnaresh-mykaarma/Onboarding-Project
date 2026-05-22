import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { UserDto } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserList implements OnInit {

  users = signal<UserDto[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService.getAllUsers()
      .pipe(
        timeout(10000),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: data => {
          this.users.set(data);
        },
        error: err => {
          console.error(err);
          this.errorMessage.set('Unable to load users from backend');
          this.users.set([]);
        }
      });
  }

  goToUpdate(id: number): void {
    this.router.navigate(['/users/update'], { queryParams: { id } });
  }

  goToGet(id: number): void {
    this.router.navigate(['/users/get'], { queryParams: { id } });
  }

  goToDelete(id: number): void {
    this.router.navigate(['/users/delete'], { queryParams: { id } });
  }
}
