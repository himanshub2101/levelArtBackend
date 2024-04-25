// // events.service.ts
// import { Injectable } from '@nestjs/common';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { EventData, EventType } from './events';

// @Injectable()
// export class EventsService {
//   constructor(private readonly eventEmitter: EventEmitter2) {}

//   emitLikeEvent(data: EventData) {
//     this.eventEmitter.emit(EventType.LIKE, data);
//   }

//   emitCommentEvent(data: EventData) {
//     this.eventEmitter.emit(EventType.COMMENT, data);
//   }

//   emitShareEvent(data: EventData) {
//     this.eventEmitter.emit(EventType.SHARE, data);
//   }
// }
