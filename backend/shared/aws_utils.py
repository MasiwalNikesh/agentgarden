"""
AWS utilities for interacting with AWS services
"""
import json
import boto3
from typing import Optional, Dict, Any
from botocore.exceptions import ClientError
from .config import settings


class AWSSecretsManager:
    """
    Utility class for interacting with AWS Secrets Manager
    """

    def __init__(self):
        self.client = boto3.client(
            'secretsmanager',
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key
        )

    def get_secret(self, secret_name: str) -> Dict[str, Any]:
        """
        Retrieve a secret from AWS Secrets Manager

        Args:
            secret_name: Name of the secret to retrieve

        Returns:
            Dictionary containing the secret data
        """
        try:
            response = self.client.get_secret_value(SecretId=secret_name)

            if 'SecretString' in response:
                return json.loads(response['SecretString'])
            else:
                # Binary secrets are not commonly used for API keys
                raise ValueError("Binary secrets are not supported")

        except ClientError as e:
            raise Exception(f"Error retrieving secret {secret_name}: {str(e)}")

    def store_secret(self, secret_name: str, secret_data: Dict[str, Any]) -> bool:
        """
        Store a secret in AWS Secrets Manager

        Args:
            secret_name: Name for the secret
            secret_data: Dictionary of secret data

        Returns:
            True if successful
        """
        try:
            self.client.create_secret(
                Name=secret_name,
                SecretString=json.dumps(secret_data)
            )
            return True
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceExistsException':
                # Update existing secret
                self.client.update_secret(
                    SecretId=secret_name,
                    SecretString=json.dumps(secret_data)
                )
                return True
            raise Exception(f"Error storing secret {secret_name}: {str(e)}")

    def delete_secret(self, secret_name: str) -> bool:
        """
        Delete a secret from AWS Secrets Manager

        Args:
            secret_name: Name of the secret to delete

        Returns:
            True if successful
        """
        try:
            self.client.delete_secret(
                SecretId=secret_name,
                ForceDeleteWithoutRecovery=True
            )
            return True
        except ClientError as e:
            raise Exception(f"Error deleting secret {secret_name}: {str(e)}")


class AWSS3Manager:
    """
    Utility class for interacting with AWS S3
    """

    def __init__(self):
        self.client = boto3.client(
            's3',
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key
        )
        self.bucket = settings.aws_s3_bucket

    def upload_file(self, file_content: bytes, key: str, metadata: Optional[Dict] = None) -> str:
        """
        Upload a file to S3

        Args:
            file_content: File content as bytes
            key: S3 object key
            metadata: Optional metadata dictionary

        Returns:
            S3 object URL
        """
        try:
            extra_args = {}
            if metadata:
                extra_args['Metadata'] = metadata

            self.client.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=file_content,
                **extra_args
            )

            return f"s3://{self.bucket}/{key}"
        except ClientError as e:
            raise Exception(f"Error uploading file to S3: {str(e)}")

    def download_file(self, key: str) -> bytes:
        """
        Download a file from S3

        Args:
            key: S3 object key

        Returns:
            File content as bytes
        """
        try:
            response = self.client.get_object(Bucket=self.bucket, Key=key)
            return response['Body'].read()
        except ClientError as e:
            raise Exception(f"Error downloading file from S3: {str(e)}")

    def delete_file(self, key: str) -> bool:
        """
        Delete a file from S3

        Args:
            key: S3 object key

        Returns:
            True if successful
        """
        try:
            self.client.delete_object(Bucket=self.bucket, Key=key)
            return True
        except ClientError as e:
            raise Exception(f"Error deleting file from S3: {str(e)}")


class AWSSESManager:
    """
    Utility class for sending emails via AWS SES
    """

    def __init__(self):
        self.client = boto3.client(
            'ses',
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key
        )
        self.verified_email = settings.aws_ses_verified_email

    def send_email(
        self,
        to: str,
        subject: str,
        body: str,
        from_email: Optional[str] = None,
        html_body: Optional[str] = None,
        cc: Optional[list] = None,
        bcc: Optional[list] = None
    ) -> Dict[str, Any]:
        """
        Send an email via AWS SES

        Args:
            to: Recipient email address
            subject: Email subject
            body: Plain text email body
            from_email: Sender email (must be verified in SES)
            html_body: Optional HTML email body
            cc: Optional list of CC recipients
            bcc: Optional list of BCC recipients

        Returns:
            Dictionary with MessageId and response metadata
        """
        try:
            sender = from_email or self.verified_email

            # Build destination
            destination = {'ToAddresses': [to] if isinstance(to, str) else to}
            if cc:
                destination['CcAddresses'] = cc
            if bcc:
                destination['BccAddresses'] = bcc

            # Build message
            message = {
                'Subject': {'Data': subject, 'Charset': 'UTF-8'},
                'Body': {'Text': {'Data': body, 'Charset': 'UTF-8'}}
            }

            if html_body:
                message['Body']['Html'] = {'Data': html_body, 'Charset': 'UTF-8'}

            response = self.client.send_email(
                Source=sender,
                Destination=destination,
                Message=message
            )

            return {
                'success': True,
                'message_id': response['MessageId'],
                'to': to,
                'subject': subject
            }

        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']

            return {
                'success': False,
                'error_code': error_code,
                'error_message': error_message,
                'to': to,
                'subject': subject
            }

    def send_templated_email(
        self,
        to: str,
        template_name: str,
        template_data: Dict[str, Any],
        from_email: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send an email using an SES template

        Args:
            to: Recipient email address
            template_name: Name of the SES template
            template_data: Data to populate the template
            from_email: Sender email (must be verified in SES)

        Returns:
            Dictionary with MessageId and response metadata
        """
        try:
            sender = from_email or self.verified_email

            response = self.client.send_templated_email(
                Source=sender,
                Destination={'ToAddresses': [to] if isinstance(to, str) else to},
                Template=template_name,
                TemplateData=json.dumps(template_data)
            )

            return {
                'success': True,
                'message_id': response['MessageId'],
                'to': to,
                'template': template_name
            }

        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']

            return {
                'success': False,
                'error_code': error_code,
                'error_message': error_message,
                'to': to,
                'template': template_name
            }

    def verify_email_address(self, email: str) -> bool:
        """
        Send a verification email to an address

        Args:
            email: Email address to verify

        Returns:
            True if verification email sent successfully
        """
        try:
            self.client.verify_email_identity(EmailAddress=email)
            return True
        except ClientError as e:
            raise Exception(f"Error verifying email {email}: {str(e)}")


# Singleton instances
secrets_manager = AWSSecretsManager() if settings.aws_secrets_manager_enabled else None
s3_manager = AWSS3Manager() if settings.aws_s3_bucket else None
ses_manager = AWSSESManager()
