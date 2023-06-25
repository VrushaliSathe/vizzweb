var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const Address = new Schema({
  address: String,
  city: String,
  state: String,
  country: String,
  zip: String,
});

const UserSetup = new Schema({
  userSignupType: String,
  defaultUserType: String,
  defaultUserGroup: String,
  isEnforceStrongPassword: { type: Boolean, default: false },
  isEnforcePasswordChange: { type: Boolean, default: false },
  passwordExpDays: String,
  isPasswordChangeOnFirstLogin: { type: Boolean, default: false },
  lockAccountInAttempts: Number,
  termsOdService: String,
  isSocialMediaSignupAllowed: { type: Boolean, default: false },
  isSocialMediaInteractionAllowed: { type: Boolean, default: false },
  isShareCertificateAllowed: { type: Boolean, default: false },
  isCourseRatingAllowed: { type: Boolean, default: false },
});

const Client = new Schema({
  name: { type:String, required: true },
  phone: { type:String, required: true },
  email: String,
  slug: { type:String, required: true },
  website: String,
  language: String,
  timeZone: String,
  dateFormate: String,
  currency: String,
  clientLogo: String,
  bannerImage: String,
  setUpRequired: { type: Boolean, default: true },
  companySetupDone: { type: Boolean, default: false },
  referralMethod: Number,
  referredBy: String,
  startDate: { type:Date, required: true, default: Date.now() },
  mailSupport: Boolean,
  callSupport: Boolean,
  agreementAccepted: { type:Boolean, required: true, default: false },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'address'
  }, //this will be object
  remark: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  status: { type: Number, enum: [0, 1], required: true, default: 1 }, //0=deleted, 1=active
},
{
  timestamps: true
});

module.exports = mongoose.models.client || mongoose.model("client", Client);
