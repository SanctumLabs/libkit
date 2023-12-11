import {deferred} from '../async';

describe('deferred', () => {
  test('resolve', async () => {
    const d = deferred<number>();
    // eslint-disable-next-line jest/valid-expect
    const p = expect(d.promise).resolves.toEqual(42);
    d.resolve(42);
    await p;
  });

  test('reject', async () => {
    const d = deferred();
    // eslint-disable-next-line jest/valid-expect
    const p = expect(d.promise).rejects.toThrow('Nope');
    d.reject(new Error('Nope'));
    await p;
  });
});
