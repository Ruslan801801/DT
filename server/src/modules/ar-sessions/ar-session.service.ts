import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type ARSessionStatus = 'pending' | 'connected' | 'completed' | 'expired';

export interface ARSession {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: ARSessionStatus;
  created_at: Date;
  expires_at: Date;
}

@Injectable()
export class ARSessionService {
  // На данном этапе держим всё в памяти, только как демонстрацию API.
  private sessions = new Map<string, ARSession>();

  createSession(senderId: string, receiverId: string): ARSession {
    const id = uuidv4();
    const now = new Date();
    const s: ARSession = {
      id,
      sender_id: senderId,
      receiver_id: receiverId,
      status: 'pending',
      created_at: now,
      expires_at: new Date(now.getTime() + 5 * 60_000),
    };
    this.sessions.set(id, s);
    return s;
  }

  getSession(id: string): ARSession | undefined {
    const s = this.sessions.get(id);
    if (!s) return undefined;
    if (s.expires_at.getTime() < Date.now() && s.status !== 'completed') {
      s.status = 'expired';
    }
    return s;
  }

  markConnected(id: string) {
    const s = this.sessions.get(id);
    if (!s) return;
    if (s.status === 'pending') s.status = 'connected';
  }

  markCompleted(id: string) {
    const s = this.sessions.get(id);
    if (!s) return;
    s.status = 'completed';
  }
}

---