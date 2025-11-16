package com.kundan.editor.controller;

import com.kundan.editor.model.CodeChangeMessage;
import com.kundan.editor.model.CursorUpdateMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class CollabController {

    private final SimpMessagingTemplate messagingTemplate;

    public CollabController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Frontend sends to: /app/room.{roomId}.code
    @MessageMapping("room.{roomId}.code")
    public void handleCodeChange(CodeChangeMessage msg) {
        messagingTemplate.convertAndSend(
                "/topic/room." + msg.getRoomId() + ".code",
                msg
        );
    }

    // Frontend sends to: /app/room.{roomId}.cursor
    @MessageMapping("room.{roomId}.cursor")
    public void handleCursorChange(CursorUpdateMessage msg) {
        messagingTemplate.convertAndSend(
                "/topic/room." + msg.getRoomId() + ".cursor",
                msg
        );
    }
}