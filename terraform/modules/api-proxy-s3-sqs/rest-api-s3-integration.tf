resource "aws_api_gateway_integration" "social_care_referrals_s3_api" {
  rest_api_id             = aws_api_gateway_rest_api.social_care_referrals_s3_api.id
  resource_id             = aws_api_gateway_resource.form_data.id
  http_method             = aws_api_gateway_method.put_form_data.http_method
  type                    = "AWS"
  integration_http_method = "PUT"
  credentials             = aws_iam_role.api_gateway_integration_s3_role.arn
  uri                     = "arn:aws:apigateway:${var.region}:s3:path/${aws_s3_bucket.social_care_referrals_bucket.bucket}/form-submissions/{form-data}"
  passthrough_behavior    = "WHEN_NO_MATCH"
  content_handling        = "CONVERT_TO_TEXT"

  request_parameters = {
    "integration.request.header.x-amz-meta-fileinfo" = "method.request.header.x-amz-meta-fileinfo"
    "integration.request.header.Accept"              = "method.request.header.Accept"
    "integration.request.header.Content-Type"        = "method.request.header.Content-Type"

    "integration.request.path.form-data" = "method.request.path.form-data"
  }

  depends_on = [
    aws_iam_role_policy_attachment.api_gateway_integration_s3_role_policy
  ]
}

resource "aws_api_gateway_integration_response" "integration_response_ok" {
  rest_api_id = aws_api_gateway_rest_api.social_care_referrals_s3_api.id
  resource_id = aws_api_gateway_resource.form_data.id
  http_method = aws_api_gateway_method.put_form_data.http_method
  status_code = aws_api_gateway_method_response.http_ok.status_code
  // Any 200 message that comes back from S3
  selection_pattern = "2\\d{2}"

  depends_on = [
    aws_api_gateway_integration.social_care_referrals_s3_api
  ]
}

resource "aws_api_gateway_integration_response" "integration_response_bad_request" {
  rest_api_id = aws_api_gateway_rest_api.social_care_referrals_s3_api.id
  resource_id = aws_api_gateway_resource.form_data.id
  http_method = aws_api_gateway_method.put_form_data.http_method
  status_code = aws_api_gateway_method_response.http_bad_request.status_code
  // Any 400 message that comes back from S3
  selection_pattern = "4\\d{2}"

  depends_on = [
    aws_api_gateway_integration.social_care_referrals_s3_api
  ]
}

resource "aws_api_gateway_integration_response" "integration_response_internal_server_error" {
  rest_api_id = aws_api_gateway_rest_api.social_care_referrals_s3_api.id
  resource_id = aws_api_gateway_resource.form_data.id
  http_method = aws_api_gateway_method.put_form_data.http_method
  status_code = aws_api_gateway_method_response.http_internal_server_error.status_code
  // Any 500 message that comes back from S3
  selection_pattern = "5\\d{2}"

  depends_on = [
    aws_api_gateway_integration.social_care_referrals_s3_api
  ]
}
