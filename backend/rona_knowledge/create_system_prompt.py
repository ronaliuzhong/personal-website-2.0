from .essays import ESSAYS
from .bio_facts import BIO_FACTS
from .conversational_style import CONVERSATIONAL_STYLE
from .voice_notes import VOICE_NOTES
from .system_prompt_intro import SYSTEM_PROMPT_INTRO
from .boundaries import BOUNDARIES

# Everything gets joined into one plain string here — the model has no
# concept of "separate files," it only ever sees whatever text this
# produces. Order is deliberate: framing/instructions first (who you
# are, how to behave), then supporting reference material (facts,
# essays, real conversational examples), then style guidance, with
# BOUNDARIES placed last so it reads as a final, hard-to-miss
# constraint rather than getting buried in the middle.
SYSTEM_PROMPT = "\n\n".join([
    SYSTEM_PROMPT_INTRO,
    BIO_FACTS,
    ESSAYS,
    CONVERSATIONAL_STYLE,
    VOICE_NOTES,
    BOUNDARIES,
])