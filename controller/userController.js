const Joi = require("joi");
const User = require("../models/user");

const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

exports.logout = async (req, res) => {
  try {
    const user = req.user;
    user.token = null;
    await user.save();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCurrent = (req, res) => {
  const user = req.user;
  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};

exports.updateSubscription = async (req, res) => {
  const { error } = subscriptionSchema.validate(req.body);
  if (error) return res.status(400).json(error.details);

  try {
    const user = req.user;
    user.subscription = req.body.subscription;
    await user.save();
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
