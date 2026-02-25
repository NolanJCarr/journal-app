import type { Response } from 'express';
import { IMoodService } from '../service/MoodService.js';
import { ILoggingService } from '../service/LoggingService.js';
import { MoodError } from '../lib/errors.js';

export interface IMoodController {
  newMoodFromForm(res: Response, entryId: string, moodValue: string): Promise<void>;
  showRecentMoods(res: Response): Promise<void>;
}

export class MoodController implements IMoodController {
  constructor(
    private readonly service: IMoodService,
    private readonly logger: ILoggingService
  ) {}

  private isMoodError(value: unknown): value is MoodError {
    return typeof value === 'object' && value !== null && 'name' in value;
  }

  async newMoodFromForm(res: Response, entryId: string, moodValue: string): Promise<void> {
    this.logger.info(`Creating mood for entry ${entryId}`);
    const result = await this.service.addMood(entryId, moodValue);
    
    if (!result.ok && this.isMoodError(result.value)) {
      if (result.value.name === 'InvalidMood') {
        this.logger.warn(`Create mood rejected: ${result.value.message}`);
        res.status(400).send(result.value.message);
        return;
      }
      
      res.status(500).send('Unable to create mood.');
      return;
    }

    if (!result.ok) {
      res.status(500).send('Unable to create mood.');
      return;
    }

    res.redirect(`/entries/${entryId}`);
  }

  async showRecentMoods(res: Response): Promise<void> {
    this.logger.info('Listing recent moods (7 days)');
    const result = await this.service.getRecentMoods(7);

    if (!result.ok) {
      res.status(500).render('entries/not-found', { message: 'Unable to list moods' });
      return;
    }

    res.render('moods/index', { moods: result.value });
  }
}

export function CreateMoodController(service: IMoodService, logger: ILoggingService): IMoodController {
  return new MoodController(service, logger);
}