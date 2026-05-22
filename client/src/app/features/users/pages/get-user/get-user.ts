import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { UserDto } from '../../../../core/models/user.model';

@Component({
  selector: 'app-get-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './get-user.html',
  styleUrls: ['./get-user.css']
})
export class GetUser implements OnInit {

  id: number | null = null;
  user = signal<UserDto | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idFromRoute = this.route.snapshot.queryParamMap.get('id');

    if (idFromRoute) {
      this.id = Number(idFromRoute);
      this.getUser();
    }
  }

  getUser(): void {
    if (this.id === null || Number.isNaN(this.id)) {
      this.errorMessage.set('Please enter a valid user ID');
      this.user.set(null);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.user.set(null);

    this.userService.getUserById(this.id)
      .pipe(
        timeout(10000),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: data => {
          this.user.set(data);
        },
        error: err => {
          console.error(err);
          this.errorMessage.set('User not found');
          this.user.set(null);
        }
      });
  }
}
