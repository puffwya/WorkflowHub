using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace WorkflowHub.Infrastructure.Services;

public class AIService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public AIService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<string> GenerateInsight(string prompt)
    {
        var apiKey = _configuration["AI:ApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return "AI key missing.";
        }

        // Correct Gemini endpoint (IMPORTANT: key is in query string)
        var url =
            
$"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    role = "user",
                    parts = new[]
                    {
                        new
                        {
                            text = prompt
                        }
                    }
                }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);

        var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };

        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var response = await _httpClient.SendAsync(request);

        var responseText = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            return $"AI Error: {response.StatusCode} - {responseText}";
        }

        using var doc = JsonDocument.Parse(responseText);

        // Gemini response path:
        // candidates[0].content.parts[0].text
        try
        {
            return doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString()
                ?? "No insight generated.";
        }
        catch
        {
            return $"AI parse error: {responseText}";
        }
    }
}
