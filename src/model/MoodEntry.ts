export interface IMoodEntry { 
    id: string, 
    entryId: string, 
    mood: string, 
    date: Date 
}

export class MoodEntry implements IMoodEntry {
    id: string 
    entryId: string 
    mood: string 
    date: Date 

  constructor(id: string, entryId: string, mood: string) {
    this.id = id;
    this.entryId = entryId;
    this.mood = mood;
    this.date = new Date();
  }
}

export function createMoodEntry(id: string, entryId: string, mood: string): IMoodEntry {
  return new MoodEntry(id, entryId, mood);
}