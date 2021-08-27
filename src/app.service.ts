import {
  MakeChoiceEvent,
  ResetChoicesEvent,
  UndoChoiceEvent,
  GamebookCreatedEvent,
  Choice,
} from '@indigobit/nubia.common';
import { BadRequestException } from '@indigobit/nubia.common/build/errors/bad-request.exception';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DBService, ReadingSession } from './db.service';

@Injectable()
export class AppService {
  constructor(private readonly DBService: DBService) {}

  async resetChoices(
    data: ResetChoicesEvent['data'],
    auth: GamebookCreatedEvent['auth'],
  ): Promise<any> {
    const { gamebookId } = data;
    const { userId } = auth;

    if (!userId) {
      throw new Error('Missing userId');
    }

    if (!gamebookId) {
      throw new Error('Missing gamebookId');
    }
  }

  async undoChoice(
    data: UndoChoiceEvent['data'],
    auth: GamebookCreatedEvent['auth'],
  ): Promise<any> {
    const { gamebookId } = data;
    const { userId } = auth;

    if (!userId) {
      throw new Error('Missing userId');
    }

    if (!gamebookId) {
      throw new Error('Missing gamebookId');
    }
  }

  async makeChoice(
    data: MakeChoiceEvent['data'],
    auth: GamebookCreatedEvent['auth'],
  ): Promise<any> {
    const { gamebookId, progression } = data;
    const { userId } = auth;

    if (!userId) throw new BadRequestException('Missing userId');
    if (!gamebookId) throw new BadRequestException('Missing gamebookId');
    if (!progression) throw new BadRequestException('Missing progression');

    const session = this.DBService.sessions.find(
      (s) => s.userId === userId && s.gamebookId === gamebookId,
    );
    if (!session)
      throw new InternalServerErrorException('Could not find session');

    const choice: Choice = {
      chapterId: progression.destinationChapterId,
      progressionTakenId: progression.id,
      previousChapterId: progression.sourceChapterId,
      createdAt: new Date(),
    };
  }

  async gamebookCreatedHandler(
    data: GamebookCreatedEvent['data'],
    auth: GamebookCreatedEvent['auth'],
  ): Promise<ReadingSession> {
    const { id: gamebookId } = data;
    const { userId: userId } = auth;

    if (!userId) throw new BadRequestException('Missing userId');
    if (!gamebookId) throw new BadRequestException('Missing gamebookId');

    const sessionIndex = this.DBService.sessions.findIndex(
      (s) => s.gamebookId === gamebookId,
    );
    if (sessionIndex >= 0) return { ...this.DBService.sessions[sessionIndex] };

    const session: ReadingSession = { gamebookId, userId, choices: [] };
    this.DBService.sessions.push(session);

    return session;
  }
}
