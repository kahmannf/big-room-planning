using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BigRoomPlanningBoardBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddSprints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequirementIds",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "TargetIds",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "SquardBoardId",
                table: "Tickets");

            migrationBuilder.AddColumn<int>(
                name: "PlannedPeriodId",
                table: "Tickets",
                type: "INTEGER");

            migrationBuilder.AddColumn<int>(
                name: "SprintId",
                table: "Tickets",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Sprints",
                columns: table => new
                {
                    SprintId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PlannedPeriodId = table.Column<int>(type: "INTEGER", nullable: false),
                    StartsAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndsAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sprints", x => x.SprintId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Sprints");

            migrationBuilder.DropColumn(
                name: "SprintId",
                table: "Tickets");


            migrationBuilder.DropColumn(
                name: "PlannedPeriodId",
                table: "Tickets");

            migrationBuilder.AddColumn<int>(
                name: "SquardBoardId",
                table: "Tickets",
                type: "INTEGER");

            migrationBuilder.AddColumn<string>(
                name: "RequirementIds",
                table: "Tickets",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TargetIds",
                table: "Tickets",
                type: "TEXT",
                nullable: true);
        }
    }
}
