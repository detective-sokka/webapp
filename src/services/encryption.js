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


export async function decodeBase64(encodedString){
  
  return Buffer.from(encodedString.split(' ')[1], 'base64').toString();
}