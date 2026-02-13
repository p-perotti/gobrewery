export default async (req, res, next) => {
  if (req.isAdministrator || (req.isGuest && req.method === 'GET')) {
    return next();
  }

  return res.status(401).json({
    error: 'Administrator rights are required to perform this action.',
  });
};
