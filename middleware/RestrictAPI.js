module.exports = (req, res, next) => {
    const remoteAddress = req.connection.remoteAddress;
    return res.status(404).json(remoteAddress);
    // const serverIpAddress = '::1';
    // if (remoteAddress !== serverIpAddress) {
    //     res.status(404).send("NOT FOUND");
    // }
    // next();
};