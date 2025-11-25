import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

import {
  EditorView,
  ViewUpdate,
  Decoration,
  DecorationSet
} from '@codemirror/view';
import {
  EditorState,
  Extension,
  StateEffect,
  StateField
} from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import {
  autocompletion,
  CompletionSource,
  CompletionContext
} from '@codemirror/autocomplete';

import {
  CollaborationService,
  CodeChangeMessage,
  CursorUpdateMessage
} from './collaboration.service';

type RemoteRange = { from: number; to: number };

const setRemoteCursors = StateEffect.define<RemoteRange[]>();

const remoteCursorField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decos, tr) {
    if (tr.docChanged) {
      decos = decos.map(tr.changes);
    }
    for (const e of tr.effects) {
      if (e.is(setRemoteCursors)) {
        const ranges = e.value;
        const newDecos = ranges.map(r =>
          Decoration.mark({
            attributes: {
              style:
                'background-color: rgba(33,150,243,0.2); border-bottom: 2px solid #2196f3;'
            }
          }).range(r.from, r.to === r.from ? r.from + 1 : r.to)
        );
        return Decoration.set(newDecos);
      }
    }
    return decos;
  },
  provide: f => EditorView.decorations.from(f)
});

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorHost', { static: true }) editorHost!: ElementRef<HTMLDivElement>;

  roomId = '';
  userId = uuidv4().slice(0, 8);
  joined = false;

  private editorView: EditorView | null = null;
  private currentVersion = 0;
  private remoteCursors = new Map<string, RemoteRange>();

  constructor(private collab: CollaborationService) {
    // Read ?room=... BEFORE first change detection to avoid ExpressionChanged error
    const params = new URLSearchParams(window.location.search);
    const qpRoom = params.get('room');
    if (qpRoom) {
      this.roomId = qpRoom;
    }
  }

  ngAfterViewInit(): void {
    const startDoc =
      `// Real-time collaborative editor with Gemini suggestions\n` +
      `function hello(name) {\n` +
      `  console.log("Hello " + name);\n` +
      `}\n`;

    const state = EditorState.create({
      doc: startDoc,
      extensions: this.editorExtensions()
    });

    this.editorView = new EditorView({
      state,
      parent: this.editorHost.nativeElement
    });

    // Join room AFTER editor exists
    if (this.roomId) {
      this.joinRoom();
    }
  }

  private editorExtensions(): Extension[] {
    const completionSource: CompletionSource = (context: CompletionContext) =>
      this.fetchCompletions(context);

    const updateListener = EditorView.updateListener.of((v: ViewUpdate) => {
      if (v.docChanged) {
        this.currentVersion++;
        this.broadcastCode();
      }
      if (v.selectionSet) {
        this.broadcastCursor();
      }
    });

    return [
      javascript({ typescript: true }),
      autocompletion({
        override: [completionSource],
        activateOnTyping: true
      }),
      updateListener,
      remoteCursorField,
      EditorView.lineWrapping
    ];
  }

  private fetchCompletions(context: CompletionContext) {
    const code = context.state.doc.toString();
    const cursorOffset = context.pos;

    return this.collab
      .fetchCompletionsFromBackend(code, cursorOffset)
      .then(suggestions => {
        if (!suggestions.length) return null;

        return {
          from: context.pos,
          options: suggestions.map(s => ({
            label: s.split('\n')[0].slice(0, 40) + (s.length > 40 ? '…' : ''),
            apply: s,
            type: 'keyword'
          }))
        };
      })
      .catch(() => null);
  }

  joinRoom(): void {
    if (!this.roomId) this.roomId = 'default-room';

    if (!this.joined) {
      this.collab.connect(this.roomId, this.userId);

      this.collab.codeChanges$.subscribe(msg =>
        this.applyRemoteCodeChange(msg)
      );
      this.collab.cursorUpdates$.subscribe(msg =>
        this.applyRemoteCursor(msg)
      );

      this.joined = true;
    }
  }

  private broadcastCode(): void {
    if (!this.joined || !this.editorView) return;

    const msg: CodeChangeMessage = {
      roomId: this.roomId,
      userId: this.userId,
      fullText: this.editorView.state.doc.toString(),
      version: this.currentVersion
    };
    this.collab.sendCodeChange(msg);
  }

  private broadcastCursor(): void {
    if (!this.joined || !this.editorView) return;

    const sel = this.editorView.state.selection.main;
    const msg: CursorUpdateMessage = {
      roomId: this.roomId,
      userId: this.userId,
      from: sel.from,
      to: sel.to
    };
    this.collab.sendCursorUpdate(msg);
  }

  private applyRemoteCodeChange(msg: CodeChangeMessage) {
    if (!this.editorView) return;

    const currentDoc = this.editorView.state.doc.toString();
    if (msg.fullText === currentDoc) return;

    this.editorView.dispatch({
      changes: {
        from: 0,
        to: this.editorView.state.doc.length,
        insert: msg.fullText
      }
    });
  }

  private applyRemoteCursor(msg: CursorUpdateMessage) {
    if (!this.editorView) return;

    this.remoteCursors.set(msg.userId, { from: msg.from, to: msg.to });
    this.updateRemoteCursorDecorations();
  }

  private updateRemoteCursorDecorations() {
    if (!this.editorView) return;

    const ranges: RemoteRange[] = [];
    this.remoteCursors.forEach(range => ranges.push(range));

    this.editorView.dispatch({
      effects: setRemoteCursors.of(ranges)
    });
  }

  ngOnDestroy(): void {
    this.collab.disconnect();
  }
}