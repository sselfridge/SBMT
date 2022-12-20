using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    public partial class testManyClubsAgain : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StravaClubStravaUser_StravaClub_StravaClubsId",
                table: "StravaClubStravaUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StravaClub",
                table: "StravaClub");

            migrationBuilder.RenameTable(
                name: "StravaClub",
                newName: "StravaClubs");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StravaClubs",
                table: "StravaClubs",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StravaClubStravaUser_StravaClubs_StravaClubsId",
                table: "StravaClubStravaUser",
                column: "StravaClubsId",
                principalTable: "StravaClubs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StravaClubStravaUser_StravaClubs_StravaClubsId",
                table: "StravaClubStravaUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StravaClubs",
                table: "StravaClubs");

            migrationBuilder.RenameTable(
                name: "StravaClubs",
                newName: "StravaClub");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StravaClub",
                table: "StravaClub",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StravaClubStravaUser_StravaClub_StravaClubsId",
                table: "StravaClubStravaUser",
                column: "StravaClubsId",
                principalTable: "StravaClub",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
