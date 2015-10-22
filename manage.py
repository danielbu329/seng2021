#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "freeats.settings")

    from django.core.management import execute_from_command_line

    if len(sys.argv) >= 2 and sys.argv[1] == 'runserver':
        from facebook_collector import collector
        collector()
    execute_from_command_line(sys.argv)
