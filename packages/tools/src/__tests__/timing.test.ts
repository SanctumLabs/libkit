import {stepTimer} from '../timing';

const {stringContaining} = expect;

describe('stepTimer', () => {
  let logSpy = jest.spyOn(console, 'debug').mockImplementation(() => null);

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'debug').mockImplementation(() => null);
  });

  afterEach(() => {
    logSpy.mockReset();
  });

  test('prefix', () => {
    const timeit = stepTimer('a_prefix');
    expect(logSpy).not.toHaveBeenCalled();
    timeit();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(stringContaining('a_prefix'));
  });

  test('step counter', () => {
    const timeit = stepTimer();
    expect(logSpy).not.toHaveBeenCalled();
    timeit();
    expect(logSpy).toHaveBeenCalledWith(stringContaining('#1'));
    timeit();
    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenCalledWith(stringContaining('#2'));
  });

  test('step name', () => {
    const timeit = stepTimer();
    expect(logSpy).not.toHaveBeenCalled();
    timeit('a_name');
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(stringContaining('a_name'));
  });

  test('current and total', () => {
    const mockPerformanceNow = jest.fn();
    let count = 0;
    mockPerformanceNow.mockImplementation(() => {
      const res = count;
      count = (count + 1) * 4;
      return res;
    });

    const timeit = stepTimer(undefined, {
      thresholds: [10, 20, 30],
      performanceNow: mockPerformanceNow,
    });
    timeit();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(stringContaining('current: 4ms'));
    expect(logSpy).toHaveBeenCalledWith(stringContaining('total: 4ms'));
    timeit();
    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenCalledWith(stringContaining('current: 16ms'));
    expect(logSpy).toHaveBeenCalledWith(stringContaining('total: 20ms'));
  });
});
