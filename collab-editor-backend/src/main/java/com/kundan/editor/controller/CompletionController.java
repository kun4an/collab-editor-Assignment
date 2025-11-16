package com.kundan.editor.controller;

import com.kundan.editor.model.CompletionRequest;
import com.kundan.editor.model.CompletionResponse;
import com.kundan.editor.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CompletionController {

    private final GeminiService geminiService;

    public CompletionController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/complete")
    public ResponseEntity<CompletionResponse> complete(@RequestBody CompletionRequest request) {
        List<String> suggestions = geminiService.complete(request);
        return ResponseEntity.ok(new CompletionResponse(suggestions));
    }
}