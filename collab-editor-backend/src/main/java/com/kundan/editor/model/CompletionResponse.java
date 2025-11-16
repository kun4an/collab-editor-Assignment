package com.kundan.editor.model;

import java.util.List;

public class CompletionResponse {

    private List<String> suggestions;

    public CompletionResponse() {
    }

    public CompletionResponse(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }
}