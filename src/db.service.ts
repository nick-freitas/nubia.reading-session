import { Choice } from '@indigobit/nubia.common';
import { Injectable } from '@nestjs/common';

export interface ReadingSession {
  userId: string;
  gamebookId: string;
  choices: Choice[];
}

// Use JSON file for storage
export type DbData = {
  sessions: ReadingSession[];
};

@Injectable()
export class DBService {
  readonly db: { data: DbData };

  get sessions() {
    return this.db.data.sessions;
  }

  constructor() {
    this.db = { data: { sessions: [] } };
  }
}
