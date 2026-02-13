export default async (req, res, next) => {
  const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (req.isGuest && writeMethods.includes(req.method)) {
    return res.status(403).json({ error: 'Guest access is read-only.' });
  }

  return next();
};
