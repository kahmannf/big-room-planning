using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BigRoomPlanningBoardBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddAndEditPlannedPeriodEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PlannedPeriodId",
                table: "Sprints");

            migrationBuilder.AlterColumn<DateTime>(
                name: "BigRoomPlanningAt",
                table: "PlannedPeriods",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "TEXT");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "PlannedPeriods",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "BigRoomPlanningAt",
                table: "Events",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EditPlannedPeriodEvent_BigRoomPlanningAt",
                table: "Events",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EditPlannedPeriodEvent_EndDay",
                table: "Events",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EditPlannedPeriodEvent_Name",
                table: "Events",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EditPlannedPeriodEvent_PlannedPeriodId",
                table: "Events",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EditPlannedPeriodEvent_StartDay",
                table: "Events",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDay",
                table: "Events",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Events",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PlannedPeriodId",
                table: "Events",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDay",
                table: "Events",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "PlannedPeriods");

            migrationBuilder.DropColumn(
                name: "BigRoomPlanningAt",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EditPlannedPeriodEvent_BigRoomPlanningAt",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EditPlannedPeriodEvent_EndDay",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EditPlannedPeriodEvent_Name",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EditPlannedPeriodEvent_PlannedPeriodId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EditPlannedPeriodEvent_StartDay",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "EndDay",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "PlannedPeriodId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "StartDay",
                table: "Events");

            migrationBuilder.AddColumn<int>(
                name: "PlannedPeriodId",
                table: "Sprints",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<DateTime>(
                name: "BigRoomPlanningAt",
                table: "PlannedPeriods",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "TEXT",
                oldNullable: true);
        }
    }
}
