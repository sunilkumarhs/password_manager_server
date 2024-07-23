const { z, ZodError } = require("zod");

function validateData(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res.status(422).json({ error: "Invalid data", details: errorMessages });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}

module.exports = { validateData };
