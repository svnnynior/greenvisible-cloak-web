export interface ColorRangeRGB {
  min: {
    r: number;
    g: number;
    b: number;
  };
  max: {
    r: number;
    g: number;
    b: number;
  };
  tolerance: number;
}

export interface ColorRangeHSV {
  min: {
    h: number;
    s: number;
    v: number;
  };
  max: {
    h: number;
    s: number;
    v: number;
  };
}

export const BLUE_RGB_RANGE: ColorRangeRGB = {
  max: {
    r: 59,
    g: 50,
    b: 255,
  },
  min: {
    r: 0,
    g: 0,
    b: 60,
  },
  tolerance: 0.02,
};

export const GREEN_RGB_RANGE: ColorRangeRGB = {
  max: {
    r: 144, //59,
    g: 255,
    b: 167, //50,
  },
  min: {
    r: 13,
    g: 120, //80,
    b: 13,
  },
  tolerance: 0.01,
};

export const BLUE_HSV_RANGE: ColorRangeHSV = {
  min: {
    h: 220,
    s: 50,
    v: 50,
  },
  max: {
    h: 270,
    s: 100,
    v: 100,
  },
};

export const GREEN_HSV_RANGE: ColorRangeHSV = {
  min: {
    h: 110,
    s: 30,
    v: 94,
  },
  max: {
    h: 160,
    s: 27,
    v: 32,
  },
};

const calculateDistance = (c: number, min: number, max: number) => {
  if (c < min) return min - c;
  if (c > max) return c - max;

  return 0;
};

const isInRange = (value: number, min: number, max: number) => {
  return min <= value && value <= max;
};

export const calculateAlphaByDistance = (
  r: number,
  g: number,
  b: number,
  ref: ColorRangeRGB,
) => {
  let alpha = 255;
  let difference =
    calculateDistance(r, ref.min.r, ref.max.r) +
    calculateDistance(g, ref.min.g, ref.max.g) +
    calculateDistance(b, ref.min.b, ref.max.b);
  difference /= 255 * 3;
  if (difference < ref.tolerance) {
    alpha = 0;
  }
  return alpha;
};

export const calculateAlphaByRange = (
  r: number,
  g: number,
  b: number,
  ref: ColorRangeRGB,
) => {
  let alpha = 255;
  if (
    isInRange(r, ref.min.r, ref.max.r) &&
    isInRange(g, ref.min.g, ref.max.g) &&
    isInRange(b, ref.min.b, ref.max.b)
  ) {
    alpha = 0;
  }
  return alpha;
};

export const calculateAlphaGreen = (r: number, g: number, b: number) => {
  let alpha = 255;
  if (r <= 80 && g >= 120 && b <= 40) {
    alpha = 0;
  }
  return alpha;
};

export function rgb2hsv(r: number, g: number, b: number) {
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

export function calculateAlphaByHSV(
  r: number,
  g: number,
  b: number,
  ref: ColorRangeHSV,
) {
  let frameHSV = rgb2hsv(r, g, b);
  let alpha = 255;
  if (
    // isInRange(frameHSV.h, ref.min.h, ref.max.h) &&
    // isInRange(frameHSV.s, ref.min.s, ref.max.s) &&
    // isInRange(frameHSV.v, ref.min.v, ref.max.v)
    isInRange(frameHSV.h, ref.min.h, ref.max.h)
  ) {
    alpha = 0;
  }
  return alpha;
}
