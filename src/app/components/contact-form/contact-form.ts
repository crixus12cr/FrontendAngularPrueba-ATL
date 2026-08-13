import { Component, effect, inject, input, output } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Contact } from '../../models/contact.model';

export type ContactFormValue = Omit<Contact, 'id'> & { id?: string };

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html'
})
export class ContactForm {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly contact = input<Contact | null>(null);
  readonly saved = output<ContactFormValue>();
  readonly cancelled = output<void>();

  readonly form = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phones: this.formBuilder.array([this.createPhoneControl()])
  });

  get phones() {
    return this.form.controls.phones;
  }

  constructor() {
    effect(() => {
      const contact = this.contact();

      this.form.controls.firstName.setValue(contact?.firstName ?? '');
      this.form.controls.lastName.setValue(contact?.lastName ?? '');
      this.form.controls.email.setValue(contact?.email ?? '');

      this.phones.clear();
      const phones = contact?.phones.length ? contact.phones : [''];
      phones.forEach((phone) => this.phones.push(this.createPhoneControl(phone)));

      this.form.markAsPristine();
      this.form.markAsUntouched();
    });
  }

  addPhone(): void {
    this.phones.push(this.createPhoneControl());
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const contact = this.contact();

    this.saved.emit(contact ? { ...value, id: contact.id } : value);
  }

  private createPhoneControl(value = ''): FormControl<string> {
    return this.formBuilder.control(value, [
      Validators.required,
      Validators.pattern(/^[0-9+()\s-]{7,20}$/)
    ]);
  }
}
