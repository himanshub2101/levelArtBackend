// events.ts
export enum EventType {
    LIKE = 'like',
    COMMENT = 'comment',
    SHARE = 'share',
  }
  
  export interface EventData {
    userId: number;
    type: EventType;
    relatedId: number;
  }
  