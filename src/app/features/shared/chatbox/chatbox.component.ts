import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

interface Message {
  role: 'user' | 'bot';
  text: string;
  html?: SafeHtml;
}

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css'
})
export class ChatboxComponent implements AfterViewChecked, OnInit {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private authService = inject(AuthService);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  isOpen = false;
  inputText = '';
  loading = false;
  sessionId = crypto.randomUUID();
  messages: Message[] = [];

  private webhookUrl = 'https://kontu.app.n8n.cloud/webhook/7f0821d6-b0d5-4028-905d-915031514b34/chat';

  ngOnInit() {
    const token = this.authService.getAccessToken();
    if (token) {
      this.http.get<any>(`${environment.apiUrl}/users/me`).subscribe({
        next: (res) => {
          const user = res.data || res;
          const firstName = user.firstName || '';
          this.setGreeting(firstName);
        },
        error: () => this.setGreeting('')
      });
    } else {
      this.setGreeting('');
    }
  }

  private setGreeting(firstName: string) {
    const greeting = firstName
      ? `გამარჯობა, ${firstName}! 👋 რით შემიძლია დაგეხმაროთ?`
      : 'გამარჯობა! 👋 რით შემიძლია დაგეხმაროთ?';
    this.messages = [{ role: 'bot', text: greeting }];
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    const text = this.inputText.trim();
    if (!text || this.loading) return;

    this.messages.push({ role: 'user', text });
    this.inputText = '';
    this.loading = true;

    this.http.post<any>(this.webhookUrl, {
      action: 'sendMessage',
      sessionId: this.sessionId,
      chatInput: text
    }).subscribe({
      next: (res) => {
        const reply = res?.output || res?.text || res?.message || 'პასუხი ვერ მივიღე.';
        this.messages.push({
          role: 'bot',
          text: reply,
          html: this.sanitizer.bypassSecurityTrustHtml(reply)
        });
        this.loading = false;
      },
      error: () => {
        this.messages.push({ role: 'bot', text: 'შეცდომა მოხდა. სცადეთ თავიდან.' });
        this.loading = false;
      }
    });
  }

  onEnter(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }
}

