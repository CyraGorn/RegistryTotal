module.exports = (req, res, next) => {
    const remoteAddress = req.connection.remoteAddress;
    const serverIpAddress = '::1';
    if (remoteAddress !== serverIpAddress) {
        res.status(404).send("Not Found");
    }
    next();
};