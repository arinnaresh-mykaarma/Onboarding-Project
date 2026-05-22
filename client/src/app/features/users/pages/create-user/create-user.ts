import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize, timeout } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { NewUserDto, UserDto } from '../../../../core/models/user.model';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-user.html',
  styleUrls: ['./create-user.css']
})
export class CreateUser {

  form = {
    name: '',
    email: '',
    age: null as number | null
  };

  createdUser = signal<UserDto | null>(null);
  successMessage = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(private userService: UserService) {}

  createUser(): void {
    if (!this.form.name.trim() || !this.form.email.trim() || this.form.age === null) {
      this.errorMessage.set('Please fill all fields');
      this.successMessage.set('');
      this.createdUser.set(null);
      return;
    }

    const payload: NewUserDto = {
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      age: Number(this.form.age)
    };

    this.isLoading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');
    this.createdUser.set(null);

    this.userService.createUser(payload)
      .pipe(
        timeout(10000),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: data => {
          this.createdUser.set(data);
          this.successMessage.set('User created successfully');

          this.form = {
            name: '',
            email: '',
            age: null
          };
        },
        error: err => {
          console.error(err);
          this.errorMessage.set('Unable to create user');
          this.createdUser.set(null);
        }
      });
  }
}
