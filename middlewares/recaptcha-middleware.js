const https = require('https');

class RecaptchaMiddleware {

    checkReCaptchaToken(req, res, next) {

        var body = req.body
        var checkUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=6LdrnMwUAAAAABdZOqfaCrNN4ZNWCqH2IWjwu0Oj&response=' + body.token

        https.get(checkUrl, resp => {
            // console.log(resp)
            let d = '';
            resp.on('data', (chunk) => {
                d += chunk;
            });
            resp.on('end', () => {
                var rcp = JSON.parse(d.toString())
                if (rcp.success) {
                    next()
                } else {
                    return res.json({ token: false })
                }
                // return res.json(resp.statusCode, { rcp: JSON.parse(d.toString()), body });
            });
        }).on("error", (err) => {
            return res.json({ error: err, token: false })
        });
    }



}

module.exports = new RecaptchaMiddleware()