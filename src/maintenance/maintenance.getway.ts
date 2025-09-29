import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' }, 
})
export class MaintenanceGateway {
  @WebSocketServer() server: Server;

 async sendMaintenanceStatus(isActive: boolean) {
  return this.server.emit('maintenance', { active: isActive });
  }
}
