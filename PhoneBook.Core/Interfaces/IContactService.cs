using PhoneBook.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PhoneBook.Core.Interfaces
{
    /// <summary>
    /// Contact işlemleri için servis interface'i
    /// </summary>
    public interface IContactService
    {
        /// <summary>
        /// Tüm kişileri getirir
        /// </summary>
        Task<IEnumerable<Contact>> GetAllContactsAsync();

        /// <summary>
        /// ID'ye göre kişi getirir
        /// </summary>
        Task<Contact> GetContactByIdAsync(int id);

        /// <summary>
        /// Yeni kişi ekler
        /// </summary>
        Task<Contact> AddContactAsync(Contact contact);

        /// <summary>
        /// Kişi günceller
        /// </summary>
        Task<Contact> UpdateContactAsync(Contact contact);

        /// <summary>
        /// Kişi siler
        /// </summary>
        Task DeleteContactAsync(int id);
    }
}