import { User } from "../Schema/UserSchema.js";
import { Member } from "../Schema/MemberSchema.js";
import { Admin } from "../Schema/AdminSchema.js";

/**
 * Returns the Mongoose model for the given role string.
 */
export function getModelByRole(role) {
  switch (role) {
    case "member":
      return Member;
    case "admin":
      return Admin;
    case "user":
    default:
      return User;
  }
}

/**
 * Finds an account by email across all three collections.
 * Returns the first match (email is unique across collections).
 */
export async function findAccountByEmail(email) {
  const [user, member, admin] = await Promise.all([
    User.findOne({ email }),
    Member.findOne({ email }),
    Admin.findOne({ email }),
  ]);
  return user || member || admin || null;
}

/**
 * Checks if an email already exists in any of the three collections.
 * Returns true if it exists, false otherwise.
 */
export async function emailExistsInAnyCollection(email) {
  const account = await findAccountByEmail(email);
  return !!account;
}
