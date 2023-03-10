import { TimeStampFormatterPipe } from './time-stamp-formatter.pipe';

describe('TimeStampFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeStampFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
