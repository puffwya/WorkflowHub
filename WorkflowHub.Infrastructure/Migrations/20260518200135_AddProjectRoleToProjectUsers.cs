using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorkflowHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectRoleToProjectUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "ProjectUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "ProjectUsers");
        }
    }
}
