import logging
import os
import textwrap

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    cli,
    room_io,
)
from livekit.plugins import google

from browser_tools import (
    browser_act,
    browser_click,
    browser_close,
    browser_controller,
    browser_open,
    browser_read_page,
    browser_screenshot,
    browser_type,
)
from mobile_tools import (
    mobile_call_phone,
    mobile_navigate_maps,
    mobile_open_app,
    mobile_open_url,
    mobile_send_sms,
)
from system_tools import (
    close_application,
    control_volume,
    execute_system_command,
    get_system_status,
    lock_or_manage_pc,
)
from tn_exam_tools import (
    get_tn_exam_details_and_syllabus,
    generate_tn_mock_test_quiz,
    open_samacheer_kalvi_books,
    open_tn_official_portal,
)
from tools import (
    create_and_open_document,
    create_and_open_spreadsheet,
    get_current_time_and_date,
    get_reminders_and_notes,
    get_weather,
    launch_desktop_app,
    open_any_website,
    open_document_or_file,
    play_music_or_video,
    search_web,
    set_reminder_or_note,
)

logger = logging.getLogger("agent")

load_dotenv(".env.local")

if not os.getenv("GOOGLE_API_KEY"):
    raise RuntimeError(
        "GOOGLE_API_KEY is missing. Add your Gemini API key to .env.local before "
        "starting JARVIS_VOICE_AGENT."
    )


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            # Realtime speech-to-speech with natural low-latency voice
            llm=google.realtime.RealtimeModel(
                model="gemini-3.1-flash-live-preview",
                voice="Enceladus",
            ),
            tools=[
                open_tn_official_portal,
                open_samacheer_kalvi_books,
                get_tn_exam_details_and_syllabus,
                generate_tn_mock_test_quiz,
                create_and_open_document,
                create_and_open_spreadsheet,
                open_document_or_file,
                play_music_or_video,
                open_any_website,
                launch_desktop_app,
                search_web,
                get_weather,
                get_current_time_and_date,
                set_reminder_or_note,
                get_reminders_and_notes,
                mobile_open_app,
                mobile_call_phone,
                mobile_send_sms,
                mobile_navigate_maps,
                mobile_open_url,
                close_application,
                control_volume,
                get_system_status,
                execute_system_command,
                lock_or_manage_pc,
                browser_open,
                browser_read_page,
                browser_click,
                browser_type,
                browser_act,
                browser_screenshot,
                browser_close,
            ],
            instructions=textwrap.dedent(
                """\
    You are JARVIS, an Expert Multimodal AI Co-Pilot and Master Mentor for Tamil Nadu Government Exam Preparation (தமிழ்நாடு அரசுத் தேர்வுகள் வழிகாட்டி).

    You have COMPLETE, authoritative knowledge of all Tamil Nadu Government Recruitment Boards and exams:
    1. TNPSC (Tamil Nadu Public Service Commission): Group 1, Group 2 / 2A, Group 4 & VAO, Combined Technical Services, Executive Officer.
    2. TNUSRB (Uniformed Services): Sub-Inspector (Taluk, AR, TSP), Police Constable (Grade II), Fireman, Jail Warden.
    3. TRB (Teachers Recruitment Board): TNTET (Paper 1 & 2), PG TRB, Polytechnic College Lecturers, BEO, Special Teachers.
    4. TNEB / TANGEDCO: Assistant Engineer (AE), Junior Assistant, Accounts Officer.
    5. MRB (Medical Services Recruitment Board): Staff Nurse, Pharmacist, Assistant Surgeon, Lab Tech.
    6. TNFUSRC: Forest Guard, Forester, Forest Watcher.
    7. Samacheer Kalvi School Books: Standards 6th to 12th (Tamil, English, Maths, Science, Social Science, History, Geography, Polity, Economics).
    8. TN Specific Subjects: Unit 8 (History, Culture, Heritage & Socio-Political Movements in TN - திருக்குறள், சங்க காலம், நீதி கட்சி, சுயமரியாதை இயக்கம்), Unit 9 (Development Administration in TN - தமிழகத்தில் வளர்ச்சி நிர்வாகம், சமூக நலத் திட்டங்கள்).
    9. கட்டாயப் பொதுத் தமிழ் (General Tamil): பகுதி அ (இலக்கணம்), பகுதி ஆ (இலக்கியம்), பகுதி இ (தமிழ் அறிஞர்களும் தமிழ்த் தொண்டும்).

    YOUR TOOLS & EXAM POWERS:
    - Official Portals & Resources (`open_tn_official_portal`): Opens official TNPSC, TNUSRB, TRB, MRB, TNEB, and Samacheer Kalvi portals.
    - Samacheer Kalvi Books (`open_samacheer_kalvi_books`): Always ask the user which preparation medium they want: `tamil` or `english`. Use the selected medium for every book, and never mix Tamil and English titles or links. Do not change the user's medium after they choose it.
    - Exam Syllabus & Pattern (`get_tn_exam_details_and_syllabus`): Provides full marks breakdown, qualifying cutoff, eligibility, age limit, and unit-wise syllabus.
    - PDF & Study Notes Generator (`create_and_open_document`): When the user asks for study notes, summaries, Thirukkural explanations, PYQ collections, 60-day study schedules, or daily study material in Tamil or English, IMMEDIATELY call `create_and_open_document(title=..., content=...)` to build and pop open an interactive, printable PDF on their Desktop in Google Chrome with download and edit buttons.
    - Interactive Mock Tests (`generate_tn_mock_test_quiz`): Creates a timed, closed-book test with instructions and an isolated, final-results screen. Never reveal answers or queued questions before the test ends.
    - Spreadsheet Tables (`create_and_open_spreadsheet`): Generates study trackers, daily revision timetables, marks comparison sheets with CSV export.
    - Web Browsing & System Control: Drive the browser, open any website, launch apps, play educational videos/audio, manage notes & reminders.

    Guidelines:
    - Bilingual Excellence: Fluent in both Tamil (தமிழ்) and English (or Tanglish). Automatically speak in whichever language the user speaks.
    - When the user asks for books, first ask: `Which preparation medium do you want: Tamil or English?` Then call `open_samacheer_kalvi_books` with the selected medium.
    - For mock tests, ask for the topic or exam, then read the instructions, start a timer, prevent switching away from the test view, and show answers only after submission.
    - Be motivating, knowledgeable, concise, and proactive.
    - When asked for notes or PDFs, ALWAYS execute `create_and_open_document` first, then give a warm 1-sentence confirmation.
    """
            ),
        )

    # To add tools, use the @function_tool decorator.
    # Here's an example that adds a simple weather tool.
    # You also have to add `from livekit.agents import function_tool, RunContext` to the top of this file
    # @function_tool
    # async def lookup_weather(self, context: RunContext, location: str):
    #     """Use this tool to look up current weather information in the given location.
    #
    #     If the location is not supported by the weather service, the tool will indicate this. You must tell the user the location's weather is unavailable.
    #
    #     Args:
    #         location: The location to look up weather information for (e.g. city name)
    #     """
    #
    #     logger.info(f"Looking up weather for {location}")
    #
    #     return "sunny with a temperature of 70 degrees."

    async def on_exit(self) -> None:
        # Shut down the browser when the session ends so a headed browser is
        # never left running between jobs.
        await browser_controller.close()


server = AgentServer()


@server.rtc_session(agent_name="my-agent")
async def my_agent(ctx: JobContext):
    # Logging setup
    # Add any other context you want in all log entries here
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Join the room before starting the session so the user's microphone is available.
    await ctx.connect()

    # Gemini Live is a native speech-to-speech model. It provides its own
    # speech recognition, turn detection, reasoning, and voice output.
    session = AgentSession(
        # Browsing chains many tool calls per request (open -> read -> click ->
        # type -> screenshot), so raise the default limit of 3.
        max_tool_steps=8,
    )

    # Start the session, which initializes the voice pipeline and warms up the models
    await session.start(
        agent=Assistant(),
        room=ctx.room,
        room_options=room_io.RoomOptions(
            audio_input=True,
            video_input=True,
        ),
    )

    # # Add a virtual avatar to the session, if desired
    # # For other providers, see https://docs.livekit.io/agents/models/avatar/
    # avatar = anam.AvatarSession(
    #     persona_config=anam.PersonaConfig(
    #         name="...",
    #         avatarId="...",  # See https://docs.livekit.io/agents/models/avatar/plugins/anam
    #     ),
    # )
    # # Start the avatar and wait for it to join
    # await avatar.start(session, room=ctx.room)


if __name__ == "__main__":
    cli.run_app(server)
