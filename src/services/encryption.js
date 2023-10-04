import bcrypt from "bcrypt";

const salt_rounds = 10;

export async function encryptPassword(password) {
  
  return bcrypt
    .genSalt(salt_rounds)
    .then((salt) => {      
      return bcrypt.hash(password, salt);
    })
    .catch((err) => console.error(err.message));
}
