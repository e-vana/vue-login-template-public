// @@ Try / Catch wrapper method for all routes so you don't need all the try catch boiler plate
// @@ Throw an error inside a route by doing throw { message: 'message string'}
const catchErrors = fn =>
  (req, res) => {
      Promise.resolve(fn(req, res)).catch((error) => {
          res.status(500).json({
              error: error.message
          });
      });
  }

module.exports = catchErrors