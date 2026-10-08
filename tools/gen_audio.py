"""Озвучивает tools/texts.json голосами Kokoro (Apache 2.0) в audio/<voice>/<key>.mp3.

Подготовка (один раз):
  pip install kokoro-onnx soundfile lameenc
  скачать kokoro-v1.0.onnx и voices-v1.0.bin:
  https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0

Запуск: python tools/gen_audio.py <папка_с_моделью> [голос ...]
Уже готовые файлы пропускаются, так что после правок data.js озвучиваются только новые тексты.
"""
import json
import os
import sys
import time
from pathlib import Path

import lameenc
import numpy as np
import onnxruntime as rt
from kokoro_onnx import Kokoro

VOICES = {  # голос Kokoro -> язык произношения
    'af_heart': 'en-us', 'af_bella': 'en-us', 'am_michael': 'en-us',
    'am_fenrir': 'en-us', 'bf_emma': 'en-gb', 'bm_george': 'en-gb',
}

root = Path(__file__).resolve().parent.parent
models = Path(sys.argv[1])
voices = sys.argv[2:] or list(VOICES)
texts = json.loads((root / 'tools' / 'texts.json').read_text(encoding='utf-8'))
# KOKORO_THREADS ограничивает потоки — удобно, чтобы озвучивать несколько голосов параллельно
opts = rt.SessionOptions()
if os.getenv('KOKORO_THREADS'):
    opts.intra_op_num_threads = int(os.environ['KOKORO_THREADS'])
    opts.inter_op_num_threads = 1
session = rt.InferenceSession(str(models / 'kokoro-v1.0.onnx'), sess_options=opts, providers=['CPUExecutionProvider'])
kokoro = Kokoro.from_session(session, str(models / 'voices-v1.0.bin'))


def to_mp3(samples, sr):
    pcm = (np.clip(samples, -1, 1) * 32767).astype(np.int16)
    enc = lameenc.Encoder()
    enc.set_bit_rate(48)
    enc.set_in_sample_rate(sr)
    enc.set_channels(1)
    enc.set_quality(2)
    return enc.encode(pcm.tobytes()) + enc.flush()


for voice in voices:
    out = root / 'audio' / voice
    out.mkdir(parents=True, exist_ok=True)
    todo = [(k, t) for k, t in texts.items() if not (out / f'{k}.mp3').exists()]
    t0 = time.time()
    for i, (key, text) in enumerate(todo, 1):
        samples, sr = kokoro.create(text, voice=voice, speed=0.95, lang=VOICES[voice])
        # срезаем тишину по краям, оставляя 60 мс
        idx = np.where(np.abs(samples) > 0.01)[0]
        if len(idx):
            pad = int(sr * 0.06)
            samples = samples[max(0, idx[0] - pad):idx[-1] + pad]
        (out / f'{key}.mp3').write_bytes(to_mp3(samples, sr))
        if i % 100 == 0:
            print(f'{voice}: {i}/{len(todo)} ({time.time() - t0:.0f} с)', flush=True)
    print(f'{voice}: готово, {len(todo)} новых файлов за {time.time() - t0:.0f} с', flush=True)
