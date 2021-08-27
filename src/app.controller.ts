import {
  GamebookCreatedEvent,
  GamebookUpdatedEvent,
  isGamebookCreatedEvent,
  isGamebookUpdatedEvent,
  isMakeChoiceEvent,
  isResetChoicesEvent,
  isUndoChoiceEvent,
  isUserCreatedEvent,
  isUserUpdatedEvent,
  MakeChoiceEvent,
  ResetChoicesEvent,
  Topics,
  UndoChoiceEvent,
  UserCreatedEvent,
  UserUpdatedEvent,
} from '@indigobit/nubia.common';
import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(Topics.READING_SESSION)
  readingSession(
    @Payload()
    { value }: { value: any },
  ): any {
    const { type, data } = value;
    if (!type) {
      throw new BadRequestException('Missing "type" in UserEvent');
    }

    if (isResetChoicesEvent(value)) {
      return this.appService.resetChoices(data as ResetChoicesEvent['data']);
    }
    if (isUndoChoiceEvent(value)) {
      return this.appService.undoChoice(data as UndoChoiceEvent['data']);
    }
    if (isMakeChoiceEvent(value)) {
      return this.appService.makeChoice(data as MakeChoiceEvent['data']);
    }

    console.log(type);

    console.log(`Ignoring ${type}`);
  }

  @MessagePattern(Topics.GAMEBOOKS)
  gamebook(
    @Payload()
    { value }: { value: GamebookCreatedEvent | GamebookUpdatedEvent },
  ): any {
    const { type, data, auth } = value;
    if (!type) {
      throw new BadRequestException('Missing "type" in GamebookEvent');
    }

    console.log(type);

    if (isGamebookCreatedEvent(value)) {
      return this.appService.gamebookCreatedHandler(
        data as GamebookCreatedEvent['data'],
        auth as GamebookCreatedEvent['auth'],
      );
    }

    console.log(`Ignoring ${type}`);
  }
}
