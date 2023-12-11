/**
 * Is React Native's remote debugging mode enabled?
 */
const IS_REMOTE_DEBUGGING =
  typeof (globalThis as any).__REMOTEDEV__ !== 'undefined' ||
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  typeof DedicatedWorkerGlobalScope !== 'undefined';

/**
 * A thin, well-typed wrapper around `global.nativePerformanceNow`.
 *
 * NOTE: In the case of remote debugging, `performance.now` cannot be invoked
 * without an error.
 */
export function performanceNow() {
  const g = globalThis as any;
  if (!IS_REMOTE_DEBUGGING) {
    if (g?.performance?.now) {
      return g.performance.now();
    } else if (g?.nativePerformanceNow) {
      return g.nativePerformanceNow();
    }
  }
  return Date.now();
}

interface TimingOptions {
  thresholds: [number, number, number];
  performanceNow?: () => number;
}

const defaultTimingEmojiOptions: TimingOptions = {
  thresholds: [50, 125, 250],
};

export function timingEmoji(
  ms: number,
  prefix = '⏱',
  options: TimingOptions = defaultTimingEmojiOptions,
): string {
  const {thresholds} = options;
  let emoji: string;
  if (ms < thresholds[0]) {
    emoji = '🟢';
  } else if (ms < thresholds[1]) {
    emoji = '🟡';
  } else if (ms < thresholds[2]) {
    emoji = '🔴';
  } else {
    emoji = '💩';
  }
  return prefix + emoji;
}

export function timingMessage(
  subsystem: string,
  ms: number,
  extra?: string,
  prefix?: string,
  options?: TimingOptions,
) {
  return `${timingEmoji(ms, prefix, options)} [${ms}ms] ${subsystem} ${extra ?? ''}`;
}

const defaultStepTimerOptions: TimingOptions = {
  thresholds: [10, 30, 60],
};

/**
 * Create a function that will log out the time since the last time it was
 * called.
 *
 * This can be useful to time individual steps, such as before/after a function
 * call.
 *
 * @example
 * ```typescript
 * const timeit = stepTime('someScope')
 * init();
 * timeit();       // 🟢 [someScope] Step (#1)  current: 4ms  total: 4ms
 * someFunction();
 * timeit('end');  // 🟡 [someScope] Step end (#2)  current: 40ms  total: 44ms
 * ```
 */
export function stepTimer(prefix?: string, options: TimingOptions = defaultStepTimerOptions) {
  const perfNow = options?.performanceNow ?? performanceNow;
  const start = perfNow();
  let last = start;
  let count = 1;

  return function stepTime(name?: string) {
    const now = perfNow();
    const pfx = prefix ? `[${prefix}] ` : '';
    const msg = name ? ` ${name}` : '';
    // prettier-ignore
    console.debug(`${timingString()} ${timingEmoji(now - last, pfx, options)} Step (#${count})${msg}  current: ${now - last}ms  total: ${now - start}ms`);
    last = now;
    ++count;
  };
}

/**
 * Return the current time formatted for performance logging (HH:MM:SS.TTT)
 *
 * When looking at messages in LogCat - the timestamp is not trustworthy due to the
 * asynchronous nature of the logging. Serialising the timestamp within the log message
 * provides a more accurate view of timing
 */
export function timingString() {
  const d = new Date();
  return (
    `${d.getHours().toString().padStart(2, '0')}:` +
    `${d.getMinutes().toString().padStart(2, '0')}:` +
    `${d.getSeconds().toString().padStart(2, '0')}.` +
    `${d.getMilliseconds().toString().padStart(3, '0')}`
  );
}
