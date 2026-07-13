using Microsoft.EntityFrameworkCore;
using PhoneBook.Data.Context;
using PhoneBook.Core.Interfaces;
using PhoneBook.Data.UnitOfWork;
using PhoneBook.Service.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// DbContext'i bağlantı dizesi ile ekle
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// UnitOfWork'i servis olarak ekle
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// ContactService'i servis olarak ekle
builder.Services.AddScoped<IContactService, ContactService>();

// CORS politikasını ekle (Angular ile iletişim için - TÜM İZİNLER AÇIK)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()      // Herhangi bir domainden
              .AllowAnyMethod()      // Tüm HTTP metodları (GET, POST, PUT, DELETE)
              .AllowAnyHeader();     // Tüm header'lar
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// HTTPS yönlendirmesini geçici olarak devre dışı bırak (geliştirme ortamı için)
// app.UseHttpsRedirection();

// CORS'u kullan (sıralama önemli! - UseAuthorization'dan önce)
app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();