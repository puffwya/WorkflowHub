using WorkflowHub.Domain.Enums;
using WorkflowHub.Domain.Constants;
using TaskStatus = WorkflowHub.Domain.Enums.TaskStatus;

namespace WorkflowHub.Application.Services;

public static class TaskWorkflowService
{
    public static bool IsValidTransition(TaskStatus current, TaskStatus next, string role)
    {
        if (role == Roles.Admin)
            return true;

        return current switch
        {
            TaskStatus.ToDo => next == TaskStatus.InProgress,

            TaskStatus.InProgress => next == TaskStatus.Review,

            TaskStatus.Review => next == TaskStatus.Done,

            TaskStatus.Done => false,

            _ => false
        };
    }

    public static void EnforceTransition(TaskStatus current, TaskStatus next, string role)
    {
        if (!IsValidTransition(current, next, role))
            throw new InvalidOperationException(
                $"Invalid transition: {current} → {next} for role {role}"
            );
    }
}
