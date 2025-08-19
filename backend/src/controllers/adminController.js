import User from '../models/User.js';
import Report from '../models/Report.js';
export async function dashboard(req,res){
  const [users, open, hidden] = await Promise.all([
    User.countDocuments(),
    Report.countDocuments({ status: 'OPEN' }),
    Report.countDocuments({ status: 'HIDDEN' })
  ]);
  res.json({ users, reportsOpen: open, reportsHidden: hidden });
}
export async function listUsers(req,res){
  const users = await User.find().select('name email role createdAt').sort({ createdAt:-1 });
  res.json(users);
}