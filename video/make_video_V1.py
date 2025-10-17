import os
import glob
from moviepy.editor import (
    ImageClip,
    AudioFileClip,
    concatenate_videoclips,
    CompositeAudioClip
)

# -------------------------------
# Config
# -------------------------------
slides_dir = "slides"   # relative folder containing PNG slides
output_video = "rescuemind_demo.mp4"

voiceover_file = "voiceover.mp3"   # narration file
music_file = "bg.mp3"              # background music (optional)

slide_duration = 6   # seconds per slide (if no voiceover sync)
fade_duration = 1    # fade transition between slides
music_volume = 0.15  # background music volume (0.0–1.0)

# -------------------------------
# Build video
# -------------------------------
def build_video():
    # Auto-discover slides (all PNGs in slides/)
    slides = sorted(glob.glob(os.path.join(slides_dir, "*.png")))
    if not slides:
        raise FileNotFoundError(f"No PNG slides found in {slides_dir}/")

    print(f"✅ Found {len(slides)} slides in {slides_dir}/")

    # Create video clips
    clips = []
    for path in slides:
        print(f"Adding slide: {os.path.basename(path)}")
        clip = (
            ImageClip(path)
            .set_duration(slide_duration)
            .fadein(fade_duration)
            .fadeout(fade_duration)
        )
        clips.append(clip)

    video = concatenate_videoclips(clips, method="compose")

    # Add audio
    audio_clips = []
    if os.path.exists(voiceover_file):
        print("🎙️ Adding voiceover...")
        voice = AudioFileClip(voiceover_file)
        audio_clips.append(voice)

    if os.path.exists(music_file):
        print("🎶 Adding background music...")
        music = AudioFileClip(music_file).volumex(music_volume)
        if "voice" in locals():
            music = music.set_duration(voice.duration)
        else:
            music = music.set_duration(video.duration)
        audio_clips.append(music)

    if audio_clips:
        final_audio = CompositeAudioClip(audio_clips)
        video = video.set_audio(final_audio)

    # Render final video
    print("🎬 Rendering video...")
    video.write_videofile(
        output_video,
        fps=30,
        codec="libx264",
        audio_codec="aac",
        preset="medium",
        threads=4
    )
    print(f"✅ Video created: {output_video}")


if __name__ == "__main__":
    build_video()
