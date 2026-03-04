import { query } from "./database.js";
import { AppError } from "../middlewares/app-error.js";

export const checkAdminForBranch = async (user_id) => {
  const [user] = await query(
    `
    SELECT role_id
    FROM tbl_users
    WHERE user_id = ?
      AND user_status = '1'
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [user_id]
  );

  if (!user) {
    throw new AppError("User not found or inactive", 401);
  }

  // 1 = super_admin, 2 = firm_admin
  if (![1, 2].includes(Number(user.role_id))) {
    throw new AppError(
      "Only Super Admin or Firm Admin can perform this action",
      403
    );
  }

  return true;
};

export const checkAdmins = async (user_id) => {
  const [user] = await query(
    `
    SELECT role_id
    FROM tbl_users
    WHERE user_id = ?
      AND user_status = '1'
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [user_id]
  );

  if (!user) {
    throw new AppError("User not found or inactive", 401);
  }

  // 1 = super_admin, 2 = firm_admin , 3 = branch_admin
  if (![1, 2, 3].includes(Number(user.role_id))) {
    throw new AppError(
      "Only Admin can perform this action",
      403
    );
  }

  return true;
};