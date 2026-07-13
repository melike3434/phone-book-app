import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { AgeService } from '../../services/age.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AgGridAngular,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  contacts: Contact[] = [];
  originalContacts: Contact[] = [];
  colDefs: ColDef[] = [];
  searchTerm: string = '';
  selectedRows: any[] = [];
  viewMode: 'table' | 'card' = 'card';
  showFavoritesOnly: boolean = false;
  isVoiceListening: boolean = false;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private ngZone: NgZone,
    private translate: TranslateService,
    private toastr: ToastrService,
    public ageService: AgeService
  ) { }

  ngOnInit(): void {
    this.loadContacts();
    this.updateColumnHeaders();

    this.translate.onLangChange.subscribe(() => {
      this.updateColumnHeaders();
      this.contacts = [...this.contacts];
    });
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'table' ? 'card' : 'table';
  }

  toggleFavoritesFilter(): void {
    this.showFavoritesOnly = !this.showFavoritesOnly;
    this.applyFilters();
  }

  toggleFavorite(contact: Contact): void {
    if (!contact.id) return;

    const updatedContact = {
      ...contact,
      isFavorite: !contact.isFavorite
    };

    this.contactService.updateContact(contact.id, updatedContact).subscribe({
      next: () => {
        this.toastr.success(
          updatedContact.isFavorite ? '⭐ Favorilere eklendi!' : '⭐ Favorilerden çıkarıldı!',
          'Başarılı'
        );
        this.loadContacts();
      },
      error: (err) => {
        console.error('Favori güncellenirken hata:', err);
        this.toastr.error('Favori güncellenirken hata oluştu!', 'Hata');
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.originalContacts];

    if (this.showFavoritesOnly) {
      filtered = filtered.filter(c => c.isFavorite === true);
    }

    const searchTermLower = this.searchTerm.trim().toLowerCase();
    if (searchTermLower !== '') {
      filtered = filtered.filter(contact => {
        const firstName = (contact.firstName || '').toLowerCase();
        const lastName = (contact.lastName || '').toLowerCase();
        const phone = (contact.phone || '');
        const email = (contact.email || '').toLowerCase();
        const address = (contact.address || '').toLowerCase();
        return firstName.includes(searchTermLower) ||
               lastName.includes(searchTermLower) ||
               phone.includes(searchTermLower) ||
               email.includes(searchTermLower) ||
               address.includes(searchTermLower);
      });
    }

    this.contacts = filtered;
  }

  viewContact(id: number): void {
    this.ngZone.run(() => {
      this.router.navigate(['/detail', id]);
    });
  }

  editContact(id: number): void {
    this.ngZone.run(() => {
      this.router.navigate(['/edit', id]);
    });
  }

  updateColumnHeaders(): void {
    this.colDefs = [
      {
        field: 'id',
        headerName: this.translate.instant('ID'),
        width: 80,
        sortable: true,
        filter: true
      },
      {
        field: 'firstName',
        headerName: this.translate.instant('FIRST_NAME'),
        width: 150,
        sortable: true,
        filter: true
      },
      {
        field: 'lastName',
        headerName: this.translate.instant('LAST_NAME'),
        width: 150,
        sortable: true,
        filter: true
      },
      {
        field: 'phone',
        headerName: this.translate.instant('PHONE'),
        width: 150,
        sortable: true,
        filter: true
      },
      {
        field: 'email',
        headerName: this.translate.instant('EMAIL'),
        width: 220,
        sortable: true,
        filter: true
      },
      {
        field: 'address',
        headerName: this.translate.instant('ADDRESS'),
        width: 250,
        sortable: true,
        filter: true
      },
      {
        field: 'createdDate',
        headerName: this.translate.instant('CREATED_DATE'),
        width: 180,
        sortable: true,
        filter: true,
        valueFormatter: (params: any) => {
          return params.value ? new Date(params.value).toLocaleString('tr-TR') : '';
        }
      },
      {
        headerName: this.translate.instant('ACTIONS'),
        width: 280,
        cellRenderer: (params: any) => {
          const div = document.createElement('div');
          const viewText = this.translate.instant('VIEW');
          const editText = this.translate.instant('EDIT');
          const deleteText = this.translate.instant('DELETE');

          div.innerHTML = `
            <button class="btn btn-sm btn-info" data-action="view" data-id="${params.data.id}" style="margin-right:5px;">👁️ ${viewText}</button>
            <button class="btn btn-sm btn-primary" data-action="edit" data-id="${params.data.id}" style="margin-right:5px;">✏️ ${editText}</button>
            <button class="btn btn-sm btn-danger" data-action="delete" data-id="${params.data.id}">🗑️ ${deleteText}</button>
          `;

          div.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const button = target.closest('button');
            if (!button) return;

            const action = button.dataset['action'];
            const id = parseInt(button.dataset['id']!);

            if (action === 'delete') {
              this.onDeleteContact(id);
            } else if (action === 'edit') {
              this.ngZone.run(() => {
                this.router.navigate(['/edit', id]);
              });
            } else if (action === 'view') {
              this.ngZone.run(() => {
                this.router.navigate(['/detail', id]);
              });
            }
          });
          return div;
        }
      }
    ];
  }

  loadContacts(): void {
    this.contactService.getContacts().subscribe({
      next: (data) => {
        this.originalContacts = data;
        this.applyFilters();
        console.log('Kişiler yüklendi:', data);
      },
      error: (err) => {
        console.error('Kişiler yüklenirken hata:', err);
        this.toastr.error(
          this.translate.instant('LOAD_ERROR'),
          this.translate.instant('ERROR')
        );
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onSelectionChanged(event: any): void {
    this.selectedRows = event.api.getSelectedRows();
  }

  deleteSelected(): void {
    if (this.selectedRows.length === 0) return;

    Swal.fire({
      title: this.translate.instant('CONFIRM_DELETE'),
      text: `${this.translate.instant('DELETE_SELECTED_TEXT')} (${this.selectedRows.length} kişi)`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('YES_DELETE'),
      cancelButtonText: this.translate.instant('NO'),
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result: any) => {
      if (result.isConfirmed) {
        const ids = this.selectedRows.map(row => row.id);
        let deletedCount = 0;

        ids.forEach(id => {
          this.contactService.deleteContact(id).subscribe({
            next: () => {
              deletedCount++;
              if (deletedCount === ids.length) {
                this.toastr.success(
                  `${this.translate.instant('DELETED_TEXT')} (${deletedCount} kişi)`,
                  this.translate.instant('SUCCESS')
                );
                this.loadContacts();
                this.selectedRows = [];
              }
            },
            error: (err) => {
              console.error('Silme hatası:', err);
              this.toastr.error(
                this.translate.instant('DELETE_ERROR'),
                this.translate.instant('ERROR')
              );
            }
          });
        });
      }
    });
  }

  exportToExcel(): void {
    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.exportDataAsCsv({
        fileName: `phonebook_${new Date().toISOString().split('T')[0]}.csv`,
        columnKeys: ['id', 'firstName', 'lastName', 'phone', 'email', 'address', 'createdDate'],
        processHeaderCallback: (params: any) => {
          return this.translate.instant(params.column.getColDef().field?.toUpperCase() || '');
        }
      });

      this.toastr.success(
        this.translate.instant('EXPORT_SUCCESS'),
        this.translate.instant('SUCCESS')
      );
    }
  }

  onDeleteContact(id: number): void {
    const confirmTitle = this.translate.instant('CONFIRM_DELETE');
    const confirmText = this.translate.instant('CONFIRM_DELETE_TEXT');
    const yesDelete = this.translate.instant('YES_DELETE');
    const cancelText = this.translate.instant('NO');
    const deletedTitle = this.translate.instant('DELETED');
    const deletedText = this.translate.instant('DELETED_TEXT');
    const deleteError = this.translate.instant('DELETE_ERROR');

    Swal.fire({
      title: confirmTitle,
      text: confirmText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: yesDelete,
      cancelButtonText: cancelText,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.contactService.deleteContact(id).subscribe({
          next: () => {
            Swal.fire({
              title: deletedTitle,
              text: deletedText,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadContacts();
          },
          error: (err) => {
            console.error('Silme hatası:', err);
            Swal.fire({
              title: 'Hata!',
              text: deleteError,
              icon: 'error',
              confirmButtonText: 'Tamam'
            });
          }
        });
      }
    });
  }
}