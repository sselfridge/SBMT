using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    public partial class makethetablebigger : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "StravaUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "StravaUsers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "RecentDistance",
                table: "StravaUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RecentElevation",
                table: "StravaUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "StravaUsers");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "StravaUsers");

            migrationBuilder.DropColumn(
                name: "RecentDistance",
                table: "StravaUsers");

            migrationBuilder.DropColumn(
                name: "RecentElevation",
                table: "StravaUsers");
        }
    }
}
