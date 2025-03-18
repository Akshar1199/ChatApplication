import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-sidebar',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.css'
})
export class ChatSidebarComponent {

  @Input() items: any[] = [];
  @Input() isPrivateChat!: boolean;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() searchQuery = new EventEmitter<string>();
  searchText: string = '';

  selectChannel(channel: any) {
    this.itemSelected.emit(channel);
  }

  onSearchChange() {
    this.searchQuery.emit(this.searchText);
  }
}
