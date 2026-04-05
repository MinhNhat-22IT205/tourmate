const User = require('../models/users.model');
const UserInfo = require('../models/user_infors.model');
const Verify = require('../models/verifies.model');
const mongoose = require('mongoose');
const emailService = require('../services/email');
const passwordService = require('../services/password'); 

exports.register = async (req, res) => {
  try {
    const { user_name, email, password } = req.body;

    // 1. Kiểm tra user tồn tại
    const existingUser = await User.findOne({ user_name });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
    }

    // 2. Mã hóa mật khẩu
    const hashedPassword = await passwordService.hashPassword(password);

    // 3. Tạo User mới với mật khẩu đã mã hóa
    const newUser = new User({
      user_id: new mongoose.Types.ObjectId().toString(),
      user_name,
      password: hashedPassword // Lưu password đã hash
    });
    const savedUser = await newUser.save();

    // 4. Tạo UserInfo
    const newUserInfo = new UserInfo({
      user_id: savedUser._id,
      email,
      phone: null,
      dob: null,
      add: null,
      bio: null,
      avatar: '',
      background: ''
    });
    await newUserInfo.save();

    // 5. Tạo mã OTP 6 số ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 6. Lưu vào bảng Verify
    const newVerify = new Verify({
      user_id: savedUser._id,
      verifies_code: otp,
      verifies_status: 0
    });
    await newVerify.save();

    // 7. Gửi email
    await emailService.sendOTP(email, otp);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác thực!',
      data: {
        user_id: savedUser.user_id,
        user_name: savedUser.user_name,
        email: newUserInfo.email
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body; // Thêm purpose: 'verify_account' hoặc 'reset_password'

    const userInfo = await UserInfo.findOne({ email });
    if (!userInfo) {
      return res.status(404).json({ success: false, message: 'Email không tồn tại' });
    }

    const verifyRecord = await Verify.findOne({ 
      user_id: userInfo.user_id,
      verifies_code: otp 
    });

    if (!verifyRecord) {
      return res.status(400).json({ success: false, message: 'Mã xác thực không chính xác hoặc đã hết hạn' });
    }

    // Nếu mục đích là xác thực tài khoản (Luồng 1 & 2)
    if (purpose === 'verify_account') {
      verifyRecord.verifies_status = 1;
      await verifyRecord.save();
    } 
    // Nếu mục đích là quên mật khẩu (Luồng 3), ta không cập nhật status, 
    // chỉ cần trả về success để Frontend cho phép qua màn NewPassScreen.
    
    res.status(200).json({
      success: true,
      message: 'Xác thực mã OTP thành công'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, new_password } = req.body;

    // 1. Tìm userInfo để lấy user_id
    const userInfo = await UserInfo.findOne({ email });
    if (!userInfo) {
      return res.status(404).json({ success: false, message: 'Email không tồn tại' });
    }

    // 2. Mã hóa mật khẩu mới
    const hashedPassword = await passwordService.hashPassword(new_password);

    // 3. Cập nhật mật khẩu trong bảng User
    await User.findByIdAndUpdate(userInfo.user_id, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Đặt lại mật khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Tìm thông tin user
    const userInfo = await UserInfo.findOne({ email });
    if (!userInfo) {
      return res.status(404).json({ success: false, message: 'Email không tồn tại' });
    }

    // 2. Tạo mã OTP mới
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Cập nhật hoặc tạo mới bản ghi Verify (Xóa mã cũ nếu có để tránh trùng)
    await Verify.deleteMany({ user_id: userInfo.user_id });
    
    const newVerify = new Verify({
      user_id: userInfo.user_id,
      verifies_code: newOtp,
      verifies_status: 0
    });
    await newVerify.save();

    // 4. Gửi lại Email
    await emailService.sendOTP(email, newOtp);

    res.status(200).json({
      success: true,
      message: 'Mã xác thực mới đã được gửi lại!'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { user_name, password } = req.body;

    // 1. Tìm user
    const user = await User.findOne({ user_name });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập không tồn tại' });
    }

    // 2. Kiểm tra mật khẩu
    const isMatch = await passwordService.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mật khẩu không chính xác' });
    }

    // 3. Kiểm tra trạng thái xác thực
    const verifyRecord = await Verify.findOne({ user_id: user._id });
    
    // Nếu không tìm thấy bản ghi verify hoặc status = 0
    if (!verifyRecord || verifyRecord.verifies_status === 0) {
      // Lấy email để frontend có thể chuyển hướng sang VerifyScreen
      const userInfo = await UserInfo.findOne({ user_id: user._id });
      return res.status(403).json({ 
        success: false, 
        message: 'Tài khoản chưa được xác thực. Vui lòng kiểm tra mã OTP trong email.',
        email: userInfo ? userInfo.email : null 
      });
    }

    // 4. Đăng nhập thành công
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user_id: user.user_id,
        user_name: user.user_name
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkEmailExists = async (req, res) => {
  try {
    const { email } = req.body;
    const userInfo = await UserInfo.findOne({ email });

    if (!userInfo) {
      return res.status(404).json({ success: false, message: 'Email này không tồn tại trong hệ thống' });
    }

    // Tạo OTP mới
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Cập nhật Verify table
    await Verify.deleteMany({ user_id: userInfo.user_id });
    const newVerify = new Verify({
      user_id: userInfo.user_id,
      verifies_code: otp,
      verifies_status: 0
    });
    await newVerify.save();

    // Gửi mail
    await emailService.sendOTP(email, otp);

    res.status(200).json({ success: true, message: 'Mã xác thực đã được gửi' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};