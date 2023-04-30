export function parseNgspiceOutput(output) {
  const lines = output.trim().split("\n");

  const data = {
    x: [],
    y: [],
  };

  for (const line of lines) {
    if (line.startsWith("Index")) {
      continue;
    }
    const [x, y] = line.trim().split(/\s+/).map(parseFloat);
    data.x.push(x);
    data.y.push(y);
  }

  return data;
}
