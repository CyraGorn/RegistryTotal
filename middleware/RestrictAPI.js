module.exports = (req, res, next) => {
    const remoteAddress = req.connection.remoteAddress;
    const serverIpAddress = '::1';
    if (remoteAddress !== serverIpAddress) {
        return res.status(404).send("Not Found");
    }
    next();
};