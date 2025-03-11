import { Component } from '@angular/core';
import {FormGroup, ReactiveFormsModule, FormControl, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {

  errorMessage: string = '';

userForm : FormGroup= new FormGroup({
email: new FormControl('',[Validators.required, Validators.email]),
password: new FormControl('',[Validators.required, Validators.minLength(5)])

});

constructor(private router: Router){}

navigateToRegister(){
  this.router.navigate(['/register']);
}

onUserSave(){
console.log(this.userForm.value);
}

}
