import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  isEditMode = false;
  contactId?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9\\-\\+\\s]{10,15}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.maxLength(200)],
      note: ['', Validators.maxLength(500)],
      birthDate: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.contactId = +id;
        this.loadContact(this.contactId);
      }
    });
  }

  loadContact(id: number): void {
    this.loading = true;
    this.contactService.getContact(id).subscribe({
      next: (contact) => {
        this.contactForm.patchValue(contact);
        this.loading = false;
      },
      error: (err) => {
        console.error('Kişi yüklenirken hata:', err);
        this.loading = false;
        this.toastr.error(
          this.translate.instant('CONTACT_LOAD_ERROR'),
          this.translate.instant('ERROR')
        );
      }
    });
  }

  onSubmit(): void {
  if (this.contactForm.invalid) {
    this.toastr.warning(
      this.translate.instant('FORM_INVALID'),
      this.translate.instant('WARNING')
    );
    return;
  }

  this.loading = true;

  if (this.isEditMode && this.contactId) {
    // ✅ GÜNCELLEME İÇİN
    const contactData: Contact = {
      id: this.contactId,
      firstName: this.contactForm.value.firstName,
      lastName: this.contactForm.value.lastName,
      phone: this.contactForm.value.phone,
      email: this.contactForm.value.email,
      address: this.contactForm.value.address || '',
      note: this.contactForm.value.note || '',
      birthDate: this.contactForm.value.birthDate || null // ✅ eklendi
    };

    this.contactService.updateContact(this.contactId, contactData).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success(
          this.translate.instant('CONTACT_UPDATED'),
          this.translate.instant('SUCCESS')
        );
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Güncelleme hatası:', err);
        this.loading = false;
        this.toastr.error(
          this.translate.instant('CONTACT_UPDATE_ERROR'),
          this.translate.instant('ERROR')
        );
      }
    });
  } else {
    // ✅ EKLEME İÇİN (newContact)
    const newContact: Contact = {
      firstName: this.contactForm.value.firstName,
      lastName: this.contactForm.value.lastName,
      phone: this.contactForm.value.phone,
      email: this.contactForm.value.email,
      address: this.contactForm.value.address || '',
      note: this.contactForm.value.note || '',
      birthDate: this.contactForm.value.birthDate || null // ✅ eklendi
    };

    this.contactService.addContact(newContact).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success(
          this.translate.instant('CONTACT_ADDED'),
          this.translate.instant('SUCCESS')
        );
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Ekleme hatası:', err);
        this.loading = false;
        this.toastr.error(
          this.translate.instant('CONTACT_ADD_ERROR'),
          this.translate.instant('ERROR')
        );
      }
    });
  }
}

  onCancel(): void {
    this.router.navigate(['/']);
  }

  get f() {
    return this.contactForm.controls;
  }
}