import { AppError } from "../../middlewares/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getEpochTime } from "../../utils/epoch.js";
import { testService } from "./test-service.js";

export const testController = {

  // ✅ Create Test
  createTest: asyncHandler(async (req, res) => {

    const created_by = req.user?.user_id;

    const {
      test_code,
      test_name,
      test_description
    } = req.body;

    if (!test_name || !test_description) {
      throw new AppError("test_name and test_description are required", 400);
    }

    const data = {
      test_code,
      test_name,
      test_description,
      created_at: getEpochTime(),
      created_by
    };

    const response = await testService.createTest(data);

    res.status(response.statusCode).json(response);
  }),

  // ✅ Get All Tests
  getTests: asyncHandler(async (req, res) => {

    const response = await testService.getTests();

    res.status(response.statusCode).json(response);
  }),


  // ✅ Get Test By ID
  getTestById: asyncHandler(async (req, res) => {

    const { test_id } = req.params;

    if (!test_id) {
      throw new AppError("test_id is required", 400);
    }

    const response = await testService.getTestById(test_id);

    res.status(response.statusCode).json(response);
  }),

    // Get all test with category and sub category
  getTestsWithCategories: asyncHandler(async (req, res) => {
 const { test_id } = req.params;

    if (!test_id) {
      throw new AppError("Test id is required", 400);
    }

  const response = await testService.getTestsWithCategories(test_id);

  res.status(response.statusCode).json(response);

}),

  // ✅ Update Test
  updateTest: asyncHandler(async (req, res) => {

    const { test_id } = req.params;

    if (!test_id) {
      throw new AppError("test_id is required", 400);
    }

    const {
      test_code,
      test_name,
      test_description,
      status
    } = req.body;

    const data = {
      test_id,
      test_code,
      test_name,
      test_description,
      status,
      updated_at: getEpochTime(),
      updated_by: req.user?.user_id
    };

    const response = await testService.updateTest(data);

    res.status(response.statusCode).json(response);
  }),

  // ✅ Delete Test (Soft Delete)
  deleteTest: asyncHandler(async (req, res) => {

    const { test_id } = req.params;

    if (!test_id) {
      throw new AppError("test_id is required", 400);
    }

    const response = await testService.deleteTest(
      test_id,
      getEpochTime(),
      req.user?.user_id
    );

    res.status(response.statusCode).json(response);
  }),

};