module.exports = function (app) {
    app.use(function (req, res, next) {
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Option", "deny");
        res.setHeader("Referrer-Policy", "no-referrer");
        res.setHeader("Content-Security-Policy", "default-src *; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; font-src https://fonts.gstatic.com;");
        next();
    });
};