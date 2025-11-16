package com.kundan.editor.model;

public class CompletionRequest {

    private String code;
    private Integer cursorOffset;
    private String language;

    public CompletionRequest() {
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getCursorOffset() {
        return cursorOffset;
    }

    public void setCursorOffset(Integer cursorOffset) {
        this.cursorOffset = cursorOffset;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}