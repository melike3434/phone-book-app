using Microsoft.EntityFrameworkCore;
using PhoneBook.Core.Entities;

namespace PhoneBook.Data.Context
{
    public class AppDbContext : DbContext
    {
        // Constructor (Yapıcı Metot) - DbContext ayarlarını alır
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Contacts tablosunu temsil eden DbSet
        // Bu property sayesinde veritabanındaki Contacts tablosuna erişeceğiz.
        public DbSet<Contact> Contacts { get; set; }

        // Model oluşturulurken ekstra yapılandırmalar için kullanılır
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Tablo adını belirle (veritabanında "Contacts" olarak oluştur)
            modelBuilder.Entity<Contact>().ToTable("Contacts");

            // Zorunlu alanları belirle (veritabanında NOT NULL olacak)
            modelBuilder.Entity<Contact>()
                .Property(c => c.FirstName)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Contact>()
                .Property(c => c.LastName)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Contact>()
                .Property(c => c.Phone)
                .IsRequired()
                .HasMaxLength(15);

            modelBuilder.Entity<Contact>()
                .Property(c => c.Email)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Contact>()
                .Property(c => c.Address)
                .HasMaxLength(200); // Adres zorunlu değil, ama max uzunluk belirttik
        }
    }
}