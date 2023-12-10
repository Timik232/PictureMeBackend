function getUser(req: any) {
    // create a user object with is_authenticated and username fields from req.session
    return {
        is_authenticated: req.session.loggedin,
        role: req.session.role,
        user_id: req.session.user_id
    };
}
module.exports = {
    getUser: getUser
}