const { formSchema } = require("@whatsapp-clone/common");

const validateForm = (req, res, next) => {
  const formData = req.body;
  formSchema.validate(formData, { abortEarly: false })
    .catch(() => {
      res.status(422).send();
    })
    .then(valid => {
      if (valid) {
        next();
      } else {
        res.status(422).send();
      }
    });

}

module.exports = validateForm;
