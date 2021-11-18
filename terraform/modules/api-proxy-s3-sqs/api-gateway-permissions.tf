data "aws_iam_policy" "full_cloudwatch_access" {
  arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

resource "aws_iam_role" "social_care_api_cloudwatch" {
  name               = "${var.resource_name_prefix}-api-gateway-cloudwatch-global"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "social_care_api_cloudwatch" {
  name = "${var.resource_name_prefix}-api-gateway-cloudwatch-global-default"
  role = aws_iam_role.social_care_api_cloudwatch.id

  policy = data.aws_iam_policy.full_cloudwatch_access.policy
}

resource "aws_iam_policy" "api_gateway_integration_s3_policy" {
  name        = "${var.resource_name_prefix}-s3-api-integration"
  description = "Policy for allowing s3 and Logging"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents",
          "logs:GetLogEvents",
          "logs:FilterLogEvents"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "s3:PutObject",
          "s3:PutObjectAcl"
        ],
        Resource = [
          aws_s3_bucket.social_care_referrals_bucket.arn,
          "${aws_s3_bucket.social_care_referrals_bucket.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role" "api_gateway_integration_s3_role" {
  name = "${var.resource_name_prefix}-s3-api-integration-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
  EOF
}

resource "aws_iam_role_policy_attachment" "api_gateway_integration_s3_role_policy" {
  role       = aws_iam_role.api_gateway_integration_s3_role.name
  policy_arn = aws_iam_policy.api_gateway_integration_s3_policy.arn
}
