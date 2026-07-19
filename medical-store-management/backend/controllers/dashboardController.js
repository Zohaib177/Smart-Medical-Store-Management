const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const dashboardService = require('../services/dashboardService');

const getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getDashboardSummary();

  return ApiResponse.success(res, {
    message: 'Dashboard summary retrieved successfully',
    data: {
      ...summary,
      generatedAt: new Date().toISOString(),
    },
  });
});

module.exports = {
  getSummary,
};
