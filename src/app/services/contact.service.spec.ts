import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Contact } from '../models/contact.model';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;
  let httpTesting: HttpTestingController;
  const storage = new Map<string, string>();
  const localStorageMock: Storage = {
    get length() {
      return storage.size;
    },
    clear: () => storage.clear(),
    getItem: (key) => storage.get(key) ?? null,
    key: (index) => [...storage.keys()][index] ?? null,
    removeItem: (key) => storage.delete(key),
    setItem: (key, value) => storage.set(key, value),
  };

  const contacts: Contact[] = [
    {
      id: '1',
      firstName: 'Laura',
      lastName: 'Gómez',
      email: 'laura@example.com',
      phones: ['+57 300 123 4567'],
    },
  ];

  beforeAll(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: localStorageMock,
    });
  });

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ContactService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('loads initial contacts from the JSON file and stores them', () => {
    service.loadContacts();

    const request = httpTesting.expectOne('/data/contacts.json');
    request.flush(contacts);

    expect(service.contacts()).toEqual(contacts);
    expect(JSON.parse(localStorage.getItem('contacts') ?? '[]')).toEqual(contacts);
    expect(service.isLoading()).toBe(false);
  });

  it('uses contacts from localStorage without requesting the JSON file', () => {
    localStorage.setItem('contacts', JSON.stringify(contacts));

    service.loadContacts();

    httpTesting.expectNone('/data/contacts.json');
    expect(service.contacts()).toEqual(contacts);
  });

  it('updates a contact in memory and localStorage', () => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
    service.loadContacts();

    const updatedContact = { ...contacts[0], firstName: 'Laurita' };
    service.updateContact(updatedContact);

    expect(service.contacts()[0].firstName).toBe('Laurita');
    expect(JSON.parse(localStorage.getItem('contacts') ?? '[]')[0].firstName).toBe('Laurita');
  });

  it('falls back to the JSON file when stored data is invalid', () => {
    localStorage.setItem('contacts', JSON.stringify({ invalid: true }));

    service.loadContacts();

    const request = httpTesting.expectOne('/data/contacts.json');
    request.flush(contacts);
    expect(service.contacts()).toEqual(contacts);
  });
});
