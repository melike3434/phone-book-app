using PhoneBook.Core.Entities;
using PhoneBook.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace PhoneBook.Service.Services
{
    /// <summary>
    /// Contact servisinin somut implementasyonu
    /// </summary>
    public class ContactService : IContactService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ContactService> _logger;

        public ContactService(IUnitOfWork unitOfWork, ILogger<ContactService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        /// <summary>
        /// Tüm kişileri getirir
        /// </summary>
        public async Task<IEnumerable<Contact>> GetAllContactsAsync()
        {
            try
            {
                _logger.LogInformation("Tüm kişiler getiriliyor...");
                var contacts = await _unitOfWork.Contacts.GetAllAsync();
                _logger.LogInformation($"Toplam {contacts?.Count() ?? 0} kişi getirildi.");
                return contacts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Kişiler getirilirken hata oluştu.");
                throw;
            }
        }

        /// <summary>
        /// ID'ye göre kişi getirir
        /// </summary>
        public async Task<Contact> GetContactByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation($"ID={id} olan kişi getiriliyor...");
                var contact = await _unitOfWork.Contacts.GetByIdAsync(id);
                
                if (contact == null)
                {
                    _logger.LogWarning($"ID={id} olan kişi bulunamadı.");
                }
                else
                {
                    _logger.LogInformation($"ID={id} olan kişi getirildi: {contact.FirstName} {contact.LastName}");
                }
                
                return contact;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"ID={id} olan kişi getirilirken hata oluştu.");
                throw;
            }
        }

        /// <summary>
        /// Yeni kişi ekler
        /// </summary>
        public async Task<Contact> AddContactAsync(Contact contact)
        {
            try
            {
                if (contact == null)
                {
                    throw new ArgumentNullException(nameof(contact), "Kişi bilgileri boş olamaz.");
                }

                _logger.LogInformation($"Yeni kişi ekleniyor: {contact.FirstName} {contact.LastName}");
                
                await _unitOfWork.Contacts.AddAsync(contact);
                await _unitOfWork.SaveChangesAsync();
                
                _logger.LogInformation($"Kişi başarıyla eklendi. ID={contact.Id}, Ad={contact.FirstName} {contact.LastName}");
                
                return contact;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Kişi eklenirken hata oluştu: {contact?.FirstName} {contact?.LastName}");
                throw;
            }
        }

        /// <summary>
        /// Kişi günceller (IsFavorite DAHİL)
        /// </summary>
        public async Task<Contact> UpdateContactAsync(Contact contact)
        {
            try
            {
                if (contact == null)
                {
                    throw new ArgumentNullException(nameof(contact), "Kişi bilgileri boş olamaz.");
                }

                _logger.LogInformation($"Kişi güncelleniyor: ID={contact.Id}, Ad={contact.FirstName} {contact.LastName}");
                
                // 1. Mevcut kişiyi veritabanından getir
                var existingContact = await _unitOfWork.Contacts.GetByIdAsync(contact.Id);
                
                if (existingContact == null)
                {
                    _logger.LogWarning($"ID={contact.Id} olan kişi bulunamadı. Güncelleme işlemi iptal edildi.");
                    return null;
                }

                // 2. Mevcut nesnenin özelliklerini güncelle (IsFavorite DAHİL)
                existingContact.FirstName = contact.FirstName;
                existingContact.LastName = contact.LastName;
                existingContact.Phone = contact.Phone;
                existingContact.Email = contact.Email;
                existingContact.Address = contact.Address;
                existingContact.IsFavorite = contact.IsFavorite;
                existingContact.Note = contact.Note;
                existingContact.BirthDate = contact.BirthDate; 

                // 3. Değişiklikleri kaydet
                await _unitOfWork.SaveChangesAsync();
                
                _logger.LogInformation($"Kişi başarıyla güncellendi: ID={contact.Id}, Ad={contact.FirstName} {contact.LastName}, Favori={contact.IsFavorite}");
                
                return existingContact;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Kişi güncellenirken hata oluştu: ID={contact?.Id}, Ad={contact?.FirstName} {contact?.LastName}");
                throw;
            }
        }

        /// <summary>
        /// Kişi siler
        /// </summary>
        public async Task DeleteContactAsync(int id)
        {
            try
            {
                _logger.LogInformation($"ID={id} olan kişi siliniyor...");
                
                var contact = await _unitOfWork.Contacts.GetByIdAsync(id);
                
                if (contact == null)
                {
                    _logger.LogWarning($"ID={id} olan kişi bulunamadı. Silme işlemi iptal edildi.");
                    throw new KeyNotFoundException($"ID={id} olan kişi bulunamadı.");
                }

                _unitOfWork.Contacts.Delete(contact);
                await _unitOfWork.SaveChangesAsync();
                
                _logger.LogInformation($"Kişi başarıyla silindi: ID={id}, Ad={contact.FirstName} {contact.LastName}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"ID={id} olan kişi silinirken hata oluştu.");
                throw;
            }
        }
    }
}