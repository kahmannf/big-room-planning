using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BigRoomPlanningBoardBackend.Migrations
{
    /// <inheritdoc />
    public partial class RenameQuarterYearToPlannedPeriod : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "QuarterYears",
                newName: "PlannedPeriods");

            migrationBuilder.RenameColumn(
                name: "QuarterYearId",
                table: "PlannedPeriods",
                newName: "PlannedPeriodId");

            migrationBuilder.RenameColumn(
                name: "QuarterYearId",
                table: "SquadBoards",
                newName: "PlannedPeriodId");

            migrationBuilder.RenameColumn(
                name: "QuarterYearId",
                table: "DependencyBoards",
                newName: "PlannedPeriodId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.RenameTable(
                name: "PlannedPeriods",
                newName: "QuarterYears");

            migrationBuilder.RenameColumn(
                name: "PlannedPeriodId",
                table: "QuarterYears",
                newName: "QuarterYearId");

            migrationBuilder.RenameColumn(
                name: "PlannedPeriodId",
                table: "SquadBoards",
                newName: "QuarterYearId");

            migrationBuilder.RenameColumn(
                name: "PlannedPeriodId",
                table: "DependencyBoards",
                newName: "QuarterYearId");

        }
    }
}
