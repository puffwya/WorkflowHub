using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkflowHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixActivityLogTaskRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActivityLogs_Tasks_TaskId",
                table: "ActivityLogs");

            migrationBuilder.AddColumn<Guid>(
                name: "TaskId1",
                table: "ActivityLogs",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ActivityLogs_TaskId1",
                table: "ActivityLogs",
                column: "TaskId1");

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityLogs_Tasks_TaskId",
                table: "ActivityLogs",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityLogs_Tasks_TaskId1",
                table: "ActivityLogs",
                column: "TaskId1",
                principalTable: "Tasks",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActivityLogs_Tasks_TaskId",
                table: "ActivityLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_ActivityLogs_Tasks_TaskId1",
                table: "ActivityLogs");

            migrationBuilder.DropIndex(
                name: "IX_ActivityLogs_TaskId1",
                table: "ActivityLogs");

            migrationBuilder.DropColumn(
                name: "TaskId1",
                table: "ActivityLogs");

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityLogs_Tasks_TaskId",
                table: "ActivityLogs",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id");
        }
    }
}
