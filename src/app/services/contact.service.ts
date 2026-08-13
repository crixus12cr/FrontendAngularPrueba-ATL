import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { Contact } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'contacts';
  private readonly contactsState = signal<Contact[]>([]);
  private readonly loadingState = signal(true);
  private readonly errorState = signal<string | null>(null);

  readonly contacts = this.contactsState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  loadContacts(): void {
    const storedContacts = this.readFromStorage();

    if (storedContacts) {
      this.contactsState.set(storedContacts);
      this.loadingState.set(false);
      return;
    }

    this.http.get<Contact[]>('/data/contacts.json').subscribe({
      next: (contacts) => {
        this.contactsState.set(contacts);
        this.saveToStorage(contacts);
        this.loadingState.set(false);
      },
      error: () => {
        this.errorState.set('No fue posible cargar los contactos.');
        this.loadingState.set(false);
      }
    });
  }

  addContact(contact: Omit<Contact, 'id'>): void {
    const newContact: Contact = {
      ...contact,
      id: crypto.randomUUID()
    };

    this.updateContacts([...this.contactsState(), newContact]);
  }

  updateContact(contact: Contact): void {
    const contacts = this.contactsState().map((currentContact) =>
      currentContact.id === contact.id ? contact : currentContact
    );

    this.updateContacts(contacts);
  }

  private updateContacts(contacts: Contact[]): void {
    this.contactsState.set(contacts);
    this.saveToStorage(contacts);
  }

  private readFromStorage(): Contact[] | null {
    const savedContacts = localStorage.getItem(this.storageKey);

    if (!savedContacts) {
      return null;
    }

    try {
      return JSON.parse(savedContacts) as Contact[];
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private saveToStorage(contacts: Contact[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(contacts));
  }
}
