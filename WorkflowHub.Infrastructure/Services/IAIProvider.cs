namespace WorkflowHub.Infrastructure.Services;

public interface IAIProvider
{
    Task<string> GenerateAsync(string prompt);
}
