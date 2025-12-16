import User from "../../models/User.js";

/**
 * cleanup string
 */
function cleanup(str = "") {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Generate unique username
 */
export async function generateUniqueUsername(fullName, email) {
  let first = "";
  let last = "";

  if (fullName) {
    const parts = fullName.trim().split(" ");
    first = cleanup(parts[0] || "");
    last = cleanup(parts[1] || "");

    // fallback to email local-part
    if (!last) {
      last = cleanup(email.split("@")[0]);
    }
  } else {
    const local = cleanup(email.split("@")[0]);
    first = local;
  }

  const candidates = [
    `${first}${last}`,
    `${first}.${last}`,
    `${first}_${last}`,
    `${first}${last.charAt(0)}`,
    `${first.charAt(0)}${last}`,
  ].filter(Boolean);

  // try predefined patterns
  for (const base of candidates) {
    const unique = await findAvailableUsername(base);
    if (unique) return unique;
  }

  // fallback: incremental numbers
  return await generateFallback(first, last);
}

/**
 * Check if username exists
 */
async function findAvailableUsername(base) {
  const exists = await User.query().findOne({ username: base });
  if (!exists) return base;
  return null;
}

/**
 * Numeric fallback
 */
async function generateFallback(first, last) {
  const base = `${first}${last}`;
  let counter = 1;

  while (true) {
    const username = `${base}${counter}`;
    const exists = await User.query().findOne({ username });

    if (!exists) return username;
    counter++;
  }
}
