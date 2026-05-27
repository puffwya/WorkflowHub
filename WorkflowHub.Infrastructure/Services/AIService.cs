using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace WorkflowHub.Infrastructure.Services;

public class AIService
{
    private readonly HttpClient _httpClient;

    public AIService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> GenerateInsight(string prompt)
    {
        var apiKey = Environment.GetEnvironmentVariable("AI__OpenAIKey");

        if (string.IsNullOrWhiteSpace(apiKey))
            return "AI key missing.";

        var requestBody = new
        {
            model = "gpt-4o-mini",
            messages = new[]
            {
                new { role = "user", content = prompt }
            }
        };

        var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://api.openai.com/v1/chat/completions"
        );

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", apiKey);

        request.Content = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json"
        );

        var response = await _httpClient.SendAsync(request);
        var json = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            return $"AI Error: {response.StatusCode} - {json}";

        using var doc = JsonDocument.Parse(json);

        return doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString()
            ?? "No response.";
    }
}
