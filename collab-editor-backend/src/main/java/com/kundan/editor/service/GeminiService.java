package com.kundan.editor.service;

import com.kundan.editor.model.CompletionRequest;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GeminiService {

    private final Client client;
    private final String modelName;

    public GeminiService(
            @Value("${gemini.api.key:}") String apiKey,
            @Value("${gemini.model:gemini-2.5-flash}") String modelName) {

        if (apiKey != null && !apiKey.isEmpty()) {
            this.client = Client.builder().apiKey(apiKey).build();
        } else {
            // will read GOOGLE_API_KEY or GEMINI_API_KEY from env
            this.client = new Client();
        }

        this.modelName = modelName;
    }

    public List<String> complete(CompletionRequest request) {
        String code = request.getCode() != null ? request.getCode() : "";
        int cursorOffset = request.getCursorOffset() != null ? request.getCursorOffset() : code.length();
        String language = request.getLanguage() != null ? request.getLanguage() : "javascript";

        StringBuilder sb = new StringBuilder();
        sb.append("You are an AI code completion engine integrated into a real-time collaborative code editor.\n");
        sb.append("Language: ").append(language).append("\n\n");
        sb.append("The following is the full code content of the editor.\n");
        sb.append("The cursor is at character offset ").append(cursorOffset).append(" (0-based) in the following code:\n\n");
        sb.append("--- BEGIN CODE ---\n");
        sb.append(code).append("\n");
        sb.append("--- END CODE ---\n\n");
        sb.append("Based on this context and cursor position, propose 3 short completion candidates\n");
        sb.append("that would be appropriate to insert at the cursor.\n");
        sb.append("Return ONLY the raw code snippets, separated by a special delimiter line:\n");
        sb.append("\"-----SPLIT-----\"\n");
        sb.append("Do NOT return explanations or markdown.\n");

        String prompt = sb.toString();

        GenerateContentResponse response =
                client.models.generateContent(modelName, prompt, null);

        String text = response.text(); // full text response from Gemini

        String[] parts = text.split("-----SPLIT-----");
        return Arrays.stream(parts)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .limit(5)
                .collect(Collectors.toList());
    }
}