export function User(
  user_id,
  user_email,
  user_password,
  user_role,
  user_phone,
  user_first_name,
  user_last_name,
  user_address,
  user_image_path,
  authentication_key
) {
  return {
    user_id,
    user_email,
    user_password,
    user_role,
    user_phone,
    user_first_name,
    user_last_name,
    user_address,
    user_image_path,
    authentication_key,
  };
}
