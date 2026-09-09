from .essays import ESSAYS
from .bio_facts import BIO_FACTS
from .conversational_style import CONVERSATIONAL_STYLE
from .voice_notes import VOICE_NOTES
from .system_prompt_intro import SYSTEM_PROMPT_INTRO
from .boundaries import BOUNDARIES
from .current_context import CURRENT_CONTEXT
from .personality_and_stories import PERSONALITY_AND_STORIES

# Everything gets joined into one plain string here — the model has no
# concept of "separate files," it only ever sees whatever text this
# produces. Order is deliberate: framing/instructions first (who you
# are, how to behave), then supporting reference material (facts,
# essays, real conversational examples), then style guidance, with
# BOUNDARIES placed last so it reads as a final, hard-to-miss
# constraint rather than getting buried in the middle. CURRENT_CONTEXT
# and PERSONALITY_AND_STORIES sit alongside BIO_FACTS, since all three
# are "background about Rona" — just split into separate files because
# CURRENT_CONTEXT specifically goes stale and needs periodic updating,
# unlike the timeless facts in bio_facts.py.
SYSTEM_PROMPT = "\n\n".join([
    SYSTEM_PROMPT_INTRO,
    BIO_FACTS,
    CURRENT_CONTEXT,
    PERSONALITY_AND_STORIES,
    ESSAYS,
    CONVERSATIONAL_STYLE,
    VOICE_NOTES,
    BOUNDARIES,
])