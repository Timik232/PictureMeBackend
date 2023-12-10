import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export class JWTService {
    static setSecretKey(secretKey) {
        this.secretKey = secretKey;
    }
    static middleware(req, res, next) {
        console.log(req.body);
        let token = req.cookies["jwt"];
        if (token) {
            let result = JWTService.verify(token);
            if (result == false) {
                console.log(req.url);
                if (req.url.indexOf("api") == 1) {
                    res.status(401).json({ message: "Invalid token" });
                }
                else if (req.url != "/account/login") {
                    res.redirect("/account/login");
                    req.body.logged = false;
                }
                else {
                    next();
                }
                return;
            }
            else {
                req.body.logged = true;
                req.body.id = result;
            }
        }
        else {
            req.body.logged = false;
        }
        next();
    }
    static verify(token) {
        let decoded;
        try {
            decoded = jwt.verify(token, this.secretKey);
        }
        catch (err) {
            console.log(err);
            return false;
        }
        if (!decoded) {
            return false;
        }
        else {
            if (typeof decoded == "string") {
                console.log("Error: " + decoded);
                return false;
            }
            return decoded.id;
        }
    }
    //         jwt.verify(token, Login.secretKey, (err, decoded) => {
    //             if (err || !decoded) {
    //                 res.status(401).json({message: "Invalid token: " + JSON.stringify(err)});
    //                 return;
    //             } else {
    //                 let body = decoded as {login: string};
    //                 console.log("Login: " + body.login)
    //                 req.body.login = body.login;
    //                 req.body.logged = true;
    //             }
    //         })
    static async getLogin(token) {
        try {
            let decoded = jwt.verify(token, this.secretKey);
            return decoded === null || decoded === void 0 ? void 0 : decoded.login;
        }
        catch (error) {
            console.log(error);
        }
    }
    static generateToken(id) {
        return jwt.sign({ id: id }, this.secretKey, { expiresIn: "12h" });
    }
    static encryptPassword(password) {
        let salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }
    static comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
}
JWTService.secretKey = "secretkey132013";
