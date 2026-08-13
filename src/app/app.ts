import { Component, inject, signal } from '@angular/core';

import { ContactForm, ContactFormValue } from './components/contact-form/contact-form';
import { ContactList } from './components/contact-list/contact-list';
import { Contact } from './models/contact.model';
import { ContactService } from './services/contact.service';

@Component({
  selector: 'app-root',
  imports: [ContactForm, ContactList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly contactService = inject(ContactService);

  protected readonly contacts = this.contactService.contacts;
  protected readonly isLoading = this.contactService.isLoading;
  protected readonly error = this.contactService.error;
  protected readonly isFormOpen = signal(false);
  protected readonly selectedContact = signal<Contact | null>(null);

  constructor() {
    this.contactService.loadContacts();
  }

  protected openCreateForm(): void {
    this.selectedContact.set(null);
    this.isFormOpen.set(true);
  }

  protected openEditForm(contact: Contact): void {
    this.selectedContact.set({ ...contact, phones: [...contact.phones] });
    this.isFormOpen.set(true);
  }

  protected saveContact(value: ContactFormValue): void {
    const { id, ...contact } = value;

    if (id) {
      this.contactService.updateContact({ ...contact, id });
    } else {
      this.contactService.addContact(contact);
    }

    this.closeForm();
  }

  protected closeForm(): void {
    this.isFormOpen.set(false);
    this.selectedContact.set(null);
  }
}
