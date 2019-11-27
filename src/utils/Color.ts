export function rgb2hsv(r: number, g: number, b: number) {
  console.log("rbg2hsv");
  let rr: number, gg: number, bb: number;
  const rabs = r / 255;
  const gabs = g / 255;
  const babs = b / 255;

  let h = 0;
  let s = 0;
  const v = Math.max(rabs, gabs, babs);
  const diff = v - Math.min(rabs, gabs, babs);
  const diffc = (c: number) => {
    return (v - c) / 6 / diff + 1 / 2;
  };
  const percentRoundFn = (num: number) => Math.round(num * 100) / 100;

  if (diff === 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = diffc(rabs);
    gg = diffc(gabs);
    bb = diffc(babs);

    if (rabs === v) {
      h = bb - gg;
    } else if (gabs === v) {
      h = 1 / 3 + rr - bb;
    } else if (babs === v) {
      h = 2 / 3 + gg - rr;
    }

    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return {
    h: Math.round(h * 360),
    s: percentRoundFn(s * 100),
    v: percentRoundFn(v * 100),
  };
}
