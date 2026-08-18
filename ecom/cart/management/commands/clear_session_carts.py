from django.core.management.base import BaseCommand
from django.contrib.sessions.models import Session
from django.contrib.sessions.backends.db import SessionStore

class Command(BaseCommand):
    help = 'Clears the cart for all users stored in sessions'

    def handle(self, *args, **kwargs):
        # Iterate through all sessions
        for session in Session.objects.all():
            session_data = session.get_decoded()
            if 'cart' in session_data:  # Check if the session has cart data
                del session_data['cart']  # Remove the cart data
                session.session_data = SessionStore().encode(session_data)
                session.save()
        self.stdout.write(self.style.SUCCESS('Successfully cleared carts in all sessions'))