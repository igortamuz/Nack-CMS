import crypto from 'crypto'

export const generateServerSeed = () => {
  return crypto.randomBytes(256).toString('hex')
}

export const generateRandomString = (size: number) => {
  const availableChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = '';
  for(let i = 0; i < size; i++) {
    randomString += availableChars[Math.floor(Math.random() * availableChars.length)];
  }
  return randomString;
}

export const hash = (string: string) => {
  return crypto.createHash('sha512').update(string).digest('hex')
}

export const getResult = (hashedValue: string)=> {
  // the offset of the interval
  let index = 0;
  // result variable
  let result: number;

  do {
    // get the decimal value from an interval of 5 hex letters
    result = parseInt(hashedValue.substring(index * 5, index * 5 + 5), 16);
    // increment the offset in case we will need to repeat the operation above
    index += 1;
    // if all the numbers were over 999999 and we reached the end of the string, we set that to a default value of 9999 (99 as a result)
    if (index * 5 + 5 > 129) {
      result = 9999;
      break;
    }
  } while (result >= 1e6);
  // the result is between 0-999999 and we need to convert if into a 4 digit number
  // we a apply a modulus of 1000 and the 4 digit number is further split into a 2 digit number with decimals
  // return (result % 1e4) * 1e-2;
  return (result % 1e4);
};