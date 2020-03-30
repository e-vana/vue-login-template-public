// primitive password checking for the client side
function checkPassword(password){
  if (password.length < 8){
    return false;
  }
  var count = 0;
  var hasUpperCase = /[A-Z]/.test(password);
  var hasLowerCase = /[a-z]/.test(password);
  var hasNumbers = /\d/.test(password);
  var hasNonalphas = /\W/.test(password);

  if(hasUpperCase){
    count += 1;
  }
  if(hasLowerCase){
    count += 1;
  }
  if(hasNumbers){
    count += 1;
  }
  if(hasNonalphas){
    count += 1;
  }

  if (count < 3){
    return false;
  } else {
    return true;
  }


}

export { checkPassword };

