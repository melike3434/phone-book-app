using Microsoft.AspNetCore.Mvc;
using PhoneBook.Core.Entities;
using PhoneBook.Core.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PhoneBook.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactsController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            var contacts = await _contactService.GetAllContactsAsync();
            return Ok(contacts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            var contact = await _contactService.GetContactByIdAsync(id);
            if (contact == null)
                return NotFound($"ID={id} olan kişi bulunamadı.");
            return Ok(contact);
        }

        [HttpPost]
        public async Task<ActionResult<Contact>> PostContact([FromBody] Contact contact)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdContact = await _contactService.AddContactAsync(contact);
            return CreatedAtAction(nameof(GetContact), new { id = createdContact.Id }, createdContact);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutContact(int id, [FromBody] Contact contact)
        {
            if (id != contact.Id)
                return BadRequest("ID uyuşmazlığı.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedContact = await _contactService.UpdateContactAsync(contact);
            if (updatedContact == null)
                return NotFound($"ID={id} olan kişi bulunamadı.");

            return Ok(updatedContact);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var existingContact = await _contactService.GetContactByIdAsync(id);
            if (existingContact == null)
                return NotFound($"ID={id} olan kişi bulunamadı.");

            await _contactService.DeleteContactAsync(id);
            return NoContent();
        }
    }
}