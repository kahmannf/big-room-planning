using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BigRoomPlanningBoardBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddSprintEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Sprints",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AddSprintEvent_Name",
                table: "Events",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EditSprintEvent_EndsAt",
                table: "Events",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EditSprintEvent_Name",
                table: "Events",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EditSprintEvent_SprintId",
                table: "Events",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EditSprintEvent_StartsAt",
                table: "Events",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndsAt",
                table: "Events",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SprintId",
                table: "Events",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartsAt",
                table: "Events",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Sprints");

            migrationBuilder.DropColumn(
                name: "AddSprintEvent_Name",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EditSprintEvent_EndsAt",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EditSprintEvent_Name",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EditSprintEvent_SprintId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EditSprintEvent_StartsAt",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EndsAt",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "SprintId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "StartsAt",
                table: "Events");
        }
    }
}
