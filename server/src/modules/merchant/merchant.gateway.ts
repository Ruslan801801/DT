import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MerchantAnalyticsService } from './merchant-analytics.service';

@WebSocketGateway({ namespace: '/merchant', cors: true })
export class MerchantGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private clients = new Map<string, Set<string>>(); // merchantId -> socketIds

  constructor(private readonly analytics: MerchantAnalyticsService) {}

  async handleConnection(socket: Socket) {
    const merchantId = socket.handshake.query.merchantId as string | undefined;
    if (!merchantId) {
      socket.disconnect();
      return;
    }
    if (!this.clients.has(merchantId)) this.clients.set(merchantId, new Set());
    this.clients.get(merchantId)!.add(socket.id);

    const data = await this.analytics.getDashboardData(merchantId);
    socket.emit('initial_data', data);
  }

  handleDisconnect(socket: Socket) {
    for (const [merchantId, sockets] of this.clients) {
      sockets.delete(socket.id);
      if (sockets.size === 0) this.clients.delete(merchantId);
    }
  }

  async pushLiveUpdate(merchantId: string) {
    const sockets = this.clients.get(merchantId);
    if (!sockets || sockets.size === 0) return;
    const data = await this.analytics.getDashboardData(merchantId);
    for (const id of sockets) {
      this.server.to(id).emit('live_update', data);
    }
  }
}

// ---