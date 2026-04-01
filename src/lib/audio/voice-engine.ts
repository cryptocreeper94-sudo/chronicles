export class ProceduralVoiceEngine {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synth = window.speechSynthesis;
    // Load voices
    const loadVoices = () => {
      this.voices = this.synth.getVoices();
    };
    if (this.voices.length === 0) {
      this.synth.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }

  // Deterministically generate voice parameters based on character ID
  private getVoiceProfile(characterId: string) {
    let hash = 0;
    for (let i = 0; i < characterId.length; i++) {
      hash = characterId.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Normalize hash for parameters
    const normalizedHash = Math.abs(hash);
    
    // Select a voice based on hash (prefer English voices)
    const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
    const voiceList = englishVoices.length > 0 ? englishVoices : this.voices;
    
    let selectedVoice = null;
    if (voiceList.length > 0) {
      selectedVoice = voiceList[normalizedHash % voiceList.length];
    }

    // Determine Pitch (0.5 to 1.5)
    // We want some characters to sound deep, some high.
    const pitch = 0.6 + ((normalizedHash % 100) / 100) * 0.8;
    
    // Determine Rate (0.8 to 1.2)
    // We want some characters to speak slowly, some fast.
    const rate = 0.85 + (((normalizedHash >> 2) % 100) / 100) * 0.3;

    return { voice: selectedVoice, pitch, rate };
  }

  public speak(text: string, characterId: string = "player") {
    // Stop any current speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const profile = this.getVoiceProfile(characterId);

    if (profile.voice) {
      utterance.voice = profile.voice;
    }
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    utterance.volume = 1;

    this.synth.speak(utterance);
  }

  public stop() {
    this.synth.cancel();
  }
}

export const voiceEngine = new ProceduralVoiceEngine();
