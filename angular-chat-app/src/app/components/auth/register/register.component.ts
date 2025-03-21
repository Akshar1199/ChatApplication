import { UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  errorMessage: string = '';

  userForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });
  constructor(private router: Router, private authServ: AuthService) {}

  navigateToLogIn() {
    this.router.navigate(['/login']);
  }

  onUserSave() {
    this.authServ
      .register(this.userForm.value.email, this.userForm.value.password, this.userForm.value.userName)
      .subscribe({
        next: (userCredential) => {
          alert("Register Successfully");
          console.log(userCredential.user.uid);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
      });
  }
}
