import { userRoles } from "../../DB/models/user.models.js";

const authorization = (allowedRoles) => {
  return (req, res, next) => {
    if (allowedRoles.includes(req.user?.role)) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden' });
  };
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role === userRoles.admin) return next();
  return res.status(403).json({ message: 'Forbidden: admin only.' });
};

export const requireAdminOrOwner = (getOwnerIdFromReq) => {
  return async (req, res, next) => {
    if (req.user?.role === userRoles.admin) return next();
    try {
      const ownerId = await getOwnerIdFromReq(req);
      if (ownerId && ownerId.toString() === req.user.id) return next();
      return res.status(403).json({ message: 'Forbidden.' });
    } catch (err) {
      next(err);
    }
  };
};

export default authorization;
