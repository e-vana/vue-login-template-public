// primitive password checking for the client side
function isEmail(string){
  var containsAt = string.includes("@");
  var containsDot = string.includes(".")

  if(containsAt && containsDot){
    return true;
  } else {
    return false;
  }
}

export { isEmail };