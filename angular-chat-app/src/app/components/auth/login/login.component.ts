import { Component } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  errorMessage: string = '';

  userForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  constructor(private router: Router, private authServ: AuthService) {}

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  onUserSave() {
    this.authServ.login(this.userForm.value.email, this.userForm.value.password).subscribe({

      next: ({ userCredential, userName }) => {
        alert("Login Successfully");
        console.log("User ID:", userCredential.user.uid);
        console.log("Username:", userName);
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('userId', userCredential.user.uid);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        debugger;
        console.log(error)
        this.errorMessage = error.message;
      },
    });
  }

}
