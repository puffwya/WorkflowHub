namespace WorkflowHub.Infrastructure.Services;

public static class AIPromptBuilder
{
    public static string BuildDashboardPrompt(string role, string taskJson)
    {
        return role switch
        {
            "Admin" =>
$"""
You are an enterprise analytics assistant.

Summarize system-wide performance.

Focus:
- workload distribution across all teams
- bottlenecks
- overdue critical tasks
- risk areas

DATA:
{taskJson}
""",

            "Manager" =>
$"""
You are a project management assistant.

Summarize team performance.

Include:
- task progress (ToDo / InProgress / Review / Done)
- blockers
- overdue tasks
- actionable recommendations

DATA:
{taskJson}
""",

            _ =>
$"""
You are a personal productivity assistant.

Summarize tasks clearly:
- what is done
- what is in progress
- what needs attention

DATA:
{taskJson}
"""
        };
    }
}
