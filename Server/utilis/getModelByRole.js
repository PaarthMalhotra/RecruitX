import { User } from "../Schema/UserSchema.js";
import { Member } from "../Schema/MemberSchema.js";
import { Admin } from "../Schema/AdminSchema.js";

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

export async function findAccountByEmail(email) {
  const [user, member, admin] = await Promise.all([
    User.findOne({ email }),
    Member.findOne({ email }),
    Admin.findOne({ email }),
  ]);
  return user || member || admin || null;
}

export async function emailExistsInAnyCollection(email) {
  const account = await findAccountByEmail(email);
  return !!account;
}
