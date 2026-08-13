import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contact } from '../../models/contact.model';
import { ContactForm, ContactFormValue } from './contact-form';

describe('ContactForm', () => {
  let fixture: ComponentFixture<ContactForm>;
  let component: ContactForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('marks empty required fields as invalid', () => {
    component.submit();

    expect(component.form.invalid).toBe(true);
    expect(component.form.controls.firstName.touched).toBe(true);
    expect(component.phones.at(0).touched).toBe(true);
  });

  it('emits a valid new contact', () => {
    let emittedValue: ContactFormValue | undefined;
    component.saved.subscribe((value) => (emittedValue = value));
    component.form.setValue({
      firstName: 'Sofía',
      lastName: 'Torres',
      email: 'sofia@example.com',
      phones: ['+57 300 555 1212'],
    });

    component.submit();

    expect(emittedValue).toEqual(component.form.getRawValue());
  });

  it('allows multiple phone numbers', () => {
    component.addPhone();
    component.phones.at(1).setValue('+57 601 555 0101');

    expect(component.phones.length).toBe(2);
    expect(component.phones.at(1).value).toBe('+57 601 555 0101');
  });

  it('edits a copy and emits cancellation without changing the original contact', () => {
    const contact: Contact = {
      id: '1',
      firstName: 'Laura',
      lastName: 'Gómez',
      email: 'laura@example.com',
      phones: ['+57 300 123 4567'],
    };
    let wasCancelled = false;
    component.cancelled.subscribe(() => (wasCancelled = true));

    fixture.componentRef.setInput('contact', contact);
    fixture.detectChanges();
    component.form.controls.firstName.setValue('Otro nombre');
    component.cancelled.emit();

    expect(contact.firstName).toBe('Laura');
    expect(wasCancelled).toBe(true);
  });
});
