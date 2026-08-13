import { Component, inject } from '@angular/core';

import { ContactList } from './components/contact-list/contact-list';
import { ContactService } from './services/contact.service';

@Component({
  selector: 'app-root',
  imports: [ContactList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly contactService = inject(ContactService);

  protected readonly contacts = this.contactService.contacts;
  protected readonly isLoading = this.contactService.isLoading;
  protected readonly error = this.contactService.error;

  constructor() {
    this.contactService.loadContacts();
  }
}
