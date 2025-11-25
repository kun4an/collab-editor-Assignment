import { Injectable } from '@angular/core';
import { Client, Message, StompSubscription } from '@stomp/stompjs';
import { Subject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface CodeChangeMessage {
  roomId: string;
  userId: string;
  fullText: string;
  version: number;
}

export interface CursorUpdateMessage {
  roomId: string;
  userId: string;
  from: number;
  to: number;
}

@Injectable({ providedIn: 'root' })
export class CollaborationService {
  private client: Client | null = null;
  private codeSub?: StompSubscription;
  private cursorSub?: StompSubscription;

  public codeChanges$ = new Subject<CodeChangeMessage>();
  public cursorUpdates$ = new Subject<CursorUpdateMessage>();

  constructor(private http: HttpClient) {}

  connect(roomId: string, userId: string): void {
    if (this.client && this.client.connected) return;

    this.client = new Client({
      brokerURL: `ws://localhost:8080/ws`,   // No SockJS proxy
      reconnectDelay: 3000,
      debug: () => {}
    });

    this.client.onConnect = () => {
      this.codeSub = this.client!.subscribe(
        `/topic/room.${roomId}.code`,
        (message: Message) => {
          const body = JSON.parse(message.body) as CodeChangeMessage;
          if (body.userId !== userId) {
            this.codeChanges$.next(body);
          }
        }
      );

      this.cursorSub = this.client!.subscribe(
        `/topic/room.${roomId}.cursor`,
        (message: Message) => {
          const body = JSON.parse(message.body) as CursorUpdateMessage;
          if (body.userId !== userId) {
            this.cursorUpdates$.next(body);
          }
        }
      );
    };

    this.client.activate();
  }

  sendCodeChange(message: CodeChangeMessage): void {
    if (!this.client || !this.client.connected) return;
    this.client.publish({
      destination: `/app/room.${message.roomId}.code`,
      body: JSON.stringify(message)
    });
  }

  sendCursorUpdate(message: CursorUpdateMessage): void {
    if (!this.client || !this.client.connected) return;
    this.client.publish({
      destination: `/app/room.${message.roomId}.cursor`,
      body: JSON.stringify(message)
    });
  }

  disconnect(): void {
    this.codeSub?.unsubscribe();
    this.cursorSub?.unsubscribe();
    this.client?.deactivate();
  }

  async fetchCompletionsFromBackend(code: string, cursorOffset: number): Promise<string[]> {
    const res = await firstValueFrom(
      this.http.post<{ suggestions: string[] }>('/api/complete', {
        code,
        cursorOffset,
        language: 'javascript'
      })
    );
    return res?.suggestions ?? [];
  }
}