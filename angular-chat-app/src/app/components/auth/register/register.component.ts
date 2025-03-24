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
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  errorMessage: string = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  defaultImageUrl: string = 'https://res.cloudinary.com/dlerpsnf1/image/upload/v1716922387/face-icon-png-4282_h0glhh.png';

  userForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    imageUrl: new FormControl(this.defaultImageUrl)
  });

  constructor(
    private router: Router,
    private authServ: AuthService,
    private http: HttpClient
  ) {}

  // Handle Image Selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Upload Image to Cloudinary
  private async uploadImageToCloudinary(file: File): Promise<string> {
    const cloudName = 'dkdq8yjgq';
    const uploadPreset = 'chat_app';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await firstValueFrom(
        this.http.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData)
      );
      return (response as any).secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return this.defaultImageUrl; // Return default image if upload fails
    }
  }


  async onUserSave() {
    try {
      let imageUrl = this.userForm.value.imageUrl; // Get default image URL

      if (this.selectedImage) {
        imageUrl = await this.uploadImageToCloudinary(this.selectedImage);
        this.userForm.patchValue({ imageUrl: imageUrl }); // Update form with uploaded image URL
      }

      this.authServ
        .register(
          this.userForm.value.email,
          this.userForm.value.password,
          this.userForm.value.userName,
          this.userForm.value.imageUrl
        )
        .subscribe({
          next: (userCredential) => {
            alert('Registered Successfully');
            console.log(userCredential.user.uid);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            this.errorMessage = error.message;
          },
        });
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  navigateToLogIn() {
    this.router.navigate(['/login']);
  }
}
