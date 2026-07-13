using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PhoneBook.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddIsFavoriteField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFavorite",
                table: "Contacts",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFavorite",
                table: "Contacts");
        }
    }
}
