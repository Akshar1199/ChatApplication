import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [CommonModule ,FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent {

  messages: any[] = [];
  messageText: string = '';

  constructor(private msgService: MessageService, private auth: Auth) {}

  ngOnInit() {

    // this.msgService.getMessages().subscribe((messages) => {
    //   this.messages = messages;
    // });
  }

  sendMessage() {
    // if (this.messageText.trim() !== '') {
    //   this.msgService
    //     .sendMessage(this.messageText, this.auth.currentUser?.uid!, 'receiverIdHere')
    //     .then(() => (this.messageText = ''))
    //     .catch((error) => console.error(error));
    // }
  }

}
