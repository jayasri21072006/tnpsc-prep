import json
import logging
import urllib.parse
from livekit.agents import RunContext, function_tool

logger = logging.getLogger("mobile_tools")


async def _send_mobile_action(context: RunContext, action_data: dict):
    try:
        room = context.session.room
        payload = json.dumps(action_data).encode("utf-8")
        await room.local_participant.publish_data(payload, topic="mobile_control")
        logger.info(f"Published mobile control payload: {action_data}")
    except Exception as e:
        logger.error(f"Failed to publish mobile control packet: {e}")


@function_tool
async def mobile_open_app(context: RunContext, app_name: str) -> str:
    """Open any app on the user's mobile phone (e.g. WhatsApp, YouTube, Spotify, Google Maps, Instagram, Camera, Phone, Settings)."""
    name_clean = app_name.lower().strip()
    app_schemes = {
        "whatsapp": "whatsapp://",
        "youtube": "https://www.youtube.com",
        "spotify": "spotify://",
        "maps": "geo:0,0?q=",
        "google maps": "geo:0,0?q=",
        "instagram": "https://www.instagram.com",
        "camera": "intent:#Intent;action=android.media.action.IMAGE_CAPTURE;end",
        "phone": "tel:",
        "dialer": "tel:",
        "sms": "sms:",
        "messages": "sms:",
        "gmail": "googlegmail://",
        "email": "mailto:",
        "chrome": "https://www.google.com",
    }

    uri = app_schemes.get(name_clean, f"https://www.google.com/search?q={urllib.parse.quote(app_name)}")
    await _send_mobile_action(context, {"action": "open_uri", "uri": uri, "name": app_name})
    return f"Opening {app_name} on your mobile phone now, Sir."


@function_tool
async def mobile_call_phone(context: RunContext, phone_number: str) -> str:
    """Initiate a phone call to any contact or phone number from the user's mobile device."""
    clean_number = "".join(c for c in phone_number if c.isdigit() or c == "+")
    uri = f"tel:{clean_number}"
    await _send_mobile_action(context, {"action": "open_uri", "uri": uri, "name": f"Call {phone_number}"})
    return f"Dialing {phone_number} on your phone, Sir."


@function_tool
async def mobile_send_sms(context: RunContext, phone_number: str, message: str = "") -> str:
    """Send an SMS text message to a contact or phone number from the mobile phone."""
    clean_number = "".join(c for c in phone_number if c.isdigit() or c == "+")
    encoded_body = urllib.parse.quote(message)
    uri = f"sms:{clean_number}?body={encoded_body}"
    await _send_mobile_action(context, {"action": "open_uri", "uri": uri, "name": "SMS"})
    return f"Opening message composer to {phone_number} on your phone, Sir."


@function_tool
async def mobile_navigate_maps(context: RunContext, destination: str) -> str:
    """Start GPS navigation or find directions to a location on Google Maps on the phone."""
    encoded_dest = urllib.parse.quote(destination)
    uri = f"geo:0,0?q={encoded_dest}"
    await _send_mobile_action(context, {"action": "open_uri", "uri": uri, "name": f"Directions to {destination}"})
    return f"Opening GPS directions to {destination} on your phone, Sir."


@function_tool
async def mobile_open_url(context: RunContext, url: str) -> str:
    """Open any webpage or link directly inside the user's mobile browser."""
    target = url.strip()
    if not target.startswith("http://") and not target.startswith("https://"):
        target = f"https://{target}"
    await _send_mobile_action(context, {"action": "open_uri", "uri": target, "name": url})
    return f"Opening {url} on your phone, Sir."
