resource "aws_s3_bucket" "social_care_referrals_bucket" {
  bucket = "${var.resource_name_prefix}-bucket"
}

resource "aws_s3_bucket_notification" "social_care_referrals_bucket_notification" {
  depends_on = [aws_sqs_queue.social_care_referrals_queue]

  bucket = aws_s3_bucket.social_care_referrals_bucket.id

  queue {
    queue_arn = aws_sqs_queue.social_care_referrals_queue.arn
    events    = ["s3:ObjectCreated:Put"]
  }
}
