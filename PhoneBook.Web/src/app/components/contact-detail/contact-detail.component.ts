import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent implements OnInit {
  contact: Contact | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadContact(id);
      }
    });
  }

  loadContact(id: number): void {
    this.loading = true;
    this.contactService.getContact(id).subscribe({
      next: (data) => {
        this.contact = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Kişi detayı yüklenirken hata:', err);
        this.loading = false;
        this.toastr.error('Kişi detayı yüklenirken hata oluştu!', 'Hata');
        this.router.navigate(['/']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}