using System;

namespace PhoneBook.Core.Entities
{
    public class Contact
    {
        // Her kişinin benzersiz ID'si (Veritabanında otomatik artacak)
        public int Id { get; set; }

        // Ad
        public string FirstName { get; set; }

        // Soyad
        public string LastName { get; set; }

        // Telefon Numarası
        public string Phone { get; set; }

        // E-posta Adresi
        public string Email { get; set; }

        // Adres
        public string Address { get; set; }

        // Kayıt Tarihi (Varsayılan olarak şu anki zamanı alacak)
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public bool IsFavorite { get; set; } = false; 

        public string? Note { get; set; } 

        public DateTime? BirthDate { get; set; } 
    }
}