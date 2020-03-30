const catchErrors = fn =>
  (req, res) => {
      Promise.resolve(fn(req, res)).catch((error) => {
          res.status(500).json({
              error: error.message
          });
          // res.send({
          //   msg: err.message,
          //   success: false,
          //   code: err.code
          // })
      });
  }

module.exports = catchErrors