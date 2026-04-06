// src/repositories/reportRepository.js

import Report from "../models/Report.js";

// ✅ CREATE REPORT
export const createReportRepo = async (data) => {
  return Report.create(data); // no need for await here
};

// ✅ GET ALL REPORTS (with pagination + filter)
export const getReportsRepo = async (filter, skip, limit) => {
  const query = Report.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const countQuery = Report.countDocuments(filter);

  const [items, total] = await Promise.all([query, countQuery]);

  return { items, total };
};

// ✅ GET SINGLE REPORT
export const getReportByIdRepo = async (id) => {
  return Report.findById(id).populate("postedBy", "name email");
};
export const claimReportRepo = async (reportId, userId) => {
  return await Report.findOneAndUpdate(
    { _id: reportId, status: "OPEN" }, // only open reports can be claimed
    {
      status: "CLAIMED",
      claimedBy: userId
    },
    { new: true }
  );
};