
module.exports = (req, res, next) => {
    let result = req.result;
    if (result && result['isAdmin'] === 1) {
        next();
    } else {
        return res.status(403).json("UNAUTHORIZED");
    }
}