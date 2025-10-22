"""
Seed initial data for development
"""
import sys
import os
import json
from uuid import uuid4

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.shared.database import SessionLocal
from backend.workflow-service.app.models.workflow import WorkflowTemplate


def seed_workflow_templates():
    """
    Seed initial workflow templates
    """
    db = SessionLocal()

    try:
        # Check if templates already exist
        existing_count = db.query(WorkflowTemplate).count()
        if existing_count > 0:
            print(f"Database already contains {existing_count} templates. Skipping seed.")
            return

        templates = [
            {
                "name": "New Lead Follow-up",
                "description": "Automatically follow up with new leads via email and create CRM entry",
                "category": "sales",
                "icon": "mail",
                "template_data": {
                    "nodes": [
                        {
                            "id": "1",
                            "type": "trigger",
                            "position": {"x": 250, "y": 50},
                            "data": {"label": "New Lead", "triggerType": "webhook"}
                        },
                        {
                            "id": "2",
                            "type": "action",
                            "position": {"x": 250, "y": 150},
                            "data": {"label": "Send Welcome Email", "actionType": "email"}
                        },
                        {
                            "id": "3",
                            "type": "action",
                            "position": {"x": 250, "y": 250},
                            "data": {"label": "Create HubSpot Contact", "actionType": "hubspot"}
                        }
                    ],
                    "edges": [
                        {"id": "e1-2", "source": "1", "target": "2"},
                        {"id": "e2-3", "source": "2", "target": "3"}
                    ]
                },
                "is_published": True
            },
            {
                "name": "Customer Support Triage",
                "description": "Automatically categorize and route support tickets",
                "category": "support",
                "icon": "support",
                "template_data": {
                    "nodes": [
                        {
                            "id": "1",
                            "type": "trigger",
                            "position": {"x": 250, "y": 50},
                            "data": {"label": "New Ticket", "triggerType": "webhook"}
                        },
                        {
                            "id": "2",
                            "type": "condition",
                            "position": {"x": 250, "y": 150},
                            "data": {"label": "Check Priority", "condition": "priority == 'high'"}
                        },
                        {
                            "id": "3",
                            "type": "action",
                            "position": {"x": 100, "y": 250},
                            "data": {"label": "Notify Manager", "actionType": "slack"}
                        },
                        {
                            "id": "4",
                            "type": "action",
                            "position": {"x": 400, "y": 250},
                            "data": {"label": "Auto-respond", "actionType": "email"}
                        }
                    ],
                    "edges": [
                        {"id": "e1-2", "source": "1", "target": "2"},
                        {"id": "e2-3", "source": "2", "target": "3", "sourceHandle": "true"},
                        {"id": "e2-4", "source": "2", "target": "4", "sourceHandle": "false"}
                    ]
                },
                "is_published": True
            },
            {
                "name": "Meeting Scheduler",
                "description": "Schedule meetings and send calendar invites",
                "category": "productivity",
                "icon": "calendar",
                "template_data": {
                    "nodes": [
                        {
                            "id": "1",
                            "type": "trigger",
                            "position": {"x": 250, "y": 50},
                            "data": {"label": "Schedule Request", "triggerType": "manual"}
                        },
                        {
                            "id": "2",
                            "type": "humanApproval",
                            "position": {"x": 250, "y": 150},
                            "data": {"label": "Confirm Time"}
                        },
                        {
                            "id": "3",
                            "type": "action",
                            "position": {"x": 250, "y": 250},
                            "data": {"label": "Create Calendar Event", "actionType": "google_calendar"}
                        },
                        {
                            "id": "4",
                            "type": "action",
                            "position": {"x": 250, "y": 350},
                            "data": {"label": "Send Invites", "actionType": "email"}
                        }
                    ],
                    "edges": [
                        {"id": "e1-2", "source": "1", "target": "2"},
                        {"id": "e2-3", "source": "2", "target": "3"},
                        {"id": "e3-4", "source": "3", "target": "4"}
                    ]
                },
                "is_published": True
            }
        ]

        for template_data in templates:
            template = WorkflowTemplate(**template_data)
            db.add(template)

        db.commit()
        print(f"Successfully seeded {len(templates)} workflow templates!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_workflow_templates()
