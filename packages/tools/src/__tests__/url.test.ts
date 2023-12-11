import {humanReadableURL, isTrustedHostname} from '../url';

describe('isTrustedHostname', () => {
  it('allows trusted sanctumlabs hostnames', () => {
    expect(isTrustedHostname('https://portal.sanctumlabs.co.ke', false)).toBe(true);
    expect(isTrustedHostname('https://portal.sanctumlabs.com', false)).toBe(true);
    expect(isTrustedHostname('https://something.sanctumlabs.com', false)).toBe(true);
    expect(isTrustedHostname('https://somethingelse.sanctumlabs.com', false)).toBe(true);
    expect(isTrustedHostname('https://somethingelse.sanctumlabs.help', false)).toBe(true);
  });

  it('does not allow other hostnames', () => {
    expect(isTrustedHostname('https://linkedin.com', false)).toBe(false);
    expect(isTrustedHostname('https://facebook.com/sanctumlabs', false)).toBe(false);
    expect(isTrustedHostname('https://www.instagram.com/sanctumlabs/', false)).toBe(false);
  });
});

describe('humanReadableURL', () => {
  test.each([
    [undefined, undefined],
    ['', undefined],
    ['not_a_url', undefined],
    ['https://example.com', 'example.com/'],
    ['https://example.com/', 'example.com/'],
    ['https://example.com/foo/bar', 'example.com/foo/bar'],
    ['https://example.com/foo?a=42', 'example.com/foo'],
  ])('humanReadableURL(%p)', (input, expected) => {
    expect(humanReadableURL(input)).toEqual(expected);
  });
});
