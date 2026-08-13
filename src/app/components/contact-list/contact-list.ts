import { Component, input, output } from '@angular/core';

import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.html'
})
export class ContactList {
  readonly contacts = input.required<readonly Contact[]>();
  readonly editContact = output<Contact>();
}
