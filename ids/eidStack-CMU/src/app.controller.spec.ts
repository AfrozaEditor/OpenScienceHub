import { AppService } from './app.service';

describe('AppService', () => {
  describe('getHello', () => {
    it('returns the default health message', () => {
      expect(new AppService().getHello()).toBe('Hello World!');
    });
  });
});
