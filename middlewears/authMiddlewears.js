export const isAuthenticated = (req, res, next)=> {
    if (req.session.user) {
        next();
    }
    else {
        res.render('error', { message: "Unauthorized Access pleease log in " });
    }

}

export const isAdmin = (req, res, next)=> {
    if (req.session.user.role == "admin") {
        next();
    }
    else {
        res.render('error', { message: "Unauthorized acces. Page is acessible to admin only" })
    }
}

export const isMember = (req, res, next)=> {
    if (req.session.user.role == "member") {
        next();
    }

    else {
        res.render('error', { message: "Acessible to members only" });
    }
}