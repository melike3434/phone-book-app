using PhoneBook.Core.Entities;
using PhoneBook.Core.Interfaces;
using PhoneBook.Data.Context;
using PhoneBook.Data.Repositories;
using System;
using System.Threading.Tasks;

namespace PhoneBook.Data.UnitOfWork
{
    /// <summary>
    /// IUnitOfWork interface'inin somut implementasyonu
    /// </summary>
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private IGenericRepository<Contact> _contactRepository;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Contact repository'si (Lazy Initialization - ihtiyaç duyulduğunda oluştur)
        /// </summary>
        public IGenericRepository<Contact> Contacts
        {
            get
            {
                if (_contactRepository == null)
                {
                    _contactRepository = new GenericRepository<Contact>(_context);
                }
                return _contactRepository;
            }
        }

        /// <summary>
        /// Tüm değişiklikleri veritabanına kaydeder
        /// </summary>
        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Kaynakları serbest bırakır (Dispose pattern)
        /// </summary>
        public void Dispose()
        {
            _context.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}