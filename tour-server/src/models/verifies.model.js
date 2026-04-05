const mongoose = require('mongoose');

const verifySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    verifies_code: {
      type: String,
      required: true
    },
    verifies_status: {
      type: Number,
      default: 0 // 0: chưa xác thực, 1: đã xác thực
    },
    time_exists: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 phút
      index: { expires: '10m' } // Tự động xóa document sau 10p
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('verifies', verifySchema);