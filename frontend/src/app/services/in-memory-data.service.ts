import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Topic } from './topic';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const topics = [
    ];
    return {topics};
  }

  genId(topics: Topic[]): number {
    return topics.length > 0 ? Math.max(...topics.map(topic => topic.id)) + 1 : 11;
  }
}
