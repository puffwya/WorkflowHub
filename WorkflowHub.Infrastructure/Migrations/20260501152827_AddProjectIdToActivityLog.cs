using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkflowHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectIdToActivityLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ProjectId",
                table: "ActivityLogs",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ActivityLogs_ProjectId",
                table: "ActivityLogs",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityLogs_Projects_ProjectId",
                table: "ActivityLogs",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActivityLogs_Projects_ProjectId",
                table: "ActivityLogs");

            migrationBuilder.DropIndex(
                name: "IX_ActivityLogs_ProjectId",
                table: "ActivityLogs");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "ActivityLogs");
        }
    }
}
