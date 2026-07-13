using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PhoneBook.Core.Interfaces
{
    /// <summary>
    /// Tüm entity'ler için ortak CRUD işlemlerini tanımlayan genel repository interface'i
    /// </summary>
    /// <typeparam name="T">Entity tipi (ör. Contact)</typeparam>
    public interface IGenericRepository<T> where T : class
    {
        /// <summary>
        /// ID'ye göre tek bir entity getirir
        /// </summary>
        Task<T> GetByIdAsync(int id);

        /// <summary>
        /// Tüm entity'leri listeler
        /// </summary>
        Task<IEnumerable<T>> GetAllAsync();

        /// <summary>
        /// Yeni bir entity ekler
        /// </summary>
        Task AddAsync(T entity);

        /// <summary>
        /// Varolan bir entity'yi günceller
        /// </summary>
        void Update(T entity);

        /// <summary>
        /// Bir entity'yi siler
        /// </summary>
        void Delete(T entity);
    }
}