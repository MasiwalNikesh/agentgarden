"""
HubSpot API Integration
"""
from typing import Dict, Any, Optional, List
import requests
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from backend.shared.config import settings


class HubSpotClient:
    """
    Client for interacting with HubSpot CRM API
    """

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize HubSpot client

        Args:
            api_key: HubSpot API key or private app access token
        """
        self.api_key = api_key or settings.hubspot_api_key
        self.base_url = "https://api.hubapi.com"

    def _get_headers(self) -> Dict[str, str]:
        """Get authorization headers"""
        if not self.api_key:
            raise ValueError("HubSpot API key not configured")

        return {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }

    def create_contact(
        self,
        email: str,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        company: Optional[str] = None,
        phone: Optional[str] = None,
        website: Optional[str] = None,
        additional_properties: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Create or update a contact in HubSpot

        Args:
            email: Contact email (required)
            first_name: Contact first name
            last_name: Contact last name
            company: Company name
            phone: Phone number
            website: Website URL
            additional_properties: Additional custom properties

        Returns:
            Dictionary with success status and contact details
        """
        try:
            properties = {'email': email}

            if first_name:
                properties['firstname'] = first_name
            if last_name:
                properties['lastname'] = last_name
            if company:
                properties['company'] = company
            if phone:
                properties['phone'] = phone
            if website:
                properties['website'] = website

            if additional_properties:
                properties.update(additional_properties)

            payload = {'properties': properties}

            response = requests.post(
                f'{self.base_url}/crm/v3/objects/contacts',
                headers=self._get_headers(),
                json=payload,
                timeout=10
            )

            if response.status_code in [200, 201]:
                data = response.json()
                return {
                    'success': True,
                    'contact_id': data['id'],
                    'email': email,
                    'properties': data.get('properties', {})
                }
            elif response.status_code == 409:
                # Contact already exists, try to update
                return self.update_contact_by_email(email, properties)
            else:
                return {
                    'success': False,
                    'error': f'API returned status {response.status_code}: {response.text}'
                }

        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to create contact: {str(e)}'
            }

    def update_contact_by_email(
        self,
        email: str,
        properties: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Update a contact by email address

        Args:
            email: Contact email
            properties: Properties to update

        Returns:
            Dictionary with success status and contact details
        """
        try:
            # Search for contact by email
            search_response = requests.post(
                f'{self.base_url}/crm/v3/objects/contacts/search',
                headers=self._get_headers(),
                json={
                    'filterGroups': [{
                        'filters': [{
                            'propertyName': 'email',
                            'operator': 'EQ',
                            'value': email
                        }]
                    }]
                },
                timeout=10
            )

            if search_response.status_code == 200:
                results = search_response.json().get('results', [])
                if results:
                    contact_id = results[0]['id']

                    # Update contact
                    update_response = requests.patch(
                        f'{self.base_url}/crm/v3/objects/contacts/{contact_id}',
                        headers=self._get_headers(),
                        json={'properties': properties},
                        timeout=10
                    )

                    if update_response.status_code == 200:
                        data = update_response.json()
                        return {
                            'success': True,
                            'contact_id': data['id'],
                            'email': email,
                            'updated': True
                        }

            return {
                'success': False,
                'error': 'Contact not found or update failed'
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to update contact: {str(e)}'
            }

    def get_contact(self, contact_id: str) -> Dict[str, Any]:
        """
        Get a contact by ID

        Args:
            contact_id: HubSpot contact ID

        Returns:
            Dictionary with success status and contact details
        """
        try:
            response = requests.get(
                f'{self.base_url}/crm/v3/objects/contacts/{contact_id}',
                headers=self._get_headers(),
                timeout=10
            )

            if response.status_code == 200:
                data = response.json()
                return {
                    'success': True,
                    'contact': data
                }
            else:
                return {
                    'success': False,
                    'error': f'API returned status {response.status_code}'
                }

        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to get contact: {str(e)}'
            }

    def create_deal(
        self,
        deal_name: str,
        amount: Optional[float] = None,
        stage: Optional[str] = None,
        close_date: Optional[str] = None,
        associated_contacts: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Create a deal in HubSpot

        Args:
            deal_name: Name of the deal
            amount: Deal amount
            stage: Deal stage
            close_date: Expected close date (YYYY-MM-DD)
            associated_contacts: List of contact IDs to associate

        Returns:
            Dictionary with success status and deal details
        """
        try:
            properties = {'dealname': deal_name}

            if amount is not None:
                properties['amount'] = str(amount)
            if stage:
                properties['dealstage'] = stage
            if close_date:
                properties['closedate'] = close_date

            payload = {'properties': properties}

            # Add associations if provided
            if associated_contacts:
                payload['associations'] = [{
                    'to': {'id': contact_id},
                    'types': [{
                        'associationCategory': 'HUBSPOT_DEFINED',
                        'associationTypeId': 3  # Deal to Contact association
                    }]
                } for contact_id in associated_contacts]

            response = requests.post(
                f'{self.base_url}/crm/v3/objects/deals',
                headers=self._get_headers(),
                json=payload,
                timeout=10
            )

            if response.status_code in [200, 201]:
                data = response.json()
                return {
                    'success': True,
                    'deal_id': data['id'],
                    'deal_name': deal_name
                }
            else:
                return {
                    'success': False,
                    'error': f'API returned status {response.status_code}: {response.text}'
                }

        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to create deal: {str(e)}'
            }

    def create_company(
        self,
        name: str,
        domain: Optional[str] = None,
        industry: Optional[str] = None,
        phone: Optional[str] = None,
        additional_properties: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Create a company in HubSpot

        Args:
            name: Company name
            domain: Company domain
            industry: Industry
            phone: Phone number
            additional_properties: Additional custom properties

        Returns:
            Dictionary with success status and company details
        """
        try:
            properties = {'name': name}

            if domain:
                properties['domain'] = domain
            if industry:
                properties['industry'] = industry
            if phone:
                properties['phone'] = phone

            if additional_properties:
                properties.update(additional_properties)

            payload = {'properties': properties}

            response = requests.post(
                f'{self.base_url}/crm/v3/objects/companies',
                headers=self._get_headers(),
                json=payload,
                timeout=10
            )

            if response.status_code in [200, 201]:
                data = response.json()
                return {
                    'success': True,
                    'company_id': data['id'],
                    'name': name
                }
            else:
                return {
                    'success': False,
                    'error': f'API returned status {response.status_code}: {response.text}'
                }

        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to create company: {str(e)}'
            }


# Singleton instance
hubspot_client = HubSpotClient()
