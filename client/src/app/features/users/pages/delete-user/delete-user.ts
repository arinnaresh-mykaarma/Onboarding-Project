import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './delete-user.html',
  styleUrls: ['./delete-user.css']
})
export class DeleteUser implements OnInit {

  id: number | null = null;
  deletedId = signal<number | null>(null);
  successMessage = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idFromRoute = this.route.snapshot.queryParamMap.get('id');

    if (idFromRoute) {
      this.id = Number(idFromRoute);
    }
  }

  deleteUser(): void {
    if (this.id === null || Number.isNaN(this.id)) {
      this.errorMessage.set('Please enter a valid user ID');
      this.successMessage.set('');
      return;
    }

    const idToDelete = this.id;

    this.isLoading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');
    this.deletedId.set(null);

    this.userService.deleteUser(idToDelete)
      .pipe(
        timeout(10000),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.deletedId.set(idToDelete);
          this.successMessage.set('User deleted successfully');
          this.id = null;
        },
        error: err => {
          console.error(err);
          this.errorMessage.set('Unable to delete user');
        }
      });
  }
}
