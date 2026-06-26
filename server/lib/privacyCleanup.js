const Visitor = require('../models/visitors.model');

const performPrivacyAnonymization = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await Visitor.updateMany(
      {
        checkIn: { $lt: thirtyDaysAgo },
        $or: [
          { name: { $exists: true, $ne: "" } },
          { phone: { $exists: true } }
        ]
      },
      {
        $unset: { name: "", phone: "" }
      }
    );

    console.log(`🧹 GDPR Cleanup: ${result.modifiedCount} records anonymized`);
  } catch (error) {
    console.error('❌ GDPR Cleanup failed:', error.message);
  }
};

const initPrivacyWorker = () => {
  performPrivacyAnonymization();

  setInterval(() => {
    performPrivacyAnonymization();
  }, 24 * 60 * 60 * 1000);

  console.log('⏰ GDPR Privacy Cleanup worker registered.');
};

module.exports = {
  performPrivacyAnonymization,
  initPrivacyWorker,
};