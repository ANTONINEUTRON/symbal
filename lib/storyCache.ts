import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorySegment } from '@/types';

const STORY_CACHE_KEY = 'cachedStories';

export const saveStoriesToCache = async (stories: StorySegment[]) => {
  try {
    await AsyncStorage.setItem(STORY_CACHE_KEY, JSON.stringify(stories));
  } catch (e) {
    console.warn('Failed to save stories to cache', e);
  }
};

export const loadStoriesFromCache = async (): Promise<StorySegment[]> => {
  try {
    const data = await AsyncStorage.getItem(STORY_CACHE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to load stories from cache', e);
    return [];
  }
};

export const clearStoriesCache = async () => {
  try {
    await AsyncStorage.removeItem(STORY_CACHE_KEY);
  } catch (e) {
    console.warn('Failed to clear stories cache', e);
  }
};
