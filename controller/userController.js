const User = require("../models/user");

const UserController = {
  async updateSubscription(userId, subscription) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        return {
          status: 404,
          message: "User not found",
        };
      }

      user.subscription = subscription;
      await user.save();

      return {
        status: 200,
        message: "Subscription updated successfully",
        user,
      };
    } catch (error) {
      return {
        status: 500,
        message: `Error updating subscription: ${error.message}`,
      };
    }
  },
};

module.exports = UserController;
