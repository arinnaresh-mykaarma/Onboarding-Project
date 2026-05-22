import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { NewUserDto, UserDto } from '../../../../core/models/user.model';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-user.html',
  styleUrls: ['./update-user.css']
})
export class UpdateUser implements OnInit {

  id: number | null = null;

  form = {
    name: '',
    email: '',
    age: null as number | null
  };

  loadedUser = signal<UserDto | null>(null);
  updatedUser = signal<UserDto | null>(null);
  successMessage = signal('');
  errorMessage = signal('');
  isLoadingUser = signal(false);
  isUpdating = signal(false);

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idFromRoute = this.route.snapshot.queryParamMap.get('id');

    if (idFromRoute) {
      this.id = Number(idFromRoute);
      this.loadUser();
    }
  }

  loadUser(): void {
    if (this.id === null || Number.isNaN(this.id)) {
      this.errorMessage.set('Please enter a valid user ID');
      return;
    }

    this.isLoadingUser.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');
    this.loadedUser.set(null);
    this.updatedUser.set(null);

    this.userService.getUserById(this.id)
      .pipe(
        timeout(10000),
        finalize(() => this.isLoadingUser.set(false))
      )
      .subscribe({
        next: data => {
          this.loadedUser.set(data);

          this.form = {
            name: data.name,
            email: data.email,
            age: data.age
          };
        },
        error: err => {
          console.error(err);
          this.errorMessage.set('User not found');
        }
      });
  }

  updateUser(): void {
    if (
      this.id === null ||
      Number.isNaN(this.id) ||
      !this.form.name.trim() ||
      !this.form.email.trim() ||
      this.form.age === null
    ) {
      this.errorMessage.set('Please enter ID and fill all fields');
      this.successMessage.set('');
      return;
    }

    const payload: NewUserDto = {
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      age: Number(this.form.age)
    };

    this.isUpdating.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');
    this.updatedUser.set(null);

    this.userService.updateUser(this.id, payload)
      .pipe(
        timeout(10000),
        finalize(() => this.isUpdating.set(false))
      )
      .subscribe({
        next: data => {
          this.updatedUser.set(data);
          this.loadedUser.set(data);
          this.successMessage.set('User updated successfully');
        },
        error: err => {
          console.error(err);
          this.errorMessage.set('Unable to update user');
        }
      });
  }
}
