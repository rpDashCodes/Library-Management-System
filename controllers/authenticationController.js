import User from "../Models/User.js";
import Admin from "../Models/Admin.js";

async function login(req, res) {
    const { role, rollNo, password, adminId } = req.body;

    if (role === "member") {
        try {
            const student = await User.findOne({ rollNo });
            if (student && student.password === password) {
                if (student.isBlocked) {
                    return res.status(401).json({ message: "Your acount is blocked by admin" });
                }
                else if (!student.isApproved) {
                    return res.status(401).json(
                        { message: "Your acount is not yet approved by admin Please wait till your account is approved" });
                }
                req.session.user = {
                    userId: student.rollNo,
                    role: "member",
                    userName: student.firstName,
                };
                console.log('req.session.user', req.session.user);
                
                return res.status(200).json({
                    message: "Login Successful",
                    redirect: "/member/dashboard",
                });
            } else {
                return res.status(401).json({ message: "Invalid Password" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error during login" });
        }
    }

    else if (role === "admin") {
        try {
            const admin = await Admin.findOne({ adminId });
            if (admin && admin.password === password) {
                req.session.user = {
                    userId: admin.adminId,
                    role: "admin",
                    username: admin.firstName,
                };
                return res.status(200).json({
                    message: "Login Successful",
                    redirect: "/admin/adDashboard",
                });
            } else {
                return res.status(401).json({ message: "Invalid Password" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Error during login" });
        }
    }

    res.status(400).json({ message: "Invalid role specified" });
};
export default login;
