const bcrypt =  require('bcrypt');

const enc = async (string) => {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        reject({ msg: err, hash: null, success: false });
      } else {
        bcrypt.hash(string, salt, (err, hash) => {
          if (err) {
            reject({ msg: err, hash: null, success: false });
          } else {
            resolve({ msg: 'Hashed', hash, success: true, salt });
          }
        });
      }
    });
  });
};

const verify = async (pass, salt, passenc) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pass, passenc, function (err, result) {
      if (err) {
        reject({ msg: err, success: false });
      } else {
        if (result) {
          resolve({ msg: "Password is correct", success: true });
        } else {
          resolve({ msg: "Password is incorrect", success: false });
        }
      }
    });
  });
};


module.exports = { enc, verify };