using PhoneBook.Core.Entities;
using System;
using System.Threading.Tasks;

namespace PhoneBook.Core.Interfaces
{
    /// <summary>
    /// UnitOfWork deseni için interface
    /// Tüm repository'leri ve kaydetme işlemini yönetir
    /// </summary>
    public interface IUnitOfWork : IDisposable
    {
        /// <summary>
        /// Contact repository'si
        /// </summary>
        IGenericRepository<Contact> Contacts { get; }

        /// <summary>
        /// Tüm değişiklikleri veritabanına kaydeder
        /// </summary>
        Task<int> SaveChangesAsync();
    }
}