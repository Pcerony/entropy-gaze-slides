/**
 * Crop a 2D flattened field grid to normalized [x0, y0, x1, y1] ROI bounds.
 * Matches the right-half sign face region (x: 44%..96%, y: 3%..97%) used in the terrain analysis.
 */
export function cropGrid(values, width, height, bounds = [0.44, 0.03, 0.96, 0.97]) {
  const [x0, y0, x1, y1] = bounds;
  const left = Math.ceil(x0 * (width - 1));
  const right = Math.floor(x1 * (width - 1));
  const top = Math.ceil(y0 * (height - 1));
  const bottom = Math.floor(y1 * (height - 1));
  if (left >= right || top >= bottom) {
    throw new Error('Crop must span at least two grid nodes per axis');
  }
  const result = [];
  for (let row = top; row <= bottom; row++) {
    for (let col = left; col <= right; col++) {
      result.push(values[row * width + col]);
    }
  }
  return {
    values: result,
    width: right - left + 1,
    height: bottom - top + 1,
    bounds: [
      left / (width - 1),
      top / (height - 1),
      right / (width - 1),
      bottom / (height - 1)
    ]
  };
}

/**
 * Find well-separated local maxima on a cropped grid for I1..I3, D1..D3, C1..C3 peak markers.
 */
export function selectPeaks(values, width, height, count = 3, minDistance = 10) {
  const candidates = [];
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const value = values[row * width + col];
      if (!(value > 0)) continue;
      let maximum = true;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const r = row + dr;
          const c = col + dc;
          if (r >= 0 && r < height && c >= 0 && c < width && values[r * width + c] > value) {
            maximum = false;
          }
        }
      }
      if (maximum) candidates.push({ row, col, value });
    }
  }
  candidates.sort((a, b) => b.value - a.value || a.row - b.row || a.col - b.col);
  const peaks = [];
  for (const candidate of candidates) {
    if (peaks.every(p => Math.hypot(p.row - candidate.row, p.col - candidate.col) >= minDistance)) {
      peaks.push(candidate);
    }
    if (peaks.length === count) break;
  }
  return peaks;
}
