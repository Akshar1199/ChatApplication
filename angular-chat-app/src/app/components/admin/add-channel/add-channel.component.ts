import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChannelService } from '../../../services/channel.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-add-channel',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.css'
})
export class AddChannelComponent {

adminId: string = '';
errorMessage: string = '';

channelForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

constructor(private channelServ: ChannelService, private auth: Auth) {}

ngOnInit() {
  this.auth.onAuthStateChanged((user) => {
    if (user) {
      this.adminId = user.uid;
    }
  });
}

onChannelSave() {
  console.log(this.channelForm.value);
  this.channelServ.addChannel(this.channelForm.value.name, this.channelForm.value.description).subscribe({
    next: () => {
      this.channelForm.reset();
      alert("Channel Added Successfully");
    },
    error: (error) => {
      this.errorMessage = error.message;
    },
  });
}


}
