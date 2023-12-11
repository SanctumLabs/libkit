/**
 * Make a reasonable attempt to mask an email address for display purposes.
 */
export function maskEmailAddress(email: string): string {
  return email.replace(/([^@]{1,2})(.*?)@([^.]{1,2})(.*?)\.(.*)/, '$1**@$3**.$5');
}

/**
 * Make a reasonable attempt to mask a mobile number for display purposes.
 */
export function maskMobileNumber(mobileNumber: string): string {
  return mobileNumber.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
}

/**
 * First line of a potentially multiline string.
 *
 * @return - First line, however if `value` is `undefined` or empty then the
 *   result is `undefined`.
 */
export function firstLine(value?: string): string | undefined {
  return (value ?? '').split('\n')[0] || undefined;
}

/**
 * A friendly and short display value for a user's name.
 *
 * @return - A name with a shortened last name, if both `firstName` and
 *   `lastName` are provided. Otherwise, `firstName` or `lastName`, whichever is
 *   defined, will be returned. If neither are provided then the result is
 *   `undefined`.
 */
export function friendlyDisplayName(firstName?: string, lastName?: string): string | undefined {
  if (firstName === undefined && lastName === undefined) {
    return undefined;
  } else if (lastName === undefined) {
    return firstName;
  } else if (firstName === undefined) {
    return lastName;
  } else {
    const shortLastName = lastName
      .split(' ')
      .map((part) => part.charAt(0))
      .join('.');
    return `${firstName} ${shortLastName}`;
  }
}

const FIRST_LETTERS_PATTERN = /(^|\s)\w/g;

/**
 * Extract the first letter of each word, uppercase them, and join into a
 * single string.
 */
export function initials(s: string) {
  return s.match(FIRST_LETTERS_PATTERN)?.join('').replace(/\s/g, '').toUpperCase() ?? '';
}

/**
 * Truncate `s` to at most a length of `limit`.
 */
export function truncate(s: string, limit: number) {
  if (s.length > limit) {
    return s.slice(0, limit - 1) + '…';
  } else {
    return s;
  }
}
