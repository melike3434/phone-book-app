using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PhoneBook.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNoteToContact : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Contacts",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Note",
                table: "Contacts");
        }
    }
}
