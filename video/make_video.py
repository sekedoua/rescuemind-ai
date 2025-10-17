import os
import asyncio
import PIL.Image
from moviepy.editor import (
    ImageClip, AudioFileClip, CompositeAudioClip,
    concatenate_videoclips
)
import edge_tts

# ------------------ PATCH for Pillow >=10 ------------------
if not hasattr(PIL.Image, 'ANTIALIAS'):
    PIL.Image.ANTIALIAS = PIL.Image.Resampling.LANCZOS
# -----------------------------------------------------------

# ------------------ CONFIG ------------------
slides_dir = "slides"                 # <— your slides folder
output_video = "rescuemind_demo.mp4"
narration_file = "narration.mp3"
bg_music_file = "bg.mp3"              # optional, will be used if present

voice = "en-US-GuyNeural"             # Energetic male
fps = 24
W, H = 1280, 720                      # 16:9 HD
fade_sec = 0.4

# Exact slide order (filenames inside slides_dir)
SLIDES = [
    "slide01.png",
    "slide02.png",
    "slide03.png",
    "slide04.png",
    "slide05.png",
    "slide06.png",
    "slide07.png",
    "slide07_AI_agent.png",
    "slide08.png",
    "slide09.png",
    "slide10.png",
    "slide11.png",
    "slide12.png",
    "slide13.png",
    "slide14.png",   # outro / acknowledgment
]

# Continuous narration (flows across all slides)
SCRIPT = """
Disasters demand speed, clarity, and coordination. RescueMind is here to transform crisis response.

We begin with the challenge: chaotic data, slow coordination, and lives at risk.

RescueMind changes the game by unifying data sources — weather alerts, social signals, and geolocation — into a single intelligent platform.

Our architecture runs fully on AWS: Lambdas ingest, process, and cluster real-time events, while OpenSearch powers fast insights, and DynamoDB ensures resilience.

AI Agents coordinate workflows: Ingest. Geocode. Compute. Persist. Notify. Each step driving smarter, faster response.

Field teams receive prioritized alerts, optimized routes, and dynamic clustering of incidents as they unfold.

Real-world demo results: real-time ingestion, clustering in seconds, live routing visualized on a map.

The impact: faster response times, improved resource allocation, and better decision making when every second matters.

Deployed seamlessly on AWS, RescueMind scales automatically with demand.

Built by Sekedoua, with AI-assisted development and design. Together, we redefine how technology saves lives.
"""
# --------------------------------------------

async def generate_voice():
    """Generate narration using Edge TTS."""
    communicate = edge_tts.Communicate(SCRIPT, voice)
    await communicate.save(narration_file)

def make_full_frame_clip(path: str, duration: float) -> ImageClip:
    """Load an image, resize to fully cover 1280x720, center-crop, set duration + fades."""
    clip = ImageClip(path)

    # Scale to cover 1280x720 while preserving aspect ratio
    iw, ih = clip.size
    scale = max(W / iw, H / ih)
    clip = clip.resize(scale)

    # Center crop if needed
    iw, ih = clip.size
    if iw != W or ih != H:
        clip = clip.crop(
            x_center=iw / 2, y_center=ih / 2, width=W, height=H
        )

    return (
        clip.set_duration(duration)
            .fadein(fade_sec)
            .fadeout(fade_sec)
    )

def build_video():
    # Ensure narration exists
    if not os.path.exists(narration_file):
        asyncio.run(generate_voice())

    narration = AudioFileClip(narration_file)
    total_dur = narration.duration
    per_slide = total_dur / len(SLIDES)

    # Build slide clips in order
    clips = []
    for name in SLIDES:
        path = os.path.join(slides_dir, name)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Missing slide: {path}")
        clips.append(make_full_frame_clip(path, per_slide))

    video = concatenate_videoclips(clips, method="compose").set_audio(narration)

    # Optional background music (ducked under voice)
    if os.path.exists(bg_music_file):
        music = AudioFileClip(bg_music_file).volumex(0.12).audio_fadein(1).audio_fadeout(1)
        # Match music length to video
        if music.duration < video.duration:
            loops = int(video.duration // music.duration) + 1
            music = concatenate_videoclips([music] * loops).set_duration(video.duration)
        else:
            music = music.set_duration(video.duration)
        mixed = CompositeAudioClip([music, narration.volumex(1.0)])
        video = video.set_audio(mixed)

    # Export
    video.write_videofile(
        output_video,
        fps=fps,
        codec="libx264",
        audio_codec="aac",
        preset="medium",   # use "faster" if you want a quicker export
        threads=4
    )

if __name__ == "__main__":
    build_video()
