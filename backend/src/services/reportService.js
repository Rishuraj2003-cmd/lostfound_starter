// src/services/reportService.js

import { createReportRepo, getReportsRepo, claimReportRepo,getReportByIdRepo } from "../repositories/reportRepository.js";
import { findPotentialMatches } from "./matchService.js";
// ✅ CREATE REPORT SERVICE
export const createReportService = async (data, user, io) => {
  try {
    // Create report
    const report = await createReportRepo({
      ...data,
      postedBy: user?.id
    });

    // Find matches safely
    let matches = [];
    try {
      matches = await findPotentialMatches(report);
    } catch (err) {
      matches = [];
    }

    // Socket event
    if (io && report.postedBy) {
      io.to(`user:${report.postedBy}`).emit("report:created", report);
    }

    return { report, matches };

  } catch (error) {
    console.error("Error in createReportService:", error);
    throw error;
  }
};

// ✅ LIST REPORTS SERVICE
export const listReportsService = async (query) => {
  try {
    const { q, category, type, city, page = 1, limit = 12 } = query;

    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (city) filter.city = city;
    if (q) filter.$text = { $search: q };

    const skip = (Number(page) - 1) * Number(limit);

    const { items, total } = await getReportsRepo(filter, skip, Number(limit));

    return {
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    };

  } catch (error) {
    console.error("Error in listReportsService:", error);
    throw error;
  }
};
export const getReportService = async (id) => {
  try {
    const report = await getReportByIdRepo(id);

    if (!report) {
      throw new Error("Not found");
    }

    return report;

  } catch (error) {
    console.error("Error in getReportService:", error);
    throw error;
  }
};
export const claimReportService = async (reportId, userId) => {
  const report = await claimReportRepo(reportId, userId);

  if (!report) {
    throw new Error("Report not found or already claimed");
  }

  return report;
};