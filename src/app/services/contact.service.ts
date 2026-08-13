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
      },
    });
  }

  addContact(contact: Omit<Contact, 'id'>): void {
    const newContact: Contact = {
      ...contact,
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
    };

    this.updateContacts([...this.contactsState(), newContact]);
  }

  updateContact(contact: Contact): void {
    const contacts = this.contactsState().map((currentContact) =>
      currentContact.id === contact.id ? contact : currentContact,
    );

    this.updateContacts(contacts);
  }

  private updateContacts(contacts: Contact[]): void {
    this.contactsState.set(contacts);
    this.saveToStorage(contacts);
  }

  private readFromStorage(): Contact[] | null {
    try {
      const savedContacts = localStorage.getItem(this.storageKey);

      if (!savedContacts) {
        return null;
      }

      const parsedContacts: unknown = JSON.parse(savedContacts);

      if (this.isContactArray(parsedContacts)) {
        return parsedContacts;
      }

      localStorage.removeItem(this.storageKey);
      return null;
    } catch {
      return null;
    }
  }

  private saveToStorage(contacts: Contact[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(contacts));
    } catch {
      // The in-memory list remains usable when browser storage is unavailable.
    }
  }

  private isContactArray(value: unknown): value is Contact[] {
    return (
      Array.isArray(value) &&
      value.every(
        (contact) =>
          typeof contact === 'object' &&
          contact !== null &&
          typeof contact.id === 'string' &&
          typeof contact.firstName === 'string' &&
          typeof contact.lastName === 'string' &&
          typeof contact.email === 'string' &&
          Array.isArray(contact.phones) &&
          contact.phones.every((phone: unknown) => typeof phone === 'string'),
      )
    );
  }
}
