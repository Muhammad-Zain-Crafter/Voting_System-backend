import { ApiError } from "../utils/apiError.js";

export const authorizeRoles = (...roles) => { // lets the function accept any number of arguments, it groups them into a normal array inside the function.
  return (req, res, next) => {
    // Check if the logged-in user's role is included in allowed roles
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "You are not allowed to access this resourcwe");
    }
    next();
  };
};
 