"""
Stripe client for payment processing and billing
"""
import os
from typing import Optional, Dict, Any, List


class StripeClient:
    """
    Stripe client for payment processing, invoicing, and subscription management
    """

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Stripe client

        Args:
            api_key: Stripe secret key
        """
        self.api_key = api_key or os.getenv("STRIPE_API_KEY")
        self.stripe = None

        if self.api_key:
            self._init_stripe()

    def _init_stripe(self):
        """Initialize Stripe SDK"""
        try:
            import stripe
            stripe.api_key = self.api_key
            self.stripe = stripe
        except ImportError:
            raise ImportError("stripe package required. Install with: pip install stripe")

    def create_customer(
        self,
        email: str,
        name: Optional[str] = None,
        metadata: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Create a Stripe customer"""
        if not self.stripe:
            raise ValueError("Stripe not initialized")

        customer = self.stripe.Customer.create(
            email=email,
            name=name,
            metadata=metadata or {}
        )

        return {
            "id": customer.id,
            "email": customer.email,
            "name": customer.name,
            "created": customer.created
        }

    def create_payment_intent(
        self,
        amount: int,
        currency: str = "usd",
        customer_id: Optional[str] = None,
        description: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a payment intent

        Args:
            amount: Amount in cents (e.g., 2000 = $20.00)
            currency: Three-letter ISO currency code
            customer_id: Stripe customer ID
            description: Payment description

        Returns:
            Payment intent dict
        """
        if not self.stripe:
            raise ValueError("Stripe not initialized")

        intent = self.stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            customer=customer_id,
            description=description
        )

        return {
            "id": intent.id,
            "amount": intent.amount,
            "currency": intent.currency,
            "status": intent.status,
            "client_secret": intent.client_secret
        }

    def create_invoice(
        self,
        customer_id: str,
        description: Optional[str] = None,
        auto_advance: bool = True
    ) -> Dict[str, Any]:
        """Create an invoice for customer"""
        if not self.stripe:
            raise ValueError("Stripe not initialized")

        invoice = self.stripe.Invoice.create(
            customer=customer_id,
            description=description,
            auto_advance=auto_advance
        )

        return {
            "id": invoice.id,
            "customer": invoice.customer,
            "status": invoice.status,
            "total": invoice.total,
            "hosted_invoice_url": invoice.hosted_invoice_url
        }

    def get_payment_status(self, payment_intent_id: str) -> Dict[str, Any]:
        """Get payment intent status"""
        if not self.stripe:
            raise ValueError("Stripe not initialized")

        intent = self.stripe.PaymentIntent.retrieve(payment_intent_id)

        return {
            "id": intent.id,
            "status": intent.status,
            "amount": intent.amount,
            "amount_received": intent.amount_received
        }


class MockStripeClient:
    """Mock Stripe client"""

    def create_customer(self, email: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Stripe create_customer: {email}")
        return {"id": "cus_mock123", "email": email}

    def create_payment_intent(self, amount: int, currency: str = "usd", **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Stripe create_payment_intent: ${amount/100} {currency}")
        return {"id": "pi_mock456", "amount": amount, "status": "requires_payment_method", "client_secret": "secret_mock"}

    def create_invoice(self, customer_id: str, **kwargs) -> Dict[str, Any]:
        print(f"[MOCK] Stripe create_invoice for {customer_id}")
        return {"id": "in_mock789", "customer": customer_id, "status": "draft", "total": 0}

    def get_payment_status(self, payment_intent_id: str) -> Dict[str, Any]:
        print(f"[MOCK] Stripe get_payment_status: {payment_intent_id}")
        return {"id": payment_intent_id, "status": "succeeded", "amount": 2000, "amount_received": 2000}
