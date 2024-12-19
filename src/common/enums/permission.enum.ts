export enum PermissionsEnum {
  READ_SECURE_DATA = 'read_secure_data',
  WRITE_SECURE_DATA = 'write_secure_data',
  DELETE_SECURE_DATA = 'delete_secure_data',
  UPDATE_SECURE_DATA = 'update_secure_data',
  VIEW_USER_PROFILES = 'view_user_profiles',
  EDIT_USER_PROFILES = 'edit_user_profiles',
  DELETE_USER_PROFILES = 'delete_user_profiles',
  MANAGE_ROLES = 'manage_roles',
  VIEW_REPORTS = 'view_reports',
  GENERATE_REPORTS = 'generate_reports',
  MANAGE_SETTINGS = 'manage_settings',
  ACCESS_DASHBOARD = 'access_dashboard',
  PERFORM_ADMIN_ACTIONS = 'perform_admin_actions',
  CREATE_ROLE = 'CREATE_ROLE',
  UPDATE_ROLE = 'UPDATE_ROLE',
  DELETE_ROLE = 'DELETE_ROLE',
  VIEW_ROLE = 'VIEW_ROLE',
  VIEW_USER = 'view_user', // Quyền xem thông tin người dùng
  CREATE_USER = 'create_user', // Quyền tạo người dùng mới
  EDIT_USER = 'edit_user', // Quyền chỉnh sửa thông tin người dùng
  DELETE_USER = 'delete_user', // Quyền xóa người dùng
  ASSIGN_ROLE = 'assign_role', // Quyền gán vai trò cho người dùng
  REMOVE_ROLE = 'remove_role', // Quyền gỡ vai trò của người dùng
  VIEW_PERMISSION = 'view_permission', // Quyền xem các quyền của người dùng
  EDIT_PERMISSION = 'edit_permission', // Quyền chỉnh sửa các quyền
  DELETE_PERMISSION = 'delete_permission', // Quyền xóa quyền của người dùng
  CREATE_PERMISSION = 'create_permission' // Quyền tạo quyền mới
}

// UPDATE_SECURE_DATA: Cập nhật dữ liệu bảo mật.
// VIEW_USER_PROFILES: Xem thông tin người dùng.
// EDIT_USER_PROFILES: Chỉnh sửa thông tin người dùng.
// DELETE_USER_PROFILES: Xóa thông tin người dùng.
// MANAGE_ROLES: Quản lý vai trò của người dùng.
// VIEW_REPORTS: Xem báo cáo.
// GENERATE_REPORTS: Tạo báo cáo.
// MANAGE_SETTINGS: Quản lý cài đặt hệ thống.
// ACCESS_DASHBOARD: Truy cập bảng điều khiển.
// PERFORM_ADMIN_ACTIONS: Thực hiện các hành động quản trị.
