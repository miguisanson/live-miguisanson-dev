export const accountPolicy = {
  usernameMinLength: 3,
  usernameMaxLength: 30,
  passwordMinLength: 12,
  passwordMaxLength: 128,
  emailMaxLength: 254,
  displayNameMinLength: 1,
  displayNameMaxLength: 50,
  bioMaxLength: 280,
  locationMaxLength: 80,
  websiteMaxLength: 200,
  statusMaxLength: 80,
  quoteMaxLength: 160,
  socialHandleMaxLength: 120,
  favoriteGamesMax: 6,
  postMaxLength: 2000,
  /** Reddit caps a gallery at 20; 5 is plenty for a small community feed. */
  postImageMax: 5,
};

export const profileBackgroundPatterns = ["none", "dots", "grid", "diagonal"] as const;
export type ProfileBackgroundPattern = (typeof profileBackgroundPatterns)[number];

const commonWeakPasswords = new Set([
  "123456789",
  "1234567890",
  "adminadmin",
  "letmein123",
  "password",
  "password1",
  "password12",
  "password123",
  "password1234",
  "qwerty123",
  "qwerty12345",
  "welcome123",
]);

export function normalizeEmailInput(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeUsernameInput(value: string) {
  return value.trim();
}

export function normalizeDisplayName(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function validateEmailAddress(value: string) {
  const email = normalizeEmailInput(value);
  const parts = email.split("@");
  const [local, domain] = parts;

  if (email.length < 6 || email.length > accountPolicy.emailMaxLength) {
    return `Email must be between 6 and ${accountPolicy.emailMaxLength} characters.`;
  }
  if (parts.length !== 2 || !local || !domain) {
    return "Use a real email address with one @ symbol.";
  }
  if (local.length > 64 || /[\s<>()[\]\\,;:"]/.test(email)) {
    return "Use a standard email address without spaces or unsafe characters.";
  }
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) {
    return "Email cannot have dots at the start, end, or doubled in the name.";
  }
  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(domain)) {
    return "Email must use a public domain like gmail.com or outlook.com.";
  }
  if (!/[a-z]{2,63}$/.test(domain)) {
    return "Email domain must end with normal letters, like .com or .net.";
  }

  return "";
}

export function validateUsername(value: string) {
  const username = normalizeUsernameInput(value);

  if (username.length < accountPolicy.usernameMinLength || username.length > accountPolicy.usernameMaxLength) {
    return `Username must be ${accountPolicy.usernameMinLength}-${accountPolicy.usernameMaxLength} characters.`;
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9._]*[A-Za-z0-9]$/.test(username)) {
    return "Username can use letters, numbers, dots, and underscores, but must start and end with a letter or number.";
  }
  if (/[._]{2,}/.test(username)) {
    return "Username cannot contain repeated dots or underscores.";
  }

  return "";
}

export function validateDisplayName(value: string) {
  const displayName = normalizeDisplayName(value);
  if (displayName.length < accountPolicy.displayNameMinLength) {
    return "Display name cannot be empty.";
  }
  if (displayName.length > accountPolicy.displayNameMaxLength) {
    return `Display name must be ${accountPolicy.displayNameMaxLength} characters or fewer.`;
  }
  return "";
}

export function validateBio(value: string) {
  if (value.length > accountPolicy.bioMaxLength) {
    return `Bio must be ${accountPolicy.bioMaxLength} characters or fewer.`;
  }
  return "";
}

export function validateLocation(value: string) {
  if (value.length > accountPolicy.locationMaxLength) {
    return `Location must be ${accountPolicy.locationMaxLength} characters or fewer.`;
  }
  return "";
}

export function validateWebsite(value: string) {
  const website = value.trim();
  if (!website) {
    return "";
  }
  if (website.length > accountPolicy.websiteMaxLength) {
    return `Website must be ${accountPolicy.websiteMaxLength} characters or fewer.`;
  }
  let parsed: URL;
  try {
    parsed = new URL(website);
  } catch {
    return "Enter a full URL starting with https://";
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return "Website must start with http:// or https://";
  }
  return "";
}

export function validateStatus(value: string) {
  if (value.length > accountPolicy.statusMaxLength) {
    return `Status must be ${accountPolicy.statusMaxLength} characters or fewer.`;
  }
  return "";
}

export function validateQuote(value: string) {
  if (value.length > accountPolicy.quoteMaxLength) {
    return `Quote must be ${accountPolicy.quoteMaxLength} characters or fewer.`;
  }
  return "";
}

export function validateSocialHandle(value: string) {
  if (value.length > accountPolicy.socialHandleMaxLength) {
    return `Each social link must be ${accountPolicy.socialHandleMaxLength} characters or fewer.`;
  }
  return "";
}

export function validateThemeColor(value: string) {
  const color = value.trim();
  if (!color) {
    return "";
  }
  if (!/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) {
    return "Theme color must be a hex value like #4f46e5.";
  }
  return "";
}

export function validatePostBody(value: string) {
  const body = value.trim();
  if (body.length < 1) {
    return "Post cannot be empty.";
  }
  if (body.length > accountPolicy.postMaxLength) {
    return `Post must be ${accountPolicy.postMaxLength} characters or fewer.`;
  }
  return "";
}

export function validateAccountPassword(password: string, identity?: { email?: string; username?: string }) {
  if (password.length < accountPolicy.passwordMinLength) {
    return `Use at least ${accountPolicy.passwordMinLength} characters for your password.`;
  }
  if (password.length > accountPolicy.passwordMaxLength) {
    return `Use no more than ${accountPolicy.passwordMaxLength} characters for your password.`;
  }
  if (password !== password.trim()) {
    return "Password cannot start or end with a space.";
  }

  const lowerPassword = password.toLowerCase();
  const compactPassword = lowerPassword.replace(/\s+/g, "");
  if (commonWeakPasswords.has(compactPassword) || lowerPassword.includes("password")) {
    return "Choose a less common password.";
  }
  if (/^(.)\1+$/.test(password)) {
    return "Password cannot be the same character repeated.";
  }
  if ("abcdefghijklmnopqrstuvwxyz".includes(compactPassword) || "0123456789".includes(compactPassword)) {
    return "Password cannot be a simple sequence.";
  }

  const emailName = identity?.email ? normalizeEmailInput(identity.email).split("@")[0] : "";
  const username = identity?.username ? normalizeUsernameInput(identity.username).toLowerCase() : "";
  for (const personalValue of [emailName, username]) {
    if (personalValue.length >= 4 && lowerPassword.includes(personalValue)) {
      return "Password cannot contain your email name or username.";
    }
  }

  return "";
}
