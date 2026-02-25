import { IMoodEntry, createMoodEntry } from '../model/MoodEntry.js';
import { Result, Ok, Err } from '../lib/result.js';
import { MoodError } from '../lib/errors.js';

export interface IMoodRepository {
  add(entryId: string, mood: string): Promise<Result<IMoodEntry, MoodError>>;
  findByEntryId(entryId: string): Promise<Result<IMoodEntry, MoodError>>;
  findRecent(days: number): Promise<Result<IMoodEntry[], MoodError>>;
}

export class MoodRepository implements IMoodRepository {
  private moods: IMoodEntry[] = [];
  private nextId = 1;

  add(entryId: string, mood: string): Promise<Result<IMoodEntry, MoodError>> {
    const newMood = createMoodEntry(String(this.nextId++), entryId, mood);
    this.moods.push(newMood);
    return Promise.resolve(Ok(newMood));
  }

  findByEntryId(entryId: string): Promise<Result<IMoodEntry, MoodError>> {
    const found = this.moods.find(m => m.entryId === entryId);
    if (!found) {
      return Promise.resolve(Err({ name: "EntryNotFound", message: `Mood for entry ${entryId} not found` } as MoodError));
    }
    return Promise.resolve(Ok(found));
  }

  findRecent(days: number): Promise<Result<IMoodEntry[], MoodError>> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recent = this.moods.filter(m => m.date >= cutoffDate);
    return Promise.resolve(Ok(recent));
  }
}

export function CreateMoodRepository(): IMoodRepository {
  return new MoodRepository();
}