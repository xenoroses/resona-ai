import express from 'express';
import cors from 'cors';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputsDir = path.join(rootDir, 'outputs');

if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
// Set 100MB body parser limit for handling large document uploads & papers
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/outputs', express.static(outputsDir));

// In-Memory Podcasts Library
let podcastLibrary = [];

// Helper: Run Python Core Script
function runPythonCore(jsonInput) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(rootDir, 'engine', 'resona_core.py');
    execFile('python', [scriptPath, '--json', jsonInput], { maxBuffer: 1024 * 1024 * 100 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Python Core Error:', stderr || error.message);
        return reject(error);
      }
      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (parseErr) {
        console.error('Failed to parse Python output:', stdout);
        reject(parseErr);
      }
    });
  });
}

// REST API Endpoints

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Resona AI Express API Server',
    version: '2.4.0',
    timestamp: new Date().toISOString()
  });
});

// 2. Generate Script & Render Audio Pipeline
app.post('/api/generate-podcast', async (req, res) => {
  try {
    const { topic, duration = 'medium' } = req.body;
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Valid topic string is required.' });
    }

    const result = await runPythonCore(topic);
    
    // Structure Podcast Record
    const podcastId = `podcast_${Date.now()}`;
    const audioUrl = `/outputs/${path.basename(result.audio_meta?.audio_file || 'resona_podcast.mp3')}`;

    const podcastRecord = {
      id: podcastId,
      topic: result.topic || topic.substring(0, 100),
      title: result.title || `Resona AI: Podcast Episode`,
      researchSummary: result.research_summary || 'Multi-agent analysis completed.',
      dialogue: result.dialogue || [],
      audioUrl: audioUrl,
      durationSec: result.audio_meta?.total_duration_sec || 30.0,
      timecodes: result.audio_meta?.timecodes || [],
      engine: result.audio_meta?.engine || 'Edge-TTS Dual-Voice Engine',
      createdAt: new Date().toISOString()
    };

    podcastLibrary.unshift(podcastRecord);

    res.json({ podcast: podcastRecord });
  } catch (error) {
    res.status(500).json({ error: 'Podcast generation failed', details: error.message });
  }
});

// 3. Render Custom Script to Audio (HITL Output)
app.post('/api/render-custom-script', async (req, res) => {
  try {
    const { title, topic, dialogue } = req.body;
    if (!dialogue || !Array.isArray(dialogue) || dialogue.length === 0) {
      return res.status(400).json({ error: 'Valid dialogue array is required.' });
    }

    const rendererScriptPath = path.join(rootDir, 'engine', 'audio_renderer.py');
    const filename = `resona_custom_${Date.now()}.mp3`;
    const jsonStr = JSON.stringify(dialogue);

    execFile('python', [rendererScriptPath, '--json', jsonStr, '--output', filename], { maxBuffer: 1024 * 1024 * 100 }, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: 'Audio render failed', details: stderr || error.message });
      }
      try {
        const audioMeta = JSON.parse(stdout);
        const podcastRecord = {
          id: `podcast_custom_${Date.now()}`,
          topic: topic || 'Custom Script',
          title: title || 'Edited Resona Episode',
          researchSummary: 'Human-in-the-Loop customized podcast episode.',
          dialogue: dialogue,
          audioUrl: `/outputs/${filename}`,
          durationSec: audioMeta.total_duration_sec || 30.0,
          timecodes: audioMeta.timecodes || [],
          engine: audioMeta.engine || 'Edge-TTS Dual-Voice Engine',
          createdAt: new Date().toISOString()
        };

        podcastLibrary.unshift(podcastRecord);
        res.json({ podcast: podcastRecord });
      } catch (pErr) {
        res.status(500).json({ error: 'Failed to parse audio output', details: pErr.message });
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Audio rendering failed', details: err.message });
  }
});

// 4. List Podcasts
app.get('/api/podcasts', (req, res) => {
  res.json({ podcasts: podcastLibrary });
});

// Global Express Error Catch Middleware for Body Limits
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      error: 'Payload Too Large',
      details: 'The uploaded file or pasted text exceeds maximum server payload limits. Please use a text snippet up to 50,000 characters.'
    });
  }
  next(err);
});

// Port & Error Handler
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Resona AI Node.js Express Server running on port ${PORT}`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`=======================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is in use. Retrying on port 5002...`);
    app.listen(5002, () => console.log(`  Resona AI Server running on fallback port 5002`));
  } else {
    console.error('Server error:', err);
  }
});
