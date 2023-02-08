class AppError extends Error {
  //Express contains  Error
  constructor(message, statusCode) {
    super(message); //ie calling Error //used when extend the parent class to call the parent construtor done using the message
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; //ternary operator
    this.isOperational = true; //Must be an operational error not a progamming error
    Error.captureStackTrace(this, this.constructor); //this new object created and the method this.constructor is called
  } //This includes what we pass in the newly created object ie the constructor method is called every time we create a new object out of this class
}
module.exports = AppError;
