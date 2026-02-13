export default async (req, res, next) => {
  try {
    if (!req.isAdministrator) {
      return res.status(401).json({
        error: 'Administrator rights are required to perform this action.',
      });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};
