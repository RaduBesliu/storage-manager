const checkSuperAdmin = (req, res, next) => {
    const { role } = req.body;
    if (role !== "Super Admin") {
      return res.status(403).json({ message: "Acces interzis. Doar Super Admin poate efectua aceasta actiune." });
    }
    next();
  };
  
  module.exports = checkSuperAdmin;
  