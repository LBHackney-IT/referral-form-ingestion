resource "aws_sqs_queue" "social_care_referrals_queue" {
  name                       = "${var.queue_name_prefix}-queue"
  redrive_policy             = "{\"deadLetterTargetArn\":${aws_sqs_queue.social_care_referrals_dl_queue.arn},\"maxReceiveCount\":5}"
  visibility_timeout_seconds = 300

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "s3.amazonaws.com"
      },
      "Action": "SQS:SendMessage",
      "Resource": "arn:aws:sqs:*:*:${var.queue_name_prefix}-queue",
      "Condition": {
        "ArnLike": { "aws:SourceArn": "${aws_s3_bucket.social_care_referrals_bucket.arn}" }
      }
    }
  ]
}
POLICY
}

resource "aws_sqs_queue" "social_care_referrals_dl_queue" {
  name = "${var.queue_name_prefix}-dl-queue"
}
