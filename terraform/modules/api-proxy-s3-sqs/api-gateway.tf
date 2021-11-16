resource "aws_api_gateway_account" "social_care_api_gateway_account" {
  cloudwatch_role_arn = aws_iam_role.social_care_api_cloudwatch.arn
}

resource "aws_api_gateway_rest_api" "social_care_referrals_s3_api" {
  name = "${var.project_name}-s3-api"
}

resource "aws_api_gateway_resource" "form_submissions" {
  rest_api_id = aws_api_gateway_rest_api.social_care_referrals_s3_api.id
  parent_id   = aws_api_gateway_rest_api.social_care_referrals_s3_api.root_resource_id
  path_part   = "form-submissions"
}

resource "aws_api_gateway_resource" "form_data" {
  rest_api_id = aws_api_gateway_rest_api.social_care_referrals_s3_api.id
  parent_id   = aws_api_gateway_resource.form_submissions.id
  path_part   = "{form-data}"
}

resource "aws_api_gateway_method" "put_form_data" {
  rest_api_id      = aws_api_gateway_rest_api.social_care_referrals_s3_api.id
  resource_id      = aws_api_gateway_resource.form_data.id
  http_method      = "PUT"
  authorization    = "NONE"
  api_key_required = true

  request_parameters = {
    "method.request.header.Accept"              = false
    "method.request.header.Content-Type"        = false
    "method.request.header.x-amz-meta-fileinfo" = false

    "method.request.path.form-data" = true
  }
}

resource "aws_api_gateway_method_response" "http_ok" {
  rest_api_id = aws_api_gateway_rest_api.social_care_referrals_s3_api.id
  resource_id = aws_api_gateway_resource.form_data.id
  http_method = aws_api_gateway_method.put_form_data.http_method
  status_code = 200
}

resource "aws_api_gateway_method_response" "http_bad_request" {
  rest_api_id = aws_api_gateway_rest_api.social_care_referrals_s3_api.id
  resource_id = aws_api_gateway_resource.form_data.id
  http_method = aws_api_gateway_method.put_form_data.http_method
  status_code = 400
}

resource "aws_api_gateway_method_response" "http_internal_server_error" {
  rest_api_id = aws_api_gateway_rest_api.social_care_referrals_s3_api.id
  resource_id = aws_api_gateway_resource.form_data.id
  http_method = aws_api_gateway_method.put_form_data.http_method
  status_code = 500
}

resource "aws_api_gateway_deployment" "social_care_referrals_s3_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.social_care_referrals_s3_api.id
  # Redeploy when there are new updates
  triggers = {
    redeployment = sha1(join(",", tolist([
      jsonencode(aws_api_gateway_integration.social_care_referrals_s3_api),
    ])))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_method.put_form_data,
    aws_api_gateway_integration.social_care_referrals_s3_api,
  ]
}

resource "aws_api_gateway_stage" "social_care_referrals_s3_api_stage" {
  deployment_id = aws_api_gateway_deployment.social_care_referrals_s3_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.social_care_referrals_s3_api.id
  stage_name    = lower(var.environment)
}

resource "aws_api_gateway_method_settings" "social_care_referrals_s3_api_settings" {
  rest_api_id = aws_api_gateway_rest_api.social_care_referrals_s3_api.id
  stage_name  = aws_api_gateway_stage.social_care_referrals_s3_api_stage.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled = true
    logging_level   = "ERROR"
  }
}

resource "aws_api_gateway_api_key" "social_care_referrals_s3_api_key" {
  name = "${var.project_name}-s3-api-key"
}

resource "aws_api_gateway_usage_plan" "social_care_referrals_s3_api_usage_plan" {
  name = "${var.project_name}-s3-api-usage-plan"
  api_stages {
    api_id = aws_api_gateway_rest_api.social_care_referrals_s3_api.id
    stage  = aws_api_gateway_stage.social_care_referrals_s3_api_stage.stage_name
  }
}

resource "aws_api_gateway_usage_plan_key" "social_care_referrals_s3_usage_plan_key" {
  key_id        = aws_api_gateway_api_key.social_care_referrals_s3_api_key.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.social_care_referrals_s3_api_usage_plan.id
}
