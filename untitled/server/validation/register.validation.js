const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.fullNameame = !isEmpty(data.fullName) ? data.fullName : "";
  data.employeeId = !isEmpty(data.employeeId) ? data.employeeId : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // validating fullName
  if (!Validator.isLength(data.fullName, { min: 2, max: 30 })) {
    errors.username = "fullName must be between 2 and 30 characters";
  }
  if (Validator.isEmpty(data.fullName)) {
    errors.fullName = "Full Name cannot be empty";
  }
  //validating employeeId
  if(Validator.isEmpty(data.employeeId)){
    errors.employeeId = "EmployeeId cannot be empty"
  }
  // validating email
  if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter correct email address";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email cannot be empty";
  }
  // validating password
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 and 30 characters";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password cannot be empty";
  }
  // validating password2
  /*
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password cannot be empty";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }*/

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
