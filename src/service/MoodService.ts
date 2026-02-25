import { IMoodEntry } from '../model/MoodEntry.js';
import { IMoodRepository } from '../repository/MoodRepository.js';
import { Result, Ok, Err } from '../lib/result.js';
import { MoodError, InvalidMood } from '../lib/errors.js';

export interface IMoodService {
  addMood(entryId: string, moodValue: string): Promise<Result<IMoodEntry, MoodError>>;
  getRecentMoods(days: number): Promise<Result<IMoodEntry[], MoodError>>;
}

export class MoodService implements IMoodService {
  private validMoods = ["Happy", "Sad", "Focused", "Stressed", "Calm"];

  constructor(private readonly repository: IMoodRepository) {}

  async addMood(entryId: string, moodValue: string): Promise<Result<IMoodEntry, MoodError>> {
    const normalized = moodValue.trim();

    if (!this.validMoods.includes(normalized)) {
      return Err(InvalidMood(`'${normalized}' is not a recognized mood.`));
    }

    return this.repository.add(entryId, normalized);
  }

  async getRecentMoods(days: number): Promise<Result<IMoodEntry[], MoodError>> {
    return this.repository.findRecent(days);
  }
}

export function CreateMoodService(repository: IMoodRepository): IMoodService {
  return new MoodService(repository);
}