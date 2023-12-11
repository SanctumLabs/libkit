/**
 * Explode IETF BCP 47 language codes when a region subtag is available.
 *
 * For input like `'en-ZA'` this function produces `['en-ZA', 'en']`.
 *
 * @see {@link https://en.wikipedia.org/wiki/IETF_language_tag}
 */
export function* explodeRegionSubtags(languages: ReadonlyArray<string>) {
  for (const lang of languages) {
    const parts = lang.split('-');
    yield lang;
    if (parts.length > 1) {
      yield parts[0];
    }
  }
}

/**
 * Generate weighted language values for use in an `Accept-Language` header.
 *
 * The order of the array is significant, the earlier a language appears in the
 * array, the higher the weighting for it will be.
 *
 * @example
 * ```
 * acceptLanguageHeaderValues([])
 * // => []
 *
 * acceptLanguageHeaderValues(['en'])
 * // => ['en', '*;q=0.50']
 *
 * acceptLanguageHeaderValues(['en-ZA', 'en', 'af'])
 * // => ['en-ZA', 'en;q=0.75', 'af;q=0.50', '*;q=0.25']
 * ```
 */
export function acceptLanguageHeaderValues(languages: ReadonlyArray<string>) {
  function* _languageWeights() {
    if (languages.length === 0) {
      return;
    }
    yield languages[0];
    const langs = [...languages, '*'];
    const qstep = 1 / langs.length;
    for (let idx = 1, q = 1 - qstep; idx < langs.length; ++idx, q -= qstep) {
      yield `${langs[idx]};q=${q.toFixed(2)}`;
    }
  }
  return Array.from(_languageWeights());
}
