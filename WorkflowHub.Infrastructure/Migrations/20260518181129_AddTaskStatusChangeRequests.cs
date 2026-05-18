using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkflowHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskStatusChangeRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActivityLogs_Projects_ProjectId",
                table: "ActivityLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_ActivityLogs_Tasks_TaskId1",
                table: "ActivityLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_ActivityLogs_Users_UserId",
                table: "ActivityLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskStatusRequests_Tasks_TaskId",
                table: "TaskStatusRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskStatusRequests_Users_RequestedByUserId",
                table: "TaskStatusRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskStatusRequests_Users_ReviewedByUserId",
                table: "TaskStatusRequests");

            migrationBuilder.DropIndex(
                name: "IX_ActivityLogs_TaskId1",
                table: "ActivityLogs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskStatusRequests",
                table: "TaskStatusRequests");

            migrationBuilder.DropColumn(
                name: "TaskId1",
                table: "ActivityLogs");

            migrationBuilder.RenameTable(
                name: "TaskStatusRequests",
                newName: "TaskStatusChangeRequests");

            migrationBuilder.RenameIndex(
                name: "IX_TaskStatusRequests_TaskId",
                table: "TaskStatusChangeRequests",
                newName: "IX_TaskStatusChangeRequests_TaskId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskStatusRequests_ReviewedByUserId",
                table: "TaskStatusChangeRequests",
                newName: "IX_TaskStatusChangeRequests_ReviewedByUserId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskStatusRequests_RequestedByUserId",
                table: "TaskStatusChangeRequests",
                newName: "IX_TaskStatusChangeRequests_RequestedByUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskStatusChangeRequests",
                table: "TaskStatusChangeRequests",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityLogs_Projects_ProjectId",
                table: "ActivityLogs",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityLogs_Users_UserId",
                table: "ActivityLogs",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskStatusChangeRequests_Tasks_TaskId",
                table: "TaskStatusChangeRequests",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskStatusChangeRequests_Users_RequestedByUserId",
                table: "TaskStatusChangeRequests",
                column: "RequestedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskStatusChangeRequests_Users_ReviewedByUserId",
                table: "TaskStatusChangeRequests",
                column: "ReviewedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActivityLogs_Projects_ProjectId",
                table: "ActivityLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_ActivityLogs_Users_UserId",
                table: "ActivityLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskStatusChangeRequests_Tasks_TaskId",
                table: "TaskStatusChangeRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskStatusChangeRequests_Users_RequestedByUserId",
                table: "TaskStatusChangeRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskStatusChangeRequests_Users_ReviewedByUserId",
                table: "TaskStatusChangeRequests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskStatusChangeRequests",
                table: "TaskStatusChangeRequests");

            migrationBuilder.RenameTable(
                name: "TaskStatusChangeRequests",
                newName: "TaskStatusRequests");

            migrationBuilder.RenameIndex(
                name: "IX_TaskStatusChangeRequests_TaskId",
                table: "TaskStatusRequests",
                newName: "IX_TaskStatusRequests_TaskId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskStatusChangeRequests_ReviewedByUserId",
                table: "TaskStatusRequests",
                newName: "IX_TaskStatusRequests_ReviewedByUserId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskStatusChangeRequests_RequestedByUserId",
                table: "TaskStatusRequests",
                newName: "IX_TaskStatusRequests_RequestedByUserId");

            migrationBuilder.AddColumn<Guid>(
                name: "TaskId1",
                table: "ActivityLogs",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskStatusRequests",
                table: "TaskStatusRequests",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityLogs_TaskId1",
                table: "ActivityLogs",
                column: "TaskId1");

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityLogs_Projects_ProjectId",
                table: "ActivityLogs",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityLogs_Tasks_TaskId1",
                table: "ActivityLogs",
                column: "TaskId1",
                principalTable: "Tasks",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityLogs_Users_UserId",
                table: "ActivityLogs",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskStatusRequests_Tasks_TaskId",
                table: "TaskStatusRequests",
                column: "TaskId",
                principalTable: "Tasks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskStatusRequests_Users_RequestedByUserId",
                table: "TaskStatusRequests",
                column: "RequestedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskStatusRequests_Users_ReviewedByUserId",
                table: "TaskStatusRequests",
                column: "ReviewedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
