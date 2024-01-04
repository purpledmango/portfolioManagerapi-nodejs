export const checkSessionMiddleware = async (req, res, next) => {
    if (!req.session) {
        return res.status(401).json({ message: "Unauthorized Access!" });
    }
    next();
};
